import rocketImg from './rocket.png'
import Sketch from "react-p5";
import React, { Component } from "react";

export default class SpaceShipHuhmann extends Component {
    setup = (p5) => {
      p5.createCanvas(window.innerWidth, window.innerHeight)
      this.height = window.innerHeight
      this.width = window.innerWidth
      // Angle and rate at which angle of second planet increases 
      this.theta = 0
      this.omega = 0.01
      // Constant radius
      this.r = 100;
      // Rocket position
      this.x_r = 200;
      this.y_r = 200;
      this.rocketImg = p5.loadImage(rocketImg)
      
      this.t = 0
      // use parent to render canvas in this ref (without that p5 render this canvas outside your component)
    };

    draw = p5 => {
      this.t += 1;
      p5.translate(this.width/2, this.height/2); 
      this.theta += this.omega
      this.x = this.r * Math.cos(this.theta);
      this.y = this.r * Math.sin(this.theta);
      
      p5.noStroke();
      p5.frameRate(this.fr);
      p5.background(25, 25, 25);
  
      p5.fill(0, 200, 200)
      p5.ellipse(0, 0, 100, 100);
      
      
      p5.fill(255);
      p5.ellipse(this.x, this.y, 25, 25);
  
      // Everything after this rotates!
      // p5.translate(this.x_r-this.width/2, this.y_r-this.height/2)
      
      p5.rotate(-0.01 * this.t)
      p5.imageMode(p5.CENTER);
      p5.image(this.rocketImg, this.x_r, this.y_r, 30, 30)
  
      // p5.rect(50, 50, 250, 250);
      // p5.fill(255);
      // p5.textStyle(p5.BOLD);
      // p5.textSize(140);
      // p5.text("p5*", 60, 250);
    };

    render() {
        return (
          <>
            <Sketch setup={this.setup} draw={this.draw} />
          </>
        )
    }
}
