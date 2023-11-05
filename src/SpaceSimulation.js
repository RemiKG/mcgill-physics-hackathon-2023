import React, { Component } from "react";
import Sketch from "react-p5";
import rocketImg from './rocket.png';
import earthImg from './earth-transparent-png-9.png';
import moonImg from './full-moon-transparent-background-7.png'
import InputSlider from "react-input-slider";

export default class SpaceSimulation extends Component {
  constructor(props) {
    super(props);
    this.state = { // Initial mass of M1 in kg
      massM1Multiplier: 1, // Multiplier to change mass of M1
      sliderValue: 1,// Initial mass of M2 in kg
      massM2Multiplier: 1, // Multiplier to change mass of M2
      sliderValue2: 1,// Initial velocity of M2 in m/s
      velocityM2Multiplier: 1, // Multiplier to change velocity of M2
      sliderValue3: 1,
      distanceMultiplier: 1, // Multiplier to change distance between M1 and M2
      sliderValue4: 1, // Initial distance between M1 and M2 in m
      simulationStarted: false,
      propulsion: false,
    };
  }
  stars = [];


  initializeStars = (p5) => {
    for (let i = 0; i < 50; i++) {
      let x, y;
      x = p5.random(-this.width/2, this.width/2);
      y = p5.random(-this.height/2, this.height/2);

      const speed = p5.random(1, 3); // Adjust the speed
      this.stars.push({ x, y, speed });
    }
  };

  starDirection;


  moveStars = (p5) => {
    for (let i = 0; i < this.stars.length; i++) {
      this.starDirection = Math.sqrt(this.stars[i].x**2 + this.stars[i].y**2)
      this.stars[i].x += this.stars[i].x/this.starDirection * this.stars[i].speed;
      this.stars[i].y += this.stars[i].y/this.starDirection * this.stars[i].speed;

      if (this.stars[i].x < 0 || this.stars[i].x > this.width || this.stars[i].y < 0 || this.stars[i].y > this.height) {
        // Reset the star to the center with a new random angle
        this.stars[i].x = p5.random(-this.width/2, this.width/2);
        this.stars[i].y = p5.random(-this.height/2, this.height/2);
        this.stars[i].angle = p5.random(p5.TWO_PI);
      }
    }
  };

  drawStars = (p5) => {
    p5.fill(255)
    p5.noStroke();
    for (let i = 0; i < this.stars.length; i++) {
      p5.ellipse(this.stars[i].x, this.stars[i].y, 1, 1);
    }
  };

  setup = (p5) => {
    if (!this.canvasCreated) {
        p5.createCanvas(window.innerWidth, window.innerHeight)
        this.initializeStars(p5);
         // Set a flag to indicate that the canvas has been created
        this.rocket = p5.loadImage(rocketImg)
        this.earth = p5.loadImage(earthImg)
        this.moon = p5.loadImage(moonImg)
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
        "diameter": 7 * 10 ** 7,
        "image": p5.loadImage(earthImg)
      },
      {
        "name": "M2",
        // "mass": 7.35 * 10 ** 22, // In kg
        "mass": 11.35 * 10 ** 22, // In kg
        "position": [4.055 * 10**8, 0],
        "velocity": [0, 970],
        "acceleration": [0, 0],
        "diameter": 1.7 * 10 ** 7,
        "image": p5.loadImage(moonImg)
      },
      {
        "name": "rocket",
        "mass": 1, // In kg
        "position": [0, -8.429 * 10**7],
        // "velocity": [-2040, 0],
        "velocity": [2540, 0],
        "acceleration": [0, 0],
        "diameter": 5 * 10 ** 6,
        "image": p5.loadImage(rocketImg)
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


    this.s_per_frame = 10 ** (3);
    // this.s_per_frame = 10 ** (2);

    this.m_per_pixel = 10 ** 6;

    // Rocket Section!
    document.body.onkeyup = (e) => {
      if (e.key == " " ||
        e.code == "Space"
      ) {

        this.setState({propulsion: !this.state.propulsion})
        console.log(this.state.propulsion)
      }
    }
    this.rocket_u = 10;
    this.rocket_mu = 10;



    p5.background(25, 25, 25);


    // Draw stars in the background
    this.drawStars(p5);
  };


  draw = p5 => {
    this.moveStars(p5);
    if (Math.random() > 0.9) {
      p5.stroke(255);
      p5.point(Math.random(this.width), Math.random(this.height));
    }
    this.drawStars(p5);
    // draw stars
    if (Math.random() > 0.95 && this.step >= 2.5) {
      this.fromX = Math.random(this.width);
      this.fromY = Math.random(this.height / 2);
      this.toX = Math.random(this.fromX + 10, this.width);
      this.toY = Math.random(this.fromY + 10, this.height / 2);
      this.step = 0;
    }
    p5.noStroke();
    if (!this.state.simulationStarted) {
      p5.translate(this.width / 2, this.height / 2);
      p5.fill(25, 25, 25, 35)
      p5.rect(-this.width / 2, -this.height / 2, this.width, this.height)

      for (let i = 0; i < this.objects.length; i++) {

        this.temp1 = this.objects[i]["position"][0]
        this.temp2 = this.objects[i]["position"][1]

        if (i == 0) {
          p5.fill(0, 200, 200)
        } else if (i == 1) {
          p5.fill(200, 0, 200)
        } else {
          p5.fill(255, 0, 0)
        }
        this.comX = (this.objects[0]["position"][0] * this.objects[0]["mass"] + this.objects[1]["position"][0] * this.objects[1]["mass"]) / (this.objects[0]["mass"] + this.objects[1]["mass"])
        this.comY = (this.objects[0]["position"][1] * this.objects[0]["mass"] + this.objects[1]["position"][1] * this.objects[1]["mass"]) / (this.objects[0]["mass"] + this.objects[1]["mass"])

        p5.circle((this.objects[i]["position"][0] - this.comX) / this.m_per_pixel, (this.objects[i]["position"][1] - this.comY) / this.m_per_pixel, this.objects[i]["diameter"] / this.m_per_pixel)
      }

      p5.fill(255, 255, 255)
      return;
    }
    this.kinetic = 0
    this.potential = 0
    this.t += 1;
    p5.translate(this.width / 2, this.height / 2);

    p5.noStroke();
    p5.frameRate(this.fr);

    p5.background(25, 25, 250, 0.99);
    p5.fill(25, 25, 25, 35)
    p5.rect(-this.width / 2, -this.height / 2, this.width, this.height)

    // console.log(this.objects.length)

    // Set Acceleration according to gravity
    for (let i = 0; i < this.objects.length; i++) {
      this.objects[i]["acceleration"][0] = 0
      this.objects[i]["acceleration"][1] = 0
      for (let j = 0; j < this.objects.length; j++) {
        if (j !== i) {
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
      // ROCKET PROPULSION CALCULATION
      if (this.objects[i]["name"] === "rocket") {
        // console.log(this.state.propulsion)
        if (this.state.propulsion) {
          console.log("PROPULSE!")
          this.tot_v = Math.sqrt(this.objects[i]["velocity"][0] ** 2 + this.objects[i]["velocity"][1] ** 2)
          this.d_vx = this.objects[i]["velocity"][0] / this.tot_v
          this.d_vy = this.objects[i]["velocity"][1] / this.tot_v
          console.log(this.rocket_mu)
          this.objects[i]["mass"] -= this.rocket_mu / this.s_per_frame
          console.log(this.objects[i]["mass"])
          this.rocketAcceleration = this.rocket_u * this.rocket_mu / this.objects[i]["mass"];

          this.objects[i]["velocity"][0] += this.rocketAcceleration * this.d_vx
          this.objects[i]["velocity"][1] += this.rocketAcceleration * this.d_vy

        }
      }
      // Change velocity according to acceleration
      this.objects[i]["velocity"][0] += this.objects[i]["acceleration"][0] * this.s_per_frame
      this.objects[i]["velocity"][1] += this.objects[i]["acceleration"][1] * this.s_per_frame

      //use next velocity to calculate position
      this.objects[i]["position"][0] += this.objects[i]["velocity"][0] * this.s_per_frame
      this.objects[i]["position"][1] += this.objects[i]["velocity"][1] * this.s_per_frame


      this.prevax = this.objects[i]["acceleration"][0]
      this.prevay = this.objects[i]["acceleration"][1]
      // this.objects[i]["position"][0] += this.objects[i]["velocity"][0] * this.s_per_frame + this.objects[i]["acceleration"][0] * this.s_per_frame **2/2
      // this.objects[i]["position"][1] += this.objects[i]["velocity"][1] * this.s_per_frame + this.objects[i]["acceleration"][0] * this.s_per_frame ** 2/2


      if (i === 0) {
        p5.fill(0, 200, 200)
      } else if (i == 1) {
        p5.fill(200, 0, 200)
      } else {
        // p5.fill(255, 0, 0)
        p5.fill(255, 255, 0)
      }
      this.comX = (this.objects[0]["position"][0] * this.objects[0]["mass"] + this.objects[1]["position"][0] * this.objects[1]["mass"]) / (this.objects[0]["mass"] + this.objects[1]["mass"])
      this.comY = (this.objects[0]["position"][1] * this.objects[0]["mass"] + this.objects[1]["position"][1] * this.objects[1]["mass"]) / (this.objects[0]["mass"] + this.objects[1]["mass"])

      p5.circle((this.objects[i]["position"][0] - this.comX) / this.m_per_pixel, (this.objects[i]["position"][1] - this.comY) / this.m_per_pixel, this.objects[i]["diameter"] / this.m_per_pixel)


      // Rocket image
      // let velocity = this.objects[i]["velocity"];
      // let angle = Math.atan2(velocity[1], velocity[0]);
      // p5.push();
      // p5.translate((this.objects[i]["position"][0]- this.comX)/this.m_per_pixel, (this.objects[i]["position"][1]- this.comY)/this.m_per_pixel);
      // p5.rotate(angle-12.5);
      // p5.imageMode(p5.CENTER);
      // p5.image(this.objects[i]["image"], -this.objects[i]["image"].width/2, -this.objects[i]["image"].height/2);
      // p5.pop();

      //p5.image(this.objects[i]["image"], this.objects[i]["position"][0]/ this.m_per_pixel -this.earth.width/2, this.objects[i]["position"][1]/ this.m_per_pixel-this.earth.height/2);


      //p5.image(this.rocket, this.objects[i]["position"][0]/ this.m_per_pixel -this.rocket.width/2, this.objects[i]["position"][1]/ this.m_per_pixel-this.rocket.height/2); // draw the image
      // Monitor total energy : Energy = Kinetic energy + Potential energy
      //   if(i==0){
      //     this.energy = 1/2 * this.objects[0]['mass'] * Math.sqrt(this.objects[0]['velocity'][0]**2+this.objects[0]['velocity'][1]**2)  + this.objects[0]['mass'] * this.total_a * this.r
      //     console.log(
      //       "energy", this.energy,
      //       this.objects[0]['mass'],
      //       this.objects[0]['velocity'],
      //       this.objects[0]['mass'],
      //       this.r)

      this.kinetic += this.objects[i]["mass"] * (this.objects[i]["velocity"][0] ** 2 + this.objects[i]["velocity"][1] ** 2) / 2
      // console.log(this.kinetic)
    }

    this.potential = -this.objects[0]["mass"] * this.objects[1]["mass"] * 6.6743 * Math.pow(10, -11) / Math.sqrt((this.objects[0]["position"][0] - this.objects[1]["position"][0]) ** 2 + (this.objects[0]["position"][1] - this.objects[1]["position"][1]) ** 2)
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

  handleM2VelocityChange = (value) => {
    const newValue = parseFloat(value.x);

    this.setState({ sliderValue3 : newValue });
    this.setState({ velocityM2Multiplier: newValue });

    if (newValue === 1) {
      console.log(this.objects[1])
      this.objects[1].velocity[1] = 970;
      console.log(this.objects[1])
    } else if (newValue > 0) {
      this.objects[1].velocity[1] = (970) * newValue;
    } else if (newValue < 0) {
      this.objects[1].velocity[1] = (970) / (newValue);
    }
  };

    handleDistanceChange = (value) => {
        const newValue = parseFloat(value.x);

        this.setState({ sliderValue4 : newValue });
        this.setState({ distanceMultiplier: newValue });

        if (newValue === 1) {
            this.objects[1].position[0] = 4.055 * 10**8;
        } else if (newValue > 0) {
            this.objects[1].position[0] = (4.055 * 10**8) * newValue;
        } else if (newValue < 0) {
            this.objects[1].position[0] = (4.055 * 10**8) / (newValue);
        }
    }

  resetSimulation = () => {
    window.location.reload();
  }

  startSimulation = () => {
    this.setState({ simulationStarted: true });
  }

  pauseSimulation = () => {
    this.setState({ simulationStarted: false });
  }

  render() {
    return (
      <div className="contain">
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
          <p>Multiplier for velocity M2 : {(Math.round(this.state.velocityM2Multiplier* 100) / 100).toFixed(2)}x the velocity&nbsp;
          </p>
          <InputSlider
              axis="x"
              x={this.state.sliderValue3}
              xmin={0}
              xmax={10}
              xstep={0.1}
              onChange={this.handleM2VelocityChange}
              id={this.state.velocityM2Multiplier}
          />
          <p>Initial distance between M1 & M2 : {(Math.round(this.state.distanceMultiplier * 100) / 100).toFixed(2)}x the distance&nbsp;
          </p>
          <InputSlider
              axis="x"
              x={this.state.sliderValue4}
              xmin={0}
              xmax={10}
              xstep={0.1}
              onChange={this.handleDistanceChange}
              id={this.state.distanceMultiplier}
          />
        <p>Rocket Propulsion: {this.state.propulsion ? "On" : "Off"}</p>
        </div>

        <Sketch setup={this.setup} draw={this.draw} />
        <br></br>
      </div>
    );
  }
}