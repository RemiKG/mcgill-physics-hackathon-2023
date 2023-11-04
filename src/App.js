import logo from './logo.svg';
import React, { Component } from "react";
import './App.css';
import SpaceSimulation from './SpaceSimulation';


export default class App extends Component {
 

  render() {
    return (
      <div className="App">
        <SpaceSimulation/>
      </div>
    )
  }
}