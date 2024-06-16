import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef, useState } from 'react';
import { useCallback } from 'react';
import DataObjectIcon from '@mui/icons-material/DataObject';
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
// import DataObjectIcon from '@mui/icons-material/DataObject';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import CloseIcon from '@mui/icons-material/Close';
import { faCircle } from '@fortawesome/free-solid-svg-icons'; // Example icon from Font Awesome
import axios, { Axios } from "axios";
import { useNavigate } from 'react-router-dom';


const drawerWidth = 400;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const getNode = (type, name) => {
  let background = "#eee";
  if (type == "alg1") {
    background = "rgb(90 255 185)";
  }
  let first = name.charAt(0).toUpperCase();
  return (
    <>
      <Handle type="target" position="left" />
      <div style={{ width: '200px', height: '200px', background: background, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: "100px", fontFamily: "cursive" }}>{first}</span>
      </div>
      <p>{name}</p>
      <Handle type="source" position="right" />
    </>
  )
}


const getNode2 = (type, name) => {
  let background = "#eee";
  let cont = name + " Dataset";
  if (type == "alg1") {
    background = "rgb(90 255 185)";
    cont = name + " Algorithm";

  }
  let first = name.charAt(0).toUpperCase();
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      {/* <Handle type="target" position="left" /> */}
      <div style={{ width: '170px', height: '150px', background: background, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: "70px", fontFamily: "cursive" }}>{first}</span>
      </div>
      <p>{cont}</p>
    </div>
  )
}


const node1 = ({ data }) => {
  return (
    getNode("alg1", "gSpan")
  )
}

const node2 = ({ data }) => {
  return (
    getNode("dataset", "Yeast")
  )
}



const node3 = ({ data }) => {
  return (
    getNode("alg2", "Dataset")
  )
}

const nodetypes = {
  "subgraph_algo": node1,
  "Dataset": node2,
  "pattern_algo": node3
}


const initialNodes = [
  { id: '1', position: { x: 100, y: 100 }, data: { label: '1' }, type: "Dataset" },
  { id: '2', position: { x: 500, y: 500 }, data: { label: '2' }, type: "subgraph_algo" },
  { id: '3', position: { x: 900, y: 200 }, data: { label: '3' }, type: "subgraph_algo" },
];
const initialEdges = [];

export default function PersistentDrawerLeft() {
  const theme = useTheme();
  const [datasets, setDatasets] = React.useState([]);
  const [subgraph_algos, setSubgraphAlgos] = React.useState([]);
  const [pattern_algos, setPatternAlgos] = React.useState([]);
  const [dummy, setdummy] = React.useState(true);
  const [minGTC, setminGTC] = React.useState(0.5);
  const [minsup, setminsup] = React.useState(0.5);
  const [minGTPC, setminGTPC] = React.useState(0.5);
  const [maxOR, setmaxOR] = React.useState(0.5);

  const [datatab, setdatatab] = React.useState();
  const [algotab, setalgotab] = React.useState();

  const [currDataset, setCurrDataset] = useState("");
  const [currsubgraphAlgo, setCurrsubgraphAlgo] = useState("");
  const [currPatternAlgo, setPatternAlgo] = useState("");

  const [reactflow, setreactflow] = useState();
  const navigate=useNavigate();


  const changeNodeType = (nodeId, newType) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId ? { ...node, type: newType } : node
      )
    );
  };
  const datasetclick = (name) => {
    setCurrDataset(name);
    let flag = true;
    for (var i = 0; i < initialNodes.length; i++) {
      if (initialNodes[i]["type"] == "Dataset") {
        changeNodeType('1', 'subgraph_algo');
      }
    }
  }






  const [open, setOpen] = React.useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  React.useEffect(() => {
    const fetchData = async () => {
      console.log("hello fetch data")
      await axios.get(`http://localhost:5000/get_datasets_algos`, {
        headers: {

          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
          'Content-Type': "application/json",
        }

      }).then(response => {
        setDatasets(response.data["data"])
        setSubgraphAlgos(response.data["subgraph_algos"]);
        setPatternAlgos(response.data["pattern_algos"]);
        setdummy(!(dummy));
      })
    }

    fetchData();
  }, [])

  React.useEffect(() => {
    const row = [];
    if (datasets) {
      for (var i = 0; i < datasets.length; i++) {
        row.push(
          <a onClick={() => { datasetclick(datasets[i]) }} class="list-group-item list-group-item-action" style={{ textAlign: "left", cursor: "pointer" }}>{datasets[i]}  <DataObjectIcon style={{ color: "#2b5377" }} /></a>
        )
        row.push(
          <a onClick={() => { datasetclick(datasets[i]) }} class="list-group-item list-group-item-action" style={{ textAlign: "left", cursor: "pointer" }}>{datasets[i]}  <DataObjectIcon style={{ color: "#2b5377" }} /></a>
        )
        row.push(
          <a onClick={() => { datasetclick(datasets[i]) }} class="list-group-item list-group-item-action" style={{ textAlign: "left", cursor: "pointer" }}>{datasets[i]}  <DataObjectIcon style={{ color: "#2b5377" }} /></a>
        )
      }
    }
    const fin =
      (<div className='Datasets'>
        <div class="list-group" style={{ width: "100%" }}>
          {row}
        </div>
      </div>)
    setdatatab(fin);

  }, [datasets])


  React.useEffect(() => {
    const row = [];
    if (subgraph_algos) {
      for (var i = 0; i < subgraph_algos.length; i++) {
        row.push(<div onClick={() => { setCurrsubgraphAlgo(subgraph_algos[i]) }} style={{ cursor: "pointer" }}>
          <a onClick={() => { setCurrsubgraphAlgo(subgraph_algos[i]) }} class="list-group-item list-group-item-action" style={{ textAlign: "left", cursor: "pointer" }}>{subgraph_algos[i]}  <DataObjectIcon style={{ color: "#2b5377" }} /></a>
        </div>
        )
      }
    }
    const fin =
      (<div className='Algos'>
        <div class="list-group" style={{ width: "100%" }}>
          {row}
        </div>
      </div>)
    setalgotab(fin);

  }, [subgraph_algos])


  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [connection1, setcon1] = useState(false);
  const [connection2, setcon2] = useState(false);
  const [cont, setcont] = useState();


  const onConnect = (params) => {
    const newEdge = {
      ...params,
      animated: true,
      style: { strokeWidth: 5 },
    };
    setEdges((els) => addEdge(newEdge, els));
    console.log(newEdge, "???????????????????????");
    if (newEdge["source"] == 1 && newEdge["target"] == 2) {
      setcon1(true);
    }
    if (newEdge["source"] == 2 && newEdge["target"] == 3) {
      setcon2(true);
    }
  };

  const mineSubgraphs = async () => {
    await axios.post(`http://localhost:5000/mineSubgraphs`, { dataset: "Yeast", subgraph_algo: "gSpan", minsup: minsup }, {
      headers: {

        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
        'Content-Type': "application/json",
      }

    }).then(response => {
      const row = []
      for (var i = 0; i < response.data["file_content"].length; i++) {
        row.push(<li>{response.data["file_content"][i]}</li>)
      }
      const queryString = new URLSearchParams({"url":response.data["subgraphs"]}).toString();
      setcont(
        <div className="thresholds" style={{marginTop:"30px"}}>
          <h4>Statistics</h4>
          <ol style={{display:"flex",flexDirection:"column",justifyContent:"left",alignItems:"flex-start"}}>
          {row}
          </ol>
          <button className='btn btn-secondary' style={{ display: "flex", justifyContent: "center", width: "100%", marginTop: "20px", backgroundColor: "#2b5377" }} onClick={()=>window.open(`/viewSubgraphs?${queryString}`, '_blank')}>View Subgraphs</button>
        </div>
      )

      // console.log(response.data,"`http://localhost:5000/*****************");
    })

  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open} sx={{ backgroundColor: "#2b5377" }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Graph transactional coverage patterns
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          <div className='Datasets-section' style={{ backgroundColor: "rgb(249 250 255)", borderRadius: "0px", padding: "10px" }}>
            <h4 style={{ textAlign: "left", color: "gray" }}>Datasets</h4>
            <button className='btn btn-secondary' style={{ display: "flex", justifyContent: "flex-start", marginBottom: "20px", width: "200px", backgroundColor: "#2b5377" }}>Add new <FileUploadIcon sx={{ marginLeft: "5px" }} /></button>
            {datatab}

          </div>
          {/* <hr/> */}
          <div className='Algorithm-section' style={{ backgroundColor: "rgb(249 250 255)", borderRadius: "10px", padding: "10px", marginTop: "50px" }}>
            <h4 style={{ textAlign: "left", color: "gray" }}>Subgraph mining algorithms</h4>
            {algotab}
          </div>

        </List>
        <Divider />
        <List>

        </List>
      </Drawer>
      <Main open={open} sx={{ padding: "0px" }}>
        <DrawerHeader />
        <div className="main" style={{ display: "flex", flexDirection: "row", padding: "0px" }}>
          <div className='maincanvas' style={{ width: "100%", height: "85vh" }}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              nodeTypes={nodetypes}
            >
              <Background variant="lines" size={6} gap={26} />
              <Controls />
            </ReactFlow>
          </div>
          <div style={{ minWidth: "30%", padding: "20px", display: "flex", flexDirection: "column", alignItems: "center", backgroundColor: "rgb(249, 250, 255)", height: "100%" }}>
            {/* <div className='thresholds'> */}
            {connection1 &&
              <div className="thresholds">
                <h3>Subgraph mining</h3>
                <label for="customRange1" className="form-label">min Sup : {minsup}</label>
                <input type="range" className="form-range" id="customRange1" onChange={(e) => { setminsup(e.target.value / 100) }} />
                <button className='btn btn-secondary' style={{ display: "flex", justifyContent: "center", width: "100%", marginTop: "20px", backgroundColor: "#2b5377" }} onClick={() => { mineSubgraphs() }}>Mine Sub Graphs</button>
              </div>
            }
            {cont}
            {connection2 &&
              <div style={{ marginTop: "100px" }}>
                <div className="thresholds">
                  <h4> Graph transactional converage pattern</h4>
                  <br />
                  <label for="customRange1" className="form-label">min GTC : {minGTC}</label>
                  <input type="range" className="form-range" id="customRange1" onChange={(e) => { setminGTC(e.target.value / 100) }} />

                  <label for="customRange1" className="form-label">min GTPC : {minGTPC}</label>
                  <input type="range" className="form-range" id="customRange1" onChange={(e) => { setminGTPC(e.target.value / 100) }} />

                  <label for="customRange1" className="form-label">max OR : {maxOR}</label>
                  <input type="range" className="form-range" id="customRange1" onChange={(e) => { setmaxOR(e.target.value / 100) }} />
                  <button className='btn btn-secondary' style={{ display: "flex", justifyContent: "center", width: "100%", marginTop: "20px", backgroundColor: "#2b5377" }}>Mine patterns</button>

                </div>
              </div>
            }
          </div>
        </div>

      </Main>
    </Box>
  );
}
