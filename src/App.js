import logo from './logo.svg';
import React, { createContext} from "react";
import './App.css';
import rocketImg from './rocket.png'
import Sketch from "react-p5";
import SpaceSimulation from './SpaceSimulation';


const App = () => {


  return (
    <div className="App">
      <h1>Orbital Simulations</h1>
      <SpaceSimulation />
    </div>
  )
}

export default App