import React, { Component } from "react";
import Sketch from "react-p5";
import rocketImg from './rocket.png';

export default class SpaceSimulation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      massM1: 6 * 10 ** 24, // Initial mass of M1 in kg
      massM1Multiplier: 1, // Multiplier to change mass of M1
      massM2: 7.35 * 10 ** 22, // Initial mass of M2 in kg
      massM2Multiplier: 1, // Multiplier to change mass of M2
    };
  }

  setup = (p5) => {
    if (!this.canvasCreated) {
        p5.createCanvas(window.innerWidth, window.innerHeight)
         // Set a flag to indicate that the canvas has been created
    }
    this.canvasCreated = true;
    
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
        "diameter": 7 * 10 ** 7,
        "fixed": false
      },
      {
        "name": "M2",
        "mass": 7.35 * 10 ** 22, // In kg
        "position": [4.055 * 10**8, 0],
        "velocity": [0, 970],
        "acceleration": [0, 0],
        "diameter": 1.7 * 10 ** 7,
        "fixed": false
      }
    ];

    // Angle and rate at which the angle of the second planet increases
    this.rocketImg = p5.loadImage(rocketImg);

    this.s_per_frame = 3*10 ** (3);
    this.m_per_pixel = 10 ** 6;

    p5.background(25, 25, 25);
  };
  draw = p5 => {
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
      }
      // this.comX = (this.objects[0]["position"][0] * )/()
      p5.circle((this.objects[i]["position"][0] - (this.objects[0]["position"][0] + this.objects[1]["position"][0]*this.objects)) / this.m_per_pixel, (this.objects[i]["position"][1] - this.objects[0]["position"][1])/ this.m_per_pixel, this.objects[i]["diameter"]/ this.m_per_pixel)  
      // Energy
      
      
      this.kinetic += this.objects[i]["mass"] * (this.objects[i]["velocity"][0] **2 + this.objects[i]["velocity"][1]**2)/2
      
      // console.log(this.kinetic)
    }
    this.potential = -this.objects[0]["mass"] * this.objects[1]["mass"] * 6.6743 * Math.pow(10, -11) / Math.sqrt((this.objects[0]["position"][0] - this.objects[1]["position"][0])**2 + (this.objects[0]["position"][1] - this.objects[1]["position"][1])**2)
    console.log(this.kinetic + this.potential)
    p5.fill(255, 255, 255)

    };

    handleMass1Change = (event) => {
        const newValue = parseFloat(event.target.value);
        this.setState({ massM1Multiplier: newValue });
    
        if (newValue === 0) {
          this.objects[0].mass = 6 * 10 ** 24;
        } else if (newValue > 0) {
          this.objects[0].mass = (6 * 10 ** 24) * newValue;
        } else if (newValue < 0) {
          this.objects[0].mass = (6 * 10 ** 24) * newValue;
        }
      };
    
      handleMass2Change = (event) => {
        const newValue = parseFloat(event.target.value);
        this.setState({ massM2Multiplier: newValue });
    
        if (newValue === 0) {
          this.objects[1].mass = 7.35 * 10 ** 22;
        } else if (newValue > 0) {
          this.objects[1].mass = (7.35 * 10 ** 22) * newValue;
        } else if (newValue < 0) {
          this.objects[1].mass = (7.35 * 10 ** 22) * newValue;
        }
      };
    
      resetSimulation = () => {
        window.location.reload();
      }

  render() {
    return (
      <div class="contain">
        <p>Refresh the simulation : <button onClick={this.resetSimulation}>RESET</button></p>
        <p>Multiplier for mass M1 : {this.state.massM1Multiplier}x the mass&nbsp;	 
          <input
            type="number"
            step="0.1"
            value={this.state.massM1Multiplier}
            onChange={this.handleMass1Change}
          />
        </p>
        <p>Multiplier for mass M2 : {this.state.massM2Multiplier}x the mass&nbsp;	 
          <input
            type="number"
            step="0.1"
            value={this.state.massM2Multiplier}
            onChange={this.handleMass2Change}
          />
        </p>
        <Sketch setup={this.setup} draw={this.draw} />
        <br></br>
      </div>
    );
  }
}
