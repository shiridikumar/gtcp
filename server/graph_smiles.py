from rdkit import Chem

def smiles_to_graph_transaction(smiles_data):
    """
    Converts a single SMILES string into a graph transaction format.

    Parameters:
    smiles_data (tuple): A tuple containing the molecule ID and the SMILES string.

    Returns:
    str: The graph transaction data for the single molecule.
    """
    smiles = smiles_data
    mol = Chem.MolFromSmiles(smiles)
    
    if mol is None:
        return "Invalid SMILES"  # Handle invalid SMILES case
    
    graph_data = []
    
    # Start the graph transaction format for this molecule
    graph_data.append(f"t # 1")
    
    # Add the atoms as nodes
    for atom in mol.GetAtoms():
        atom_id = atom.GetIdx()
        atom_symbol = atom.GetSymbol()
        graph_data.append(f"v {atom_id} {atom_symbol}")
    
    # Add the bonds as edges
    for bond in mol.GetBonds():
        start_atom = bond.GetBeginAtomIdx()
        end_atom = bond.GetEndAtomIdx()
        bond_type = bond.GetBondType()
        
        # Convert bond type to a number: single (1), double (2), triple (3), aromatic (4)
        if bond_type == Chem.rdchem.BondType.SINGLE:
            bond_type_str = "1"
        elif bond_type == Chem.rdchem.BondType.DOUBLE:
            bond_type_str = "2"
        elif bond_type == Chem.rdchem.BondType.TRIPLE:
            bond_type_str = "3"
        elif bond_type == Chem.rdchem.BondType.AROMATIC:
            bond_type_str = "4"
        else:
            bond_type_str = "1"  # Default to single bond

        graph_data.append(f"e {start_atom} {end_atom} {bond_type_str}")
    
    # Join all parts into a single string and return
    return "\n".join(graph_data)


from rdkit import Chem
from rdkit.Chem import AllChem
from rdkit.Chem import Draw
from io import BytesIO

def visualize_molecule(smiles):
    """
    Visualizes the 2D structure of a molecule from a SMILES string and stores the image in a BytesIO buffer.

    Parameters:
    smiles (str): The SMILES string of the molecule.

    Returns:
    img_buffer (BytesIO): A BytesIO buffer containing the image of the molecule.
    """
    # Convert SMILES to RDKit molecule
    mol = Chem.MolFromSmiles(smiles,sanitize=False)
    
    if mol is None:
        print("Invalid SMILES string!")
        return None
    # print()
    # Chem.SanitizeMol(mol)
    # mol = Chem.AddHs(mol)  # Add implicit hydrogens
    AllChem.Compute2DCoords(mol)  # Compute 2D coordinates for visualization
    
    # Create a PIL image object
    img = Draw.MolToImage(mol, size=(720, 720))
    # img.show()
    # Store the image in a BytesIO buffer
    # img_buffer = BytesIO()
    # img.save(img_buffer, format='PNG')  # Save the image to the buffer in PNG format
    # img_buffer.seek(0)  # Reset buffer position to the beginning

    return img

# Example usage
# smiles = "CC(=O)OC1=CC=CC=C1C(=O)O"  # Aspirin SMILES
# img_buffer = visualize_molecule(smiles)

# # If you want to display the image from the buffer, you can use the following code:
# if img_buffer:
#     from PIL import Image
#     img_from_buffer = Image.open(img_buffer)
#     img_from_buffer.show()


from rdkit import Chem
from rdkit.Chem import rdmolops

def graph_transaction_to_smiles(graph_data):
    """
    Converts a single graph transaction into SMILES format.

    Parameters:
    graph_data (str): A string representing the graph transaction for a single molecule.

    Returns:
    str: The SMILES string for the molecule.
    """
    mol = Chem.RWMol()  # RDKit editable molecule object
    atom_indices = {}  # Map of atom indices for the current molecule
    bonds = []  # List to store bond information
    
    for line in graph_data.splitlines():
        line = line.strip()
        
        if line.startswith('v'):
            # Add atom (node)
            _, atom_idx, atom_type = line.split()
            atom_idx = int(atom_idx)
            atom = Chem.Atom(atom_type)
            atom_indices[atom_idx] = mol.AddAtom(atom)  # Add atom to molecule
        
        elif line.startswith('e'):
            # Add bond (edge)
            _, atom1_idx, atom2_idx, bond_type = line.split()
            atom1_idx, atom2_idx = int(atom1_idx), int(atom2_idx)
            bond_type = int(bond_type)  # Convert bond type to integer
            bonds.append((atom1_idx, atom2_idx, bond_type))
    
    # After parsing all atoms and bonds, add bonds to the molecule
    mol = add_bonds_to_molecule(mol, bonds)
    
    # Convert the molecule to SMILES
    smiles = Chem.MolToSmiles(mol)
    return smiles

def add_bonds_to_molecule(mol, bonds):
    """
    Adds bonds to the molecule based on the bond list.
    
    Parameters:
    mol (rdkit.Chem.rdchem.RWMol): The editable RDKit molecule object.
    bonds (list of tuples): A list of tuples where each tuple is (atom1_idx, atom2_idx, bond_type).
    
    Returns:
    mol (rdkit.Chem.rdchem.RWMol): The molecule with added bonds.
    """
    bond_mapping = {1: Chem.BondType.SINGLE, 2: Chem.BondType.DOUBLE, 3: Chem.BondType.TRIPLE, 4: Chem.BondType.AROMATIC}
    
    for atom1_idx, atom2_idx, bond_type in bonds:
        bond = bond_mapping.get(bond_type, Chem.BondType.SINGLE)  # Default to single bond if unrecognized
        mol.AddBond(atom1_idx, atom2_idx, bond)
    
    return mol

# smiles = graph_transaction_to_smiles(graph_transaction_data)
# print(smiles_to_graph_transaction(smiles_data_act)==smiles_to_graph_transaction(smiles))
