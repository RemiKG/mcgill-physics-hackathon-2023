import React, { Component } from "react";
import Sketch from "react-p5";
import rocketImg from './rocket.png';
import RangeSlider from 'react-range-slider-input';
import InputSlider from "react-input-slider";
import {wait} from "@testing-library/user-event/dist/utils";

export default class SpaceSimulation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      massM1: 6 * 10 ** 24, // Initial mass of M1 in kg
      massM1Multiplier: 1, // Multiplier to change mass of M1
      sliderValue: 1,
      massM2: 7.35 * 10 ** 22, // Initial mass of M2 in kg
      massM2Multiplier: 1, // Multiplier to change mass of M2
      sliderValue2: 1,
      simulationStarted: false,
    };
  }

  setup = (p5) => {
    if (!this.canvasCreated) {
        p5.createCanvas(window.innerWidth, window.innerHeight)
         // Set a flag to indicate that the canvas has been created
        this.rocket = p5.loadImage(rocketImg)
        }
    
    this.height = window.innerHeight;
    this.width = window.innerWidth;
    // Orbital Section
    this.objects = [
      {
        "name": "M1",
        "mass": 6 * 10 ** 24, // In kg
        "position": [0, 0],
        "velocity": [0, 0],
        "acceleration": [0, 0],
        "diameter": 7 * 10 ** 7
      },
      {
        "name": "M2",
        "mass": 7.35 * 10 ** 22, // In kg
        "position": [4.055 * 10**8, 0],
        "velocity": [0, 970],
        "acceleration": [0, 0],
        "diameter": 1.7 * 10 ** 7
      },
      {
        "name": "M2",
        "mass": 1, // In kg
        "position": [0, 4.055 * 10**8],
        "velocity": [970, 0],
        "acceleration": [0, 0],
        "diameter": 5 * 10 ** 6
      }
      // {
      //   "name": "M2",
      //   "mass": 7.35 * 10 ** 22, // In kg
      //   "position": [-4.055 * 10**8, 0],
      //   "velocity": [0, -970],
      //   "acceleration": [0, 0],
      //   "diameter": 1.7 * 10 ** 7
      // },
      // {
      //   "name": "M2",
      //   "mass": 7.35 * 10 ** 22, // In kg
      //   "position": [0, -4.055 * 10**8],
      //   "velocity": [970, 0],
      //   "acceleration": [0, 0],
      //   "diameter": 1.7 * 10 ** 7
      // }
    ];

    // Angle and rate at which the angle of the second planet increases


    this.s_per_frame = 3*10 ** (3);
    this.m_per_pixel = 10 ** 6;

    p5.background(25, 25, 25);
  };
  draw = p5 => {
    if (!this.state.simulationStarted) {
      // this.comX = (this.objects[0]["position"][0] * this.objects[0]["mass"] + this.objects[0]["position"])
      //p5.circle((this.objects[i]["position"][0] - (this.objects[0]["position"][0])) / this.m_per_pixel, (this.objects[i]["position"][1] - this.objects[0]["position"][1]) / this.m_per_pixel, this.objects[i]["diameter"] / this.m_per_pixel)

      return;
    }
    this.kinetic = 0
    this.potential = 0
    this.t += 1;
    p5.translate(this.width/2, this.height/2); 
    
    p5.noStroke();
    p5.frameRate(this.fr);
  
    // p5.background(25, 25, 250,0.99);
    p5.fill(25, 25, 25, 35)
    p5.rect(-this.width/2, -this.height/2, this.width, this.height)


    // console.log(this.objects.length)
    
    
    // Set Acceleration according to gravity
    for(let i = 0; i < this.objects.length; i++){ 
      this.objects[i]["acceleration"][0] = 0      
      this.objects[i]["acceleration"][1] = 0      
      for (let j = 0; j < this.objects.length; j++) {
        if(j !== i){
          this.d_x = this.objects[j]["position"][0] - this.objects[i]["position"][0]
          this.d_y = this.objects[j]["position"][1] - this.objects[i]["position"][1]
          this.r = Math.sqrt(Math.pow(this.d_x, 2) + Math.pow(this.d_y, 2))
          this.total_a = this.objects[j]["mass"] * 6.6743 * Math.pow(10, -11) / Math.pow(this.r, 2)
          // this.total_a = (this.objects[j]["mass"] * 6.6743)
          // console.log(this.total_a)
          this.objects[i]["acceleration"][0] += this.total_a * this.d_x / (this.r)
          this.objects[i]["acceleration"][1] += this.total_a * this.d_y / (this.r) 
        }
      }
      // Change velocity according to acceleration
      this.objects[i]["velocity"][0] += this.objects[i]["acceleration"][0] * this.s_per_frame     
      this.objects[i]["velocity"][1] += this.objects[i]["acceleration"][1] * this.s_per_frame     

      // this.objects[i]["position"][0] += this.objects[i]["velocity"][0] * this.s_per_frame + this.objects[i]["acceleration"][0] * this.s_per_frame **2/2
      // this.objects[i]["position"][1] += this.objects[i]["velocity"][1] * this.s_per_frame + this.objects[i]["acceleration"][0] * this.s_per_frame ** 2/2
      this.temp1 = this.objects[i]["position"][0]
      this.temp2 = this.objects[i]["position"][1] 

      this.objects[i]["position"][0] += this.objects[i]["velocity"][0] * this.s_per_frame      
      this.objects[i]["position"][1] += this.objects[i]["velocity"][1] * this.s_per_frame 
      
      
      if(i == 0){
        p5.fill(0, 200, 200)
      } else if(i == 1){
        p5.fill(200, 0, 200)
      } else {
        p5.fill(255, 0, 0)
      }
      this.comX = (this.objects[0]["position"][0] * this.objects[0]["mass"] + this.objects[1]["position"][0] * this.objects[1]["mass"]) / (this.objects[0]["mass"] + this.objects[1]["mass"])
      this.comY = (this.objects[0]["position"][1] * this.objects[0]["mass"] + this.objects[1]["position"][1] * this.objects[1]["mass"]) / (this.objects[0]["mass"] + this.objects[1]["mass"])

      p5.circle((this.objects[i]["position"][0] - this.comX) / this.m_per_pixel, (this.objects[i]["position"][1] - this.comY)/ this.m_per_pixel, this.objects[i]["diameter"]/ this.m_per_pixel)
      p5.image(this.rocket, this.objects[i]["position"][0]/ this.m_per_pixel -this.rocket.width/2, this.objects[i]["position"][1]/ this.m_per_pixel-this.rocket.height/2); // draw the image
      // Monitor total energy : Energy = Kinetic energy + Potential energy
        // if(i==0){
        //   this.energy = 1/2 * this.objects[0]['mass'] * Math.sqrt(this.objects[0]['velocity'][0]**2+this.objects[0]['velocity'][1]**2)  + this.objects[0]['mass'] * this.total_a * this.r
        //   console.log(
        //     "energy", this.energy,
        //     this.objects[0]['mass'],
        //     this.objects[0]['velocity'],
        //     this.objects[0]['mass'],
        //     this.r)
      
      this.kinetic += this.objects[i]["mass"] * (this.objects[i]["velocity"][0] **2 + this.objects[i]["velocity"][1]**2)/2
      
      // console.log(this.kinetic)
    }
    this.potential = -this.objects[0]["mass"] * this.objects[1]["mass"] * 6.6743 * Math.pow(10, -11) / Math.sqrt((this.objects[0]["position"][0] - this.objects[1]["position"][0])**2 + (this.objects[0]["position"][1] - this.objects[1]["position"][1])**2)
    //console.log(this.kinetic + this.potential)
    p5.fill(255, 255, 255)


    };

  handleMass1Change = (value) => {
    const newValue = parseFloat(value.x);

    this.setState({ sliderValue: newValue });
    this.setState({ massM1Multiplier: newValue });

    if (newValue === 1) {
      this.objects[0].mass = 6 * 10 ** 24;
    } else if (newValue > 0) {
      this.objects[0].mass = (6 * 10 ** 24) * newValue;
    } else if (newValue < 0) {
      this.objects[0].mass = (6 * 10 ** 24) / (newValue);
    }
  };
    
  handleMass2Change = (value) => {
    const newValue = parseFloat(value.x);

    this.setState({ sliderValue2: newValue });
    this.setState({ massM2Multiplier: newValue });

    if (newValue === 1) {
      this.objects[1].mass = 7.35 * 10 ** 22;
    } else if (newValue > 0) {
      this.objects[1].mass = (7.35 * 10 ** 22) * newValue;
    } else if (newValue < 0) {
      this.objects[1].mass = (7.35 * 10 ** 22) / (newValue);
    }
  };
    
  resetSimulation = () => {
    window.location.reload();
  }

  startSimulation = () => {
    this.setState({ simulationStarted: true });
    this.draw()
  }

  pauseSimulation = () => {
    this.setState({ simulationStarted: false });
  }

  render() {
    return (
      <div class="contain">
        <div className="userParamsContainer">
          <p>Start the simulation : <button onClick={this.startSimulation}>START</button></p>
          <p>Pause the simulation : <button onClick={this.pauseSimulation}>PAUSE</button></p>
          <p>Refresh the simulation : <button onClick={this.resetSimulation}>RESET</button></p>
          <p>Multiplier for mass M1 : {(Math.round(this.state.sliderValue* 100) / 100).toFixed(2)}x the mass&nbsp;
          </p>
          <InputSlider
              axis="x"
              x={this.state.sliderValue}
              xmin={0}
              xmax={10}
              xstep={0.1}
              onChange={this.handleMass1Change}
              id={this.state.massM1Multiplier}
          />
          <p>Multiplier for mass M2 : {(Math.round(this.state.massM2Multiplier * 100) / 100).toFixed(2)}x the mass&nbsp;
          </p>
          <InputSlider
              axis="x"
              x={this.state.sliderValue2}
              xmin={0}
              xmax={10}
              xstep={0.1}
              onChange={this.handleMass2Change}
              id={this.state.massM2Multiplier}
          />
        </div>
        <Sketch setup={this.setup} draw={this.draw} />
        <br></br>
      </div>
    );
  }
}