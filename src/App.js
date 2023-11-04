import logo from './logo.svg';
import React, { Component } from "react";
import './App.css';
import rocketImg from './rocket.png'
import Sketch from "react-p5";
import SpaceSimulation from './SpaceSimulation';


export default class App extends Component {
  render() {
    return <SpaceSimulation/>;
  }
}