import logo from './logo.svg';
import './App.css';
import React, { Component } from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  createBrowserRouter,
} from "react-router-dom";
import HomeScreen from './components/HomeScreen';
import PersistentDrawerLeft from './components/Dummy';
import ViewSubgraphs from './components/ViewSubgraphs';
import LandingPage from './components/LandingPage';

// import PersistentDrawerLeft from './components/Dummy';
// import PersistentDrawerLeft from './components/D';
{/* <ViewSubgraphs */}
function App() {
{/* <LandingPage */}
  return (
    <div className="App">
       <BrowserRouter>
        <Routes>
          <Route exact path="/new" element={<PersistentDrawerLeft/>}/>
          <Route exact path="/" element={<LandingPage />} />
          <Route exact path="/viewSubgraphs" element={<ViewSubgraphs />} />

          {/* <Route exact path="/signup" element={<SignUp />} /> */}

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
