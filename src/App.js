import logo from './logo.svg';
import React, { createContext} from "react";
import './App.css';
import SpaceSimulation from './SpaceSimulation';


const App = () => {


  return (
    <div className="App">
      <h1>Space Simulation for Huhmann Theorie</h1>
      <SpaceSimulation />
    </div>
  )
}

export default App