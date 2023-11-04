import React, {Component} from "react";
import Sketch from "react-p5";
import rocketImg from './rocket.png'

export default class SpaceSimulation extends Component {
  setup = (p5, canvasParentRef) => {
    p5.createCanvas(window.innerWidth, window.innerHeight).parent(
      canvasParentRef
    );
    this.height = window.innerHeight
    this.width = window.innerWidth
    // Orbital Section
    this.objects = [
      {
        "name": "M1",
        "mass": 6 * 10**24,  // In kg
        "position": [0, 0],
        "velocity": [0, (0)],
        "acceleration": [0, 0],
        "diameter": 7 * 10**7,
        "fixed": false
      },
      {
        "name": "M2",
        "mass": 7.35 * 10**22, // In kg
        "position": [4.055 * 10**8, 0],
        "velocity": [0, (970)],
        "acceleration": [0, 0],
        "diameter": 1.7*10**7,
        "fixed": false
      }
      // {
      //   "name": "rocket",
      //   "mass": 100000,
      //   "position": [0, 0],
      //   "velocity": [0, 0],
      //   "acceleration": [0, 0],
      //   "diameter": 50,
      //   "fixed": false
      // },
    ]   
    // Angle and rate at which angle of second planet increases 
    this.rocketImg = p5.loadImage(rocketImg)

    this.s_per_frame = 3*10 ** (3)
    this.m_per_pixel = 10 ** 6
    
    p5.background(25, 25, 25);
    // use parent to render canvas in this ref (without that p5 render this canvas outside your component)
  };
  draw = p5 => {
    this.t += 1;
    p5.translate(this.width/2, this.height/2); 
    
    p5.noStroke();
    p5.frameRate(this.fr);
  
    // p5.background(25, 25, 250,0.99);
    p5.fill(25, 25, 25, 35)
    p5.rect(-this.width/2, -this.height/2, this.width, this.height)

    p5.fill(0, 200, 200)
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
          console.log(this.total_a)
          this.objects[i]["acceleration"][0] += this.total_a * this.d_x / (this.r)
          this.objects[i]["acceleration"][1] += this.total_a * this.d_y / (this.r) 
        }
      }
      // Change velocity according to acceleration
      this.objects[i]["velocity"][0] += this.objects[i]["acceleration"][0] * this.s_per_frame     
      this.objects[i]["velocity"][1] += this.objects[i]["acceleration"][1] * this.s_per_frame     
      // console.log(this.objects[i]["acceleration"][0])
      // this.objects[i]["velocity"][0] = 0.5     
      // this.objects[i]["velocity"][1] = 0.5

      // this.objects[i]["velocity"][0] = 0     
      // this.objects[i]["velocity"][1] = 0
      // Change position according to velocity
      this.objects[i]["position"][0] += this.objects[i]["velocity"][0] * this.s_per_frame + this.objects[i]["acceleration"][0] * this.s_per_frame **2/2
      this.objects[i]["position"][1] += this.objects[i]["velocity"][1] * this.s_per_frame + this.objects[i]["acceleration"][0] * this.s_per_frame ** 2/2
      // Set the position of each objects
      p5.circle(this.objects[i]["position"][0] / this.m_per_pixel, this.objects[i]["position"][1]/ this.m_per_pixel, this.objects[i]["diameter"]/ this.m_per_pixel)  
    }
    
    p5.fill(255, 255, 255)

    

    // p5.ellipse(0, 0, 100, 100);
    
    
    // p5.fill(255);
    // p5.ellipse(this.x, this.y, 25, 25);

    // Everything after this rotates!
    // p5.translate(this.x_r-this.width/2, this.y_r-this.height/2)
    
    // p5.rotate(-0.01 * this.t)
    // p5.imageMode(p5.CENTER);
    // p5.image(this.rocketImg, this.x_r, this.y_r, 30, 30)

    // p5.rect(50, 50, 250, 250);
    // p5.fill(255);
    // p5.textStyle(p5.BOLD);
    // p5.textSize(140);
    // p5.text("p5*", 60, 250);
  };

    render() {
    return <Sketch setup={this.setup} draw={this.draw} />;
    }
}