
import networkx as nx
import matplotlib.pyplot as plt
import base64
from io import BytesIO

class graphDatabase:

    def __init__(self, iFile) ->  None:
        self.iFile = iFile

    def plot(self):
        with open(self.iFile, 'r') as file:
            lines = file.readlines()

        current_graph = None
        graphs = []
        vertex_labels = {}
        edge_labels = {}

        for line in lines:
            print(line)
            if line.startswith('t #'):
                if current_graph is not None:
                    if(len(graphs)>=100):
                        break
                    graphs.append((current_graph, vertex_labels, edge_labels))
                current_graph = nx.Graph()
                vertex_labels = {}
                edge_labels = {}
            elif line.startswith('v'):
                _, vertex_id, label = line.split()
                current_graph.add_node(int(vertex_id))
                vertex_labels[int(vertex_id)] = label
            elif line.startswith('e'):
                _, source, target, label = line.split()
                current_graph.add_edge(int(source), int(target))
                edge_labels[(int(source), int(target))] = label

        if current_graph is not None:
            graphs.append((current_graph, vertex_labels, edge_labels))

        n_rows = int(len(graphs) ** 0.5)
        n_cols = (len(graphs) // n_rows) + (len(graphs) % n_rows > 0)

        plt.figure(figsize=(n_cols * 4, n_rows * 4))

        for i, (graph, vertex_labels, edge_labels) in enumerate(graphs):
            ax = plt.subplot(n_rows, n_cols, i + 1)
            pos = nx.spring_layout(graph)
            nx.draw(graph, pos, labels=vertex_labels, ax=ax, with_labels=True, node_color='lightblue',
                    node_size=500, font_size=10, font_weight='bold')
            nx.draw_networkx_edge_labels(graph, pos, edge_labels=edge_labels, ax=ax, font_color='black')
            ax.set_title(f"Frequent Subgraph {i + 1}")

        plt.tight_layout()
        plt.show()
    
    def savefig(self,path):
        with open(self.iFile, 'r') as file:
            lines = file.readlines()

        current_graph = None
        graphs = []
        vertex_labels = {}
        edge_labels = {}

        for line in lines:
            if line.startswith('t #'):
                if current_graph is not None:
                    if(len(graphs)>=100):
                        break
                    graphs.append((current_graph, vertex_labels, edge_labels))
                current_graph = nx.Graph()
                vertex_labels = {}
                edge_labels = {}
            elif line.startswith('v'):
                _, vertex_id, label = line.split()
                current_graph.add_node(int(vertex_id))
                vertex_labels[int(vertex_id)] = label
            elif line.startswith('e'):
                _, source, target, label = line.split()
                current_graph.add_edge(int(source), int(target))
                edge_labels[(int(source), int(target))] = label

        if current_graph is not None:
            if(len(graphs)<100):
                graphs.append((current_graph, vertex_labels, edge_labels))

        n_rows = int(len(graphs) ** 0.5)
        n_cols = (len(graphs) // n_rows) + (len(graphs) % n_rows > 0)

        plt.figure(figsize=(n_cols * 4, n_rows * 4))

        for i, (graph, vertex_labels, edge_labels) in enumerate(graphs):
            ax = plt.subplot(n_rows, n_cols, i + 1)
            pos = nx.spring_layout(graph)
            nx.draw(graph, pos, labels=vertex_labels, ax=ax, with_labels=True, node_color='lightblue',
                    node_size=500, font_size=10, font_weight='bold')
            nx.draw_networkx_edge_labels(graph, pos, edge_labels=edge_labels, ax=ax, font_color='black')
            ax.set_title(f"Frequent Subgraph {i + 1}")

        plt.tight_layout()
        plt.savefig(path)
    
    def getcomb(self,reqids):
        with open(self.iFile, 'r') as file:
            lines = file.readlines()

        current_graph = None
        graphs = {}
        vertex_labels = {}
        edge_labels = {}
        prev=0
        for line in lines:
            if line.startswith('t #'):
                line=line.replace("\n","")
                if current_graph is not None:
                    if(len(graphs)>=100):
                        break
                    if(prev in reqids):
                        graphs.update({prev:(current_graph, vertex_labels, edge_labels)})
                prev=int(line.split()[-1])
                current_graph = nx.Graph()
                vertex_labels = {}
                edge_labels = {}
            elif line.startswith('v'):
                _, vertex_id, label = line.split()
                current_graph.add_node(int(vertex_id))
                vertex_labels[int(vertex_id)] = label
            elif line.startswith('e'):
                _, source, target, label = line.split()
                current_graph.add_edge(int(source), int(target))
                edge_labels[(int(source), int(target))] = label

        if current_graph is not None:
            if(prev in reqids and len(graphs)<100):
                graphs.update({prev:(current_graph, vertex_labels, edge_labels)})
        
        # print(graphs)
        return graphs
    

    def plot_given(self,graphs,reqids):
        n_rows = int(len(graphs) ** 0.5)
        n_cols = (len(graphs) // n_rows) + (len(graphs) % n_rows > 0)
        plt.figure(figsize=(n_cols * 4, n_rows * 4))
        for i, (graph, vertex_labels, edge_labels) in enumerate(graphs):
            ax = plt.subplot(n_rows, n_cols, i + 1)
            pos = nx.spring_layout(graph)
            nx.draw(graph, pos, labels=vertex_labels, ax=ax, with_labels=True, node_color='lightblue',
                    node_size=500, font_size=10, font_weight='bold')
            nx.draw_networkx_edge_labels(graph, pos, edge_labels=edge_labels, ax=ax, font_color='black')
            ax.set_title(f"Graph id {reqids[i]}")

        plt.tight_layout()
        buf = BytesIO()
        plt.savefig(buf, format='png')
        buf.seek(0)
        plt.close()

        image_base64 = base64.b64encode(buf.read()).decode('utf-8')
        return image_base64




obj=graphDatabase("Toydata.txt")
obj.savefig("temp.png")