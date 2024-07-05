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
import CircularProgress from '@mui/material/CircularProgress';

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
import CloseIcon from '@mui/icons-material/Close';
import { faCircle } from '@fortawesome/free-solid-svg-icons'; // Example icon from Font Awesome
import axios, { Axios } from "axios";
import { useNavigate } from 'react-router-dom';
import { width } from '@mui/system';
import AccordionUsage from './DropDown';
import FileUpload from './FileUpload';
import TopGrid from './TopGrid';
import CarouselComponent from './CarouselComponent';


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
  else if (type == "alg2") {
    background = "rgb(121 176 233)";
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
      <p>Dataset</p>
    </div>
  )
}


const node1 = ({ data }) => {
  return (
    getNode("alg1", "Subgraph Mining")
  )
}

const node2 = ({ data }) => {
  return (
    getNode("dataset", "Dataset")
  )
}

const node3 = ({ data }) => {
  return (
    getNode("alg2", "Coverage Pattern mining")
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
  { id: '3', position: { x: 900, y: 200 }, data: { label: '3' }, type: "pattern_algo" },
];
const initialEdges = [];

export default function PersistentDrawerLeft() {
  const theme = useTheme();
  const [datasets, setDatasets] = React.useState([]);
  const [props, setProps] = React.useState({ "datasets": [] });
  const [subgraph_algos, setSubgraphAlgos] = React.useState([]);
  const [pattern_algos, setPatternAlgos] = React.useState([]);
  const [dummy, setdummy] = React.useState(true);
  const [minGTC, setminGTC] = React.useState(0.5);
  const [minsup, setminsup] = React.useState(0.5);
  const [minGTPC, setminGTPC] = React.useState(0.5);
  const [maxOR, setmaxOR] = React.useState(0.5);

  const [datatab, setdatatab] = React.useState();
  const [algotab, setalgotab] = React.useState();


  const [currDataset, setCurrDataset] = useState("yeast");
  const [currDatasetId, setCurrDatasetId] = useState("6687b61354d22825ba44ed20")
  const [currsubgraphAlgo, setCurrsubgraphAlgo] = useState("gSpan");
  const [currPatternAlgo, setPatternAlgo] = useState("GTCP");
  const [loading, setLoading] = useState(false);
  const [imageData, setImageData] = useState('');



  const [reactflow, setreactflow] = useState();
  const navigate = useNavigate();


  const changeNodeType = (nodeId, newType) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId ? { ...node, type: newType } : node
      )
    );
  };

  const datasetclick = (name, id) => {
    setCurrDataset(name);
    setCurrDatasetId(id)
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
        setDatasets(response.data["datasets"])
        setSubgraphAlgos(response.data["subgraph_algos"]);
        setPatternAlgos(response.data["pattern_algos"]);
        setProps({ "datasets": response.data["datasets"], "subgraph_algos": response.data["subgraph_algos"], "pattern_algos": response.data["pattern_algos"] })
        setdummy(!(dummy));
      })
    }

    fetchData();
  }, [])

  React.useEffect(() => {
    const row = [];

    if (props) {
      row.push(<AccordionUsage datasets={props["datasets"]} subgraph_algos={props["subgraph_algos"]} pattern_algos={props["pattern_algos"]} fun={datasetclick} />)
    }
    const fin =
      (<div className='Datasets'>
        <div className="list-group" style={{ width: "100%" }}>
          {row}
        </div>
      </div>)
    setdatatab(fin);

  }, [props])


  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [connection1, setcon1] = useState(false);
  const [connection2, setcon2] = useState(false);
  const [cont, setcont] = useState();
  const [result, setResults] = useState();


  const onConnect = (params) => {
    const newEdge = {
      ...params,
      animated: true,
      style: { strokeWidth: 5 },
    };
    setEdges((els) => addEdge(newEdge, els));
    if (newEdge["source"] == 1 && newEdge["target"] == 2) {
      setcon1(true);
    }
    if (newEdge["source"] == 2 && newEdge["target"] == 3) {
      setcon2(true);
    }
  };

  const mineSubgraphs = async () => {
    setLoading(true);
    await axios.post(`http://localhost:5000/mineSubgraphs`, { dataset: currDatasetId, subgraph_algo: "gSpan", minsup: minsup }, {
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
      const queryString = new URLSearchParams({ "url": response.data["subgraphs"] }).toString();
      setcont(
        <div className="thresholds" style={{ marginTop: "30px" }}>
          <h4>Statistics</h4>
          <ol style={{ display: "flex", flexDirection: "column", justifyContent: "left", alignItems: "flex-start" }}>
            {row}
          </ol>
          <button className='btn btn-secondary' style={{ display: "flex", justifyContent: "center", width: "100%", marginTop: "20px", backgroundColor: "#2b5377" }} onClick={() => window.open(`/viewSubgraphs?${queryString}`, '_blank')}>View Subgraphs</button>
        </div>

      )
      setLoading(false);
    })

  }

  const showtop10 = (top10) => {
    // handleDrawerClose();
    return (
      <>
        <button className="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasTop" aria-controls="offcanvasTop">Toggle top offcanvas</button>

        <div className="offcanvas offcanvas-top" tabindex="-1" id="offcanvasTop" aria-labelledby="offcanvasTopLabel" style={{width:"100vw",height:"90vh"}}>
          <div className="offcanvas-header">
            <h5 id="offcanvasTopLabel">Offcanvas top</h5>
            <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>
          <div className="offcanvas-body">
            <CarouselComponent images={top10}/>
            {/* <img src={`data:image/png;base64,${top10[0][0]}`} alt="Plot" /> */}
          </div>
        </div>
      </>
    )
  }

  const handleDownload = (obj) => {
    const fileName = "data.json";
    const jsonStr = JSON.stringify(obj, null, 2);

    const blob = new Blob([jsonStr], { type: "application/json" });
    const href = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = href;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  };

  const minePattern = async () => {
    setLoading(true)
    await axios.post(`http://localhost:5000/mineGTCP`, { dataset: currDatasetId, subgraph_algo: "gSpan", minGTC: minGTC, minGTPC: minGTPC, maxOR: maxOR }, {
      headers: {

        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
        'Content-Type': "application/json",
      }

    }).then(response => {
      console.log(response.data, "************************")
      setImageData(response.data.image);
      setResults(
        <div>
          <form action="http://localhost:5000/getPatterns" target="_blank" method="post">
            <input type="hidden" id="arrayInput" name="arrayData" value={JSON.stringify(response.data["js"])} />
            <button className='btn btn-secondary' style={{ display: "flex", justifyContent: "center", width: "100%", marginTop: "20px", backgroundColor: "#2b5377" }} type='submit'>View Results</button>
          </form>
          {showtop10(response.data["images"])}
          {/* <button className='btn btn-secondary' style={{ display: "flex", justifyContent: "center", width: "100%", marginTop: "20px", backgroundColor: "#2b5377" }} onClick={() => console.log(response.data["images"][0])}>View Top 20 patterns</button> */}
          <button className='btn btn-secondary' style={{ display: "flex", justifyContent: "center", width: "100%", marginTop: "20px", backgroundColor: "#2b5377" }} onClick={() => { handleDownload(response.data["js"]) }}>Download Results</button>
        </div>
      )
      setLoading(false);

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
            <FileUpload />
            {datatab}
          </div>
          <div className='Algorithm-section' style={{ backgroundColor: "rgb(249 250 255)", borderRadius: "10px", padding: "10px", marginTop: "50px" }}>
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
          <div className='maincanvas' style={{ width: "100%", height: "90vh" }}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              nodeTypes={nodetypes}
            >
              <TopGrid dataset={currDataset} subgraph_algo={currsubgraphAlgo} pattern_algo={currPatternAlgo} />
              <Background variant="lines" color='lightgrey' size={20} gap={26} />
              <Controls />
            </ReactFlow>
          </div>
          <div style={{ minWidth: "25%", maxWidth: "30%", padding: "20px", display: "flex", flexDirection: "column", alignItems: "center", backgroundColor: "rgb(249, 250, 255)", height: "100%" }}>
            {connection2 &&
              <div style={{ marginBottom: "30px", width: "70%" }}>
                <div className="thresholds">
                  <h4> Graph transactional converage pattern</h4>
                  <br />
                  <label for="customRange1" className="form-label">min GTC : {minGTC}</label>
                  <input type="range" className="form-range" id="customRange1" onChange={(e) => { setminGTC(e.target.value / 100) }} />

                  <label for="customRange1" className="form-label">min GTPC : {minGTPC}</label>
                  <input type="range" className="form-range" id="customRange1" onChange={(e) => { setminGTPC(e.target.value / 100) }} />

                  <label for="customRange1" className="form-label">max OR : {maxOR}</label>
                  <input type="range" className="form-range" id="customRange1" onChange={(e) => { setmaxOR(e.target.value / 100) }} />
                  {/* <button className='btn btn-secondary' style={{ display: "flex", justifyContent: "center", width: "100%", marginTop: "20px", backgroundColor: "#2b5377" }} onClick={() => minePattern()}>Mine patterns</button> */}
                  <Box display="flex" justifyContent="center" alignItems="center" height="5vh" marginTop="20px">
                    {loading ? <CircularProgress /> : <button className='btn btn-secondary' style={{ display: "flex", justifyContent: "center", width: "100%", marginTop: "20px", backgroundColor: "#2b5377" }} onClick={() => minePattern()}>Mine patterns</button>}
                  </Box>
                  {result}
                </div>
              </div>
            }
            {connection1 &&
              <div className="thresholds">
                <h3>Subgraph mining</h3>
                <label for="customRange1" className="form-label">min Sup : {minsup}</label>
                <input type="range" className="form-range" id="customRange1" onChange={(e) => { setminsup(e.target.value / 100) }} />
                <Box display="flex" justifyContent="center" alignItems="center" height="5vh" marginTop="20px">
                  {loading ? <CircularProgress /> : <button className='btn btn-secondary' style={{ display: "flex", justifyContent: "center", width: "100%", marginTop: "20px", backgroundColor: "#2b5377" }} onClick={() => { mineSubgraphs() }}>Mine Sub Graphs</button>}
                </Box>
              </div>
            }
            {cont}
            <div>
              {imageData ? (
                <img src={`data:image/png;base64,${imageData}`} alt="Plot" />
              ) : (
                <p>Loading plot...</p>
              )}
            </div>
          </div>
        </div>

      </Main>
    </Box>
  );
}
