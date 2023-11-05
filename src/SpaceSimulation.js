import React, { Component } from "react";
import Sketch from "react-p5";
import rocketImg from './rocket.png';
import earthImg from './earth-transparent-png-9.png';
import moonImg from './full-moon-transparent-background-7.png'
import InputSlider from "react-input-slider";
import './SpaceSimulation.css'

export default class SpaceSimulation extends Component {
  constructor(props) {
    super(props);
    this.state = { // Initial mass of M1 in kg
      selectedSetup: 1,
      zoomFactor: 1,
      massM1Multiplier: 1, // Multiplier to change mass of M1
      massM2Multiplier: 1, // Multiplier to change mass of M2
      velocityM2Multiplier: 1, // Multiplier to change velocity of M2
      distanceMultiplier: 1, // Multiplier to change distance between M1 and M2
      simulationStarted: false,
      propulsion: false,
      centerFrame: false,
      infiniSpace: false,
      moreRockets: false,
      images: []
    };
  }
  stars = [];


  initializeStars = (p5) => {
    for (let i = 0; i < 40; i++) {
      let x, y;
      // x = p5.random(-this.width/2, this.width/2);
      // y = p5.random(-this.height/2, this.height/2);
      x = p5.random(0, this.width);
      y = p5.random(0, this.height);

      const speed = p5.random(0.5, 1.5); // Adjust the speed
      this.stars.push({ x, y, speed });
    }
  };

  starDirection;


  moveStars = (p5) => {
    for (let i = 0; i < this.stars.length; i++) {
      this.starDirection = Math.sqrt(this.stars[i].x ** 2 + this.stars[i].y ** 2)
      this.stars[i].x += this.stars[i].x / this.starDirection * this.stars[i].speed;
      this.stars[i].y += this.stars[i].y / this.starDirection * this.stars[i].speed;

      if (this.stars[i].x < 0 || this.stars[i].x > this.width || this.stars[i].y < 0 || this.stars[i].y > this.height) {
        // Reset the star to the center with a new random angle
        this.stars[i].x = p5.random(-this.width / 2, this.width / 2);
        this.stars[i].y = p5.random(-this.height / 2, this.height / 2);
        this.stars[i].angle = p5.random(p5.TWO_PI);
      }
    }
  };

  drawStars = (p5) => {
    p5.fill(210)
    p5.noStroke();
    for (let i = 0; i < this.stars.length; i++) {
      p5.ellipse(this.stars[i].x, this.stars[i].y, 1, 1);
    }
  };
  // Declare database!
  database = [
    [
      {
        "name": "M1",
        "mass": 6 * 10 ** 24, // In kg
        "position": [0, 0],

        "velocity": [0, 0],
        "acceleration": [0, 0],
        "diameter": 7 * 10 ** 7,
        "color": [0, 200, 200],

      },
      {
        "name": "M2",
        // "mass": 7.35 * 10 ** 22, // In kg
        "mass": 11.35 * 10 ** 22, // In kg
        "position": [4.055 * 10 ** 8, 0],

        "velocity": [0, 970],
        "acceleration": [0, 0],
        "diameter": 1.7 * 10 ** 7,
        "color": [200, 0, 200],

      },
      {
        "name": "rocket",
        "mass": 10 * 4, // In kg
        "position": [4.355 * 10 ** 8, 0],

        // "velocity": [-2040, 0],
        "velocity": [0, 1370],
        "acceleration": [0, 0],
        "diameter": 5 * 10 ** 7,
        "color": [255, 255, 0],

      }
    ],

    [
      {
        "name": "M1",
        "mass": 6 * 10 ** 24, // In kg
        "position": [0, 0],

        "velocity": [0, 0],
        "acceleration": [0, 0],
        "diameter": 7 * 10 ** 7,
        "color": [0, 200, 200],

      },
      {
        "name": "M2",
        "mass": 7.35 * 10 ** 22, // In kg
        // "mass": 11.35 * 10 ** 22, // In kg
        "position": [4.055 * 10 ** 8, 0],

        "velocity": [0, 970],
        "acceleration": [0, 0],
        "diameter": 1.7 * 10 ** 7,
        "color": [200, 0, 200]

      },
      {
        "name": "rocket",
        "mass": 10 * 4, // In kg
        "position": [0, -7 * 10 ** 7],
        "velocity": [2040, 0],
        "acceleration": [0, 0],
        "color": [255, 255, 0],
        "diameter": 2.5 * 10 ** 7
      }
    ],
    [
      {
        "name": "M1",
        "mass": 6 * 10 ** 24, // In kg
        "position": [0, 0],

        "velocity": [0, 0],
        "acceleration": [0, 0],
        "diameter": 7 * 10 ** 7,
        "color": [0, 200, 200],

      },
      {
        "name": "M2",
        "mass": 6 * 10 ** 24, // In kg
        // "mass": 11.35 * 10 ** 22, // In kg
        "position": [4.055 * 10 ** 8, 0],

        "velocity": [0, 970],
        "acceleration": [0, 0],
        "diameter": 7 * 10 ** 7,
        "color": [200, 0, 200]

      },
      {
        "name": "rocket",
        "mass": 7.35 * 10 ** 22, // In kg
        "position": [0, -7 * 10 ** 7],
        "velocity": [2040, 0],
        "acceleration": [0, 0],
        "color": [255, 255, 0],
        "diameter": 3.5 * 10 ** 6,
      }
    ]
  ]

  setup = (p5) => {
    if (!this.canvasCreated) {
      p5.createCanvas(window.innerWidth, window.innerHeight)
      this.initializeStars(p5);
      // Set a flag to indicate that the canvas has been created
      // this.rocketImage = p5.loadImage(rocketImg)
      // this.earthImage = p5.loadImage(earthImg)
      // this.moonImage = p5.loadImage(moonImg)
      this.setState({images: [p5.loadImage(rocketImg),
        p5.loadImage(earthImg), p5.loadImage(moonImg) 
        ]}) 
    }
    this.height = window.innerHeight;
    this.width = window.innerWidth;
    // All the objects will be stored here!:w
    this.objects = this.database[this.state.selectedSetup];
    // Angle and rate at which the angle of the second planet increases


    this.s_per_frame = 10 ** (3);
    // this.s_per_frame = 10 ** (2);

    this.m_per_pixel = 1.3 * 10 ** 6;

    // Rocket Section!
    document.body.onkeyup = (e) => {
      if (e.key == " " ||
        e.code == "Space"
      ) {

        this.setState({ propulsion: !this.state.propulsion })
        console.log(this.state.propulsion)
      }
    }
    this.rocket_u = 10;
    this.rocket_mu = 10;
    p5.background(25, 25, 25);
    // Draw stars in the background
    this.drawStars(p5);
    // this.comX = 0;
    // this.comY = 0;
  };


  draw = p5 => {
    this.moveStars(p5);
    this.drawStars(p5);

    p5.noStroke();
    if (!this.state.simulationStarted) {
      if (this.lastSetup != this.state.selectedSetup) {
        this.objects = this.database[this.state.selectedSetup]
      }
      p5.translate(this.width / 2, this.height / 2);
      p5.fill(25, 25, 25, 35)
      p5.rect(-this.width / 2, -this.height / 2, this.width, this.height)

      for (let i = 0; i < this.objects.length; i++) {
        try {
          p5.fill(this.objects[i]["color"][0], this.objects[i]["color"][1], this.objects[i]["color"][2])
        } catch (error) {
          p5.fill(255, 255, 255)
        }


        this.comX = (this.objects[0]["position"][0] * this.objects[0]["mass"] + this.objects[1]["position"][0] * this.objects[1]["mass"]) / (this.objects[0]["mass"] + this.objects[1]["mass"])
        this.comY = (this.objects[0]["position"][1] * this.objects[0]["mass"] + this.objects[1]["position"][1] * this.objects[1]["mass"]) / (this.objects[0]["mass"] + this.objects[1]["mass"])

        this.velocity = this.objects[i]["velocity"];
        this.angle = Math.atan2(this.velocity[1], this.velocity[0]);
        p5.push();
        p5.translate((this.objects[i]["position"][0]/this.m_per_pixel), (this.objects[i]["position"][1] /this.m_per_pixel))
        p5.rotate(this.angle+p5.PI/4);
        this.makeImage = true
        if(this.objects[i]["name"] === "rocket"){
          this.selectedImage = this.state.images[0];
        }
        else if(this.objects[i]["name"] === "M1"){
          this.selectedImage = this.state.images[1];
        }
        else if(this.objects[i]["name"] === "M2"){
          this.selectedImage = this.state.images[2];         
        } else{
          this.makeImage = false
          // if (this.state.centerFrame) {
          //   p5.circle(((this.objects[i]["position"][0] - this.comX) / this.m_per_pixel), ((this.objects[i]["position"][1] - this.comY) / this.m_per_pixel), this.objects[i]["diameter"] / this.m_per_pixel)
          // } else {
          //   p5.circle(((this.objects[i]["position"][0]) / this.m_per_pixel), ((this.objects[i]["position"][1]) / this.m_per_pixel), this.objects[i]["diameter"] / this.m_per_pixel)
          // }
        }
        // console.log(this.state.imges)
        // this.selectedImage = this.state.images[2]
        if(this.makeImage){ 
          this.scaleFactor = this.objects[i]["diameter"] / this.m_per_pixel / this.selectedImage.width
          p5.scale(this.scaleFactor)
          p5.imageMode(p5.CENTER);
          this.rotatedcomX = (this.comX) / this.m_per_pixel * Math.cos(this.angle + p5.PI / 4) + (this.comY) / this.m_per_pixel * Math.sin(this.angle + p5.PI / 4)
          this.rotatedcomY = - (this.comY) / this.m_per_pixel * Math.sin(this.angle + p5.PI / 4) + (this.comY) / this.m_per_pixel * Math.cos(this.angle + p5.PI / 4)
          p5.image(this.selectedImage, - this.rotatedcomX, - this.rotatedcomY);
          p5.pop();

        }
      }

      p5.fill(255, 255, 255)
      this.lastSetup = this.state.selectedSetup
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
        if (j !== i && this.objects[j]["name"] !== "rocket") {
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
          // console.log("PROPULSE!")
          this.tot_v = Math.sqrt(this.objects[i]["velocity"][0] ** 2 + this.objects[i]["velocity"][1] ** 2)
          this.d_vx = this.objects[i]["velocity"][0] / this.tot_v
          this.d_vy = this.objects[i]["velocity"][1] / this.tot_v
          // console.log(this.rocket_mu)
          this.objects[i]["mass"] -= this.rocket_mu / this.s_per_frame
          // console.log(this.objects[i]["mass"])
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

      if (this.state.infiniSpace) {
        this.tempWidth = this.width * this.m_per_pixel
        this.tempHeight = this.height * this.m_per_pixel

        if (this.state.centerFrame) {
          this.tempX = this.objects[i]["position"][0] - this.comX
          this.tempY = this.objects[i]["position"][1] - this.comY
          console.log(this.compX)
          if (this.tempX > this.tempWidth / 2) {
            // this.objects[i]["position"][0] = -this.tempWidth / 2 - this.comX
            this.objects[i]["position"][0] = -this.tempWidth / 2 - this.comX
          }
          else if (this.tempX < -this.tempWidth / 2) {
            this.objects[i]["position"][0] = this.tempWidth / 2 - this.comX
            // this.objects[i]["positions"][0] = this.tempWidth / 2          
          }
          if (this.tempY > this.tempHeight / 2) {
            this.objects[i]["position"][1] = -this.tempHeight / 2 - this.comY
            // this.objects[i]["position"][1] = -this.tempHeight / 2 
          }
          else if (this.tempY < -this.tempHeight / 2) {
            this.objects[i]["position"][1] = this.tempHeight / 2 - this.comY
            // this.objects[i]["position"][1] = this.tempHeight / 2           
          }
        } else {
          this.tempX = this.objects[i]["position"][0]
          this.tempY = this.objects[i]["position"][1]
          console.log(this.tempY)
          if (this.tempX > this.tempWidth / 2) {
            this.objects[i]["position"][0] = -this.tempWidth / 2
          }
          else if (this.tempX < -this.tempWidth / 2) {
            this.objects[i]["position"][0] = this.tempWidth / 2
          }
          if (this.tempY > this.tempHeight / 2) {
            this.objects[i]["position"][1] = -this.tempHeight / 2
          }
          else if (this.tempY < -this.tempHeight / 2) {
            this.objects[i]["position"][1] = this.tempHeight / 2
          }
        }
      }

      this.prevax = this.objects[i]["acceleration"][0]
      this.prevay = this.objects[i]["acceleration"][1]
      // this.objects[i]["position"][0] += this.objects[i]["velocity"][0] * this.s_per_frame + this.objects[i]["acceleration"][0] * this.s_per_frame **2/2
      // this.objects[i]["position"][1] += this.objects[i]["velocity"][1] * this.s_per_frame + this.objects[i]["acceleration"][0] * this.s_per_frame ** 2/2
      try {
        p5.fill(this.objects[i]["color"][0], this.objects[i]["color"][1], this.objects[i]["color"][2])
      } catch (error) {
        p5.fill(255, 255, 255)
      }
      this.comX = (this.objects[0]["position"][0] * this.objects[0]["mass"] + this.objects[1]["position"][0] * this.objects[1]["mass"]) / (this.objects[0]["mass"] + this.objects[1]["mass"])
      this.comY = (this.objects[0]["position"][1] * this.objects[0]["mass"] + this.objects[1]["position"][1] * this.objects[1]["mass"]) / (this.objects[0]["mass"] + this.objects[1]["mass"])


      // p5.circle((this.objects[i]["prev-position"][0] - this.comX) / this.m_per_pixel, (this.objects[i]["prev-position"][1] - this.comY)/ this.m_per_pixel, this.objects[i]["diameter"]/ this.m_per_pixel)
      // p5.fill(255, 255, 255)
      // p5.circle((this.objects[i]["position"][0]) / this.m_per_pixel, (this.objects[i]["position"][1] )/ this.m_per_pixel, this.objects[i]["diameter"]/ this.m_per_pixel)
      
      
      if (this.state.centerFrame) {
        p5.circle(((this.objects[i]["position"][0] - this.comX) / this.m_per_pixel), ((this.objects[i]["position"][1] - this.comY) / this.m_per_pixel), this.objects[i]["diameter"] / this.m_per_pixel)
      } else {
        p5.circle(((this.objects[i]["position"][0]) / this.m_per_pixel), ((this.objects[i]["position"][1]) / this.m_per_pixel), this.objects[i]["diameter"] / this.m_per_pixel)
      }
      

      // p5.circle((this.objects[i]["prev-position"][0] - this.comX) / this.m_per_pixel, (this.objects[i]["prev-position"][1] - this.comY)/ this.m_per_pixel, this.objects[i]["diameter"]/ this.m_per_pixel)


      // Rocket image
        this.velocity = this.objects[i]["velocity"];
        this.angle = Math.atan2(this.velocity[1], this.velocity[0]);
        p5.push();
        p5.translate((this.objects[i]["position"][0]/this.m_per_pixel), (this.objects[i]["position"][1] /this.m_per_pixel))
        p5.rotate(this.angle+p5.PI/4);
        this.makeImage = true
        if(this.objects[i]["name"] === "rocket"){
          this.selectedImage = this.state.images[0];
        }
        else if(this.objects[i]["name"] === "M1"){
          this.selectedImage = this.state.images[1];
        }
        else if(this.objects[i]["name"] === "M2"){
          this.selectedImage = this.state.images[2];         
        } else{
          this.makeImage = false
          if (this.state.centerFrame) {
            p5.circle(((this.objects[i]["position"][0] - this.comX) / this.m_per_pixel), ((this.objects[i]["position"][1] - this.comY) / this.m_per_pixel), this.objects[i]["diameter"] / this.m_per_pixel)
          } else {
            p5.circle(((this.objects[i]["position"][0]) / this.m_per_pixel), ((this.objects[i]["position"][1]) / this.m_per_pixel), this.objects[i]["diameter"] / this.m_per_pixel)
          }
        }
        // console.log(this.state.imges)
        // this.selectedImage = this.state.images[2]
        if(this.makeImage){ 
        this.scaleFactor = this.objects[i]["diameter"]/ this.m_per_pixel / this.selectedImage.width
        p5.scale(this.scaleFactor)
        p5.imageMode(p5.CENTER);
        this.rotatedcomX = (this.comX) / this.m_per_pixel*Math.cos(this.angle+p5.PI/4) + (this.comY) / this.m_per_pixel*Math.sin(this.angle+p5.PI/4)
        this.rotatedcomY = - (this.comY) / this.m_per_pixel*Math.sin(this.angle+p5.PI/4) + (this.comY) / this.m_per_pixel*Math.cos(this.angle+p5.PI/4)
        p5.image(this.selectedImage, - this.rotatedcomX, - this.rotatedcomY);
        p5.pop();

        } else{

        }
            
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

    // this.setState({ sliderValue4: newValue });
    this.setState({ distanceMultiplier: newValue });

    if (newValue === 1) {
      this.objects[1].position[0] = 4.055 * 10 ** 8;
    } else if (newValue > 0) {
      this.objects[1].position[0] = (4.055 * 10 ** 8) * newValue;
    } else if (newValue < 0) {
      this.objects[1].position[0] = (4.055 * 10 ** 8) / (newValue);
    }
  }

  handleZoom = (value) => {
    const newValue = parseFloat(value.x);
    this.setState({ zoomFactor: newValue })
    if (newValue === 1) {
      this.m_per_pixel = 1.3 * 10 ** 6;
    } else if (newValue > 0) {
      this.m_per_pixel = (1.3 * 10 ** 6) * newValue;
    } else if (newValue < 0) {
      this.m_per_pixel = (1.3 * 10 ** 6) / (newValue);
    }

  }
  // getRocket = () => {
  //   this.rocketPotential = 0 // Over m
  //   for (let i = 0; i < this.objects.length; i++) {
  //     if (this.objects[i]["name"] === "rocket") {
  //       this.rocket = this.objects[i]
  //     }
  //   }

  //   for (let i = 0; i < this.objects.length; i++) {
  //     if (this.objects[i]["name"] !== "rocket") {
  //       this.rocketPotential += 6.67 * 10 ** (-11) * this.objects[i]["mass"] / Math.sqrt((this.rocket["position"][0] - this.objects[i]["position"][0]) ** 2 + (this.rocket["position"][1] - this.objects[i]["position"][1]) ** 2)
  //     }
  //   }
  //   this.rocketKinetic = (this.rocket["velocity"][0] ** 2 + this.rocket["velocity"][1] ** 2) / 2
  //   this.rocketEnergy = this.rocketKinetic - this.rocketPotential
  //   this.rocketFinal = 6.67 * 10 ** (-11) * this.objects[0]["mass"] / Math.sqrt(this.objects[1]["position"][0] ** 2 + this.objects[1]["position"][1] ** 2)
  //   console.log(this.rocketEnergy)
  //   console.log(this.rocketFinal)
  //   this.setState({ moreRockets: !this.state.moreRockets })
  // }

  resetSimulation = () => {
    window.location.reload();
  }

  startSimulation = () => {
    // this.objects = this.database[this.state.selectedSetup];
    this.setState({ simulationStarted: true });
  }

  pauseSimulation = () => {
    this.setState({ simulationStarted: false });
  }

  changeFrame = () => {
    this.setState({ centerFrame: !this.state.centerFrame })
  }
  changeSpace = () => {
    this.setState({ infiniSpace: !this.state.infiniSpace })
  }


  changeSetup = (i) => {
    this.setState({ selectedSetup: i });
    // this.setup();
    console.log(i)
  }


  render() {
    return (
      <div className="contain">
        <div className="userParamsContainer">
          <div id="button-contain">
            {this.database.map((item, index) => (
              <button key={index} className="button" onClick={() => this.changeSetup(index)}>Setup #{index + 1}</button>
            ))}
          </div>
          {/* {this.database ? this.Button() : <div>wait</div>} */}

          <p>Start the simulation : <button onClick={this.startSimulation}>START</button></p>
          <p>Pause the simulation : <button onClick={this.pauseSimulation}>PAUSE</button></p>
          <p>Refresh the simulation : <button onClick={this.resetSimulation}>RESET</button></p>
          <p>Zoom the scope of the simulation: {((Math.round(this.state.zoomFactor * 100) / 100).toFixed(2))}x</p>
          <InputSlider
            axis="x"
            x={this.state.zoomFactor}
            xmin={0}
            xmax={10}
            xstep={0.1}
            onChange={this.handleZoom}
            id={this.state.zoomFactor}
          />
          <p>Multiplier for mass M1 : {(Math.round(this.state.massM1Multiplier * 100) / 100).toFixed(2)}x the mass&nbsp;
          </p>
          <InputSlider
            axis="x"
            x={this.state.massM1Multiplier}
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
            x={this.state.massM2Multiplier}
            xmin={0}
            xmax={10}
            xstep={0.1}
            onChange={this.handleMass2Change}
            id={this.state.massM2Multiplier}
          />
          {/* MAKE THIS PART DISSAPEAR IF STARTED */}
          {!this.state.simulationStarted &&
            <p>Multiplier for velocity M2 : {(Math.round(this.state.velocityM2Multiplier * 100) / 100).toFixed(2)}x the velocity&nbsp;
            </p>}
          {!this.state.simulationStarted && <InputSlider
            axis="x"
            x={this.state.velocityM2Multiplier}
            xmin={0}
            xmax={10}
            xstep={0.1}
            onChange={this.handleM2VelocityChange}
            id={this.state.velocityM2Multiplier}
          />}
          {!this.state.simulationStarted &&
            <p>Initial distance between M1 & M2 : {(Math.round(this.state.distanceMultiplier * 100) / 100).toFixed(2)}x the distance&nbsp;
            </p>}
          {!this.state.simulationStarted &&
            <InputSlider
              axis="x"
              x={this.state.distanceMultiplier}
              xmin={0}
              xmax={10}
              xstep={0.1}
              onChange={this.handleDistanceChange}
              id={this.state.distanceMultiplier}
            />}

          <p>Rocket Propulsion: {this.state.propulsion ? "On" : "Off"}</p>

          <span>Centered Frame: </span><input
            type="checkbox"
            checked={this.state.centerFrame}
            onChange={this.changeFrame}
          /><br></br><br></br>
          <span>Circular Space: </span><input
            type="checkbox"
            checked={this.state.infiniSpace}
            onChange={this.changeSpace}
          /><br></br><br></br>
{/* 
          <span>Find Best Path: </span><input
            type="checkbox"
            checked={this.state.moreRockets}
            onChange={this.getRocket}
          /> */}

        </div>

        <Sketch id="drawing" setup={this.setup} draw={this.draw} />
        <br></br>
      </div>
    );
  }
}