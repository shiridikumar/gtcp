import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef } from 'react';
import { useCallback } from 'react';
import ReactFlow, {
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    Handle,
} from 'reactflow';
import 'reactflow/dist/style.css';
import "../main.css"
import DataObjectIcon from '@mui/icons-material/DataObject';

const node1 = ({ data }) => {
    return (
        <div>
            <Handle type="target" position="left" />
            <div style={{display:"flex",flexDirection:"column",padding:0 , border:"1px solid green", borderRadius:"20px"}}>
                <DataObjectIcon style={{ fontSize: "200px", color: "green" }} />
                <h2>Algorithm</h2>
            </div>
            <Handle type="source" position="right" />

        </div>
    )
}

const node2 = ({ data }) => {
    return (
        <div>
            <Handle type="target" position="left" />
            <div className="dataset" style={{display:"flex",flexDirection:"column" , border:"1px solid blue",alignItems:"center",justifyContent:"flex-end",height:"300px",width:"280px", borderRadius:"20px"}}>
                <i class="fa-solid fa-database fa-lg" style={{ color: "blue", fontSize: "200px" }}></i>
                <h2 style={{marginTop:"125px"}}>Dataset</h2>
            </div>
            <Handle type="source" position="right" />

        </div>
    )
}
const initialNodes = [
    { id: '1', position: { x: 100, y: 100 }, data: { label: '1' }, type: "Dataset" },
    { id: '2', position: { x: 500, y: 500 }, data: { label: '2' }, type: "custom" },
    { id: '3', position: { x: 900, y: 200 }, data: { label: '3' }, type: "custom" },
];
const initialEdges = [{ id: 'e1-2', source: '1', target: '2', animated:true , style: { strokeWidth: 5 } }];

export default function HomeScreen() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect = (params) => {
        const newEdge = {
          ...params,
          animated: true, // or any other properties you want to add
          style: { strokeWidth: 5 },
        };
        setEdges((els) => addEdge(newEdge, els));
    };
    const nodetypes = {
        "custom": node1,
        "Dataset": node2
    }

    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            {/* <div>
                <h1> Hello akanksha</h1>
                <i class="fa-solid fa-database fa-lg" style="color: #FFD43B;"></i>
            </div> */}
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodetypes}
            >
                <Background />
                <Controls />
            </ReactFlow>

        </div>
    );
}