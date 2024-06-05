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

// import PersistentDrawerLeft from './components/Dummy';
// import PersistentDrawerLeft from './components/D';

function App() {

  return (
    <div className="App">
       <BrowserRouter>
        <Routes>
          <Route exact path="/new" element={<PersistentDrawerLeft/>}/>
          <Route exact path="/" element={<HomeScreen />} />
          {/* <Route exact path="/signup" element={<SignUp />} /> */}

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
