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

function App() {
  return (
    <div className="App">
       <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<HomeScreen/>}/>
          {/* <Route exact path="/dashboard" element={<Dashboard />} /> */}
          {/* <Route exact path="/signup" element={<SignUp />} /> */}

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
