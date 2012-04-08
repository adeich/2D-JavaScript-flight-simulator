
Airplane = {
 initialize: function(pong) {
      this.pong = pong;

      // aircraft's physical properties

      this.length = 40;   // meters. initially drawing plane as gray rectangle
      this.height = 15;   // meters
      this.GRAVITY =   510 * 10 *  9.8;  // m/s^2

  // ------- create state vector ---------

      this.SV = {
        x: [undefined, undefined],        
        v: [undefined, undefined],
        theta: 0,     // radians
        omega: 0,     // radians / sec
        mass: 1000, // kg
        I: 10000,
      }

  // ------- initialize state vector ----------

      this.SV.x[0] = this.pong.width / 2;  // x[0]; "x" normally
      this.SV.x[1] = this.pong.height/2;   // x[1]; "y" normally
      this.SV.v[0] = 10;                   // v[0]; "dx" normally
      this.SV.v[1] = 0;                    // v[1]; "dy" normally

   // ------- create plane's parts -----

      this.planeParts = {

        elevator: {
          bodySpaceLoc: [-30, 0],
          surface_area: 10,
          angle: 0,                 // relative to plane body
          angle_xy: 0,
          angle_of_attack: 0,
          forceContribution: [0, 0],  // in the x-y frame.
          torqueContribution: 0,
          wind_vector_xy: [],
          wind_angle_xy: 0, 
          planform_area: 0,
          spin_velocity: [],
          wind_speed: 0,
          updateElevatorAngle: function(clockwiseBool, dt) {},
          update: function(aircraftSV) {
            this.angle_xy = this.angle + aircraftSV.theta;
            this.spin_velocity = function(bodySpaceLoc) {
              var displacement_from_cg_xy = linearAlgebra.rotate2d(bodySpaceLoc,
                                               (-1) * aircraftSV.theta);
              var perpendicular = linearAlgebra.rotate2d(displacement_from_cg_xy,(Math.PI/2));
              return (linearAlgebra.scalarMult(perpendicular, (-1) *aircraftSV.omega));
            }(this.bodySpaceLoc);
            this.wind_vector_xy = linearAlgebra.vectorAdd(aircraftSV.v, this.spin_velocity);
            if (linearAlgebra.vectorMag(this.wind_vector_xy) == 0) {
              this.wind_angle_xy = 0;
            } else {
              this.wind_angle_xy = Math.atan(this.wind_vector_xy[1] / this.wind_vector_xy[0]);
            }
            this.angle_of_attack = (this.angle_xy + this.wind_angle_xy) % Math.PI;
            this.wind_speed = linearAlgebra.vectorMag(this.wind_vector_xy);
            this.planform_area = this.surface_area * Math.sin(this.angle_of_attack);
            this.forceContribution = physics.computeAeroForce(this.surface_area,
                                     this.angle_of_attack, this.wind_speed, this.wind_vector_xy); 
            this.torqueContribution = physics.computeTorque(this.forceContribution, 
                                     linearAlgebra.rotate2d(this.bodySpaceLoc, (-1) * aircraftSV.theta));
          //  alert(JSON.stringify(this));
          } // end of update.  
        }, // end of elevator.

        
        wing: {
          bodySpaceLoc: [-1, 0],
          surface_area: 30,
          angle: 0,                 // relative to plane body
          angle_xy: 0,
          angle_of_attack: 0,
          forceContribution: [0, 0],  // in the x-y frame.
          torqueContribution: 0,
          wind_vector_xy: [],
          wind_angle_xy: 0, 
          planform_area: 0,
          spin_velocity: [],
          wind_speed: 0,
          updateElevatorAngle: function(clockwiseBool, dt) {},
          update: function(aircraftSV) {
            this.angle_xy = this.angle + aircraftSV.theta;
            this.spin_velocity = function(bodySpaceLoc) {
              var displacement_from_cg_xy = linearAlgebra.rotate2d(bodySpaceLoc,
                                               (-1) * aircraftSV.theta);
              var perpendicular = linearAlgebra.rotate2d(displacement_from_cg_xy,(Math.PI/2));
              return (linearAlgebra.scalarMult(perpendicular, (-1) *aircraftSV.omega));
            }(this.bodySpaceLoc);
            this.wind_vector_xy = linearAlgebra.vectorAdd(aircraftSV.v, this.spin_velocity);
            if (linearAlgebra.vectorMag(this.wind_vector_xy) == 0) {
              this.wind_angle_xy = 0;
            } else {
              this.wind_angle_xy = Math.atan(this.wind_vector_xy[1] / this.wind_vector_xy[0]);
            }
            this.angle_of_attack = (this.angle_xy + this.wind_angle_xy) % Math.PI;
            this.wind_speed = linearAlgebra.vectorMag(this.wind_vector_xy);
            this.planform_area = this.surface_area * Math.sin(this.angle_of_attack);
            this.forceContribution = physics.computeAeroForce(this.surface_area,
                                     this.angle_of_attack, this.wind_speed, this.wind_vector_xy); 
            this.torqueContribution = physics.computeTorque(this.forceContribution, 
                                     linearAlgebra.rotate2d(this.bodySpaceLoc, (-1) * aircraftSV.theta));
 
          }
        },

        front_wheel: {
          bodySpaceLoc: [10, -5],
          spring_constant: 1,
          EXTENDED_LENGTH: 1,
          spring_contracted_length: 0,
          forceContribution: [0, 0],
          torqueContribution: 0,
          update: function(aircraftSV) {
            // if the wheel isn't touching the ground, do nothing.
            if (aircraftSV.x[1] + this.extended_length < 1) {
              this.forceContribution = [0,0];
              this.torqueContribution = 0;
              return;
            }
            this.spring_contracted_length = aircraftSV.x[1] - this.EXTENDED_LENGTH;

          }
        }, 
      } // planeParts
  }, // initialize



    // ---- keys mapped to functions ---- 
    keyMaps: {
      // updater booleans -- only called by this.Update
      keyActionBools: { 
        upPressedBool: false,
        downPressedBool: false,
        rightPressedBool: false,
        leftPressedBool: false,
    
        rotateCwiseBool: false,
        rotateCCwiseBool: false, 
        upElevatorBool: false,
        downElevatorBool: false
      },
      upPressed: function()     { this.keyActionBools.upPressedBool = true;       },  
      downPressed: function()   { this.keyActionBools.downPressedBool = true;     },  
      upUnPressed: function()   { this.keyActionBools.upPressedBool = false;      },  
      downUnPressed: function() { this.keyActionBools.downPressedBool = false;    },
      rightPressed: function()  { this.keyActionBools.rightPressedBool = true;    },
      leftPressed: function()   { this.keyActionBools.leftPressedBool = true;     },
      rightUnPressed: function(){ this.keyActionBools.rightUnPressedBool = false; },
      leftUnPressed: function() { this.keyActionBools.leftUnPressedBool = false;  },
      rotateCwisePressed: function()
                              { this.keyActionBools.rotateCwiseBool = true; },
      rotateCwiseUnPressed: function()
                              { this.keyActionBools.rotateCwiseBool = false; },
      rotateCCwisePressed: function()
                              { this.keyActionBools.rotateCCwiseBool = true; },
      rotateCCwiseUnPressed: function()
                              { this.keyActionBools.rotateCCwiseBool = false;},
      upElevatorPressed: function() {this.keyActionBools.upElevatorBool = true; },
      downElevatorPressed: function() {this.keyActionBools.downElevatorBool = true; },
      upElevatorUnPressed: function() {this.keyActionBools.upElevatorBool = false; },
      downElevatorUnPressed: function() {this.keyActionBools.downElevatorBool = false;},
    },
      

    // ----- accessor method(s) ---  used by world


    getScreenCorner: function() { // upper-left corner
      screenCorner = [this.SV.x[0] - this.pong.width/2,
                        this.SV.x[1] - this.pong.height/2];
      return screenCorner;
    },



    // ---- update -------

    update: function(dt) {
      var a = this.keyMaps.keyActionBools;
      // accel right
      if (a.rightPressedBool) {this.SV.v[0] += 0;
                                  a.rightPressedBool = false;}
      // accel left
      if (a.leftPressedBool)  {this.SV.v[0] -= 0;
                                  a.leftPressedBool = false;}
      // accel up
      if (a.upPressedBool)    {this.SV.v[1] -= 2;
                                  a.upPressedBool = false;}
      // accel down
      if (a.downPressedBool)  {this.SV.v[1] += 2;
                                  a.downPressedBool = false;}
      // rot. accel clockwise
      if (a.rotateCwiseBool)  {this.SV.omega -= 0.1;
                                }
      // rot. accel counter-clockwise
      if (a.rotateCCwiseBool) {this.SV.omega += 0.1;
                               }
      // move elevator up
      if (a.upElevatorBool) {this.planeParts.elevator.angle += .03;
                                upElevatorBool = false;}
      // move elevator down
      if (a.downElevatorBool) {this.planeParts.elevator.angle -= .03;
                                downElevatorBool = false; }

  //    this.SV.x[0] += this.SV.v[0] * dt; // x += dx * dt
  //    this.SV.x[1] += this.SV.v[1] * dt; // y += dy * dt
  //    this.SV.theta += this.SV.omega * dt;       // theta += omega * dt
      
      
      var netForce = [0,  this.GRAVITY]; 
      var netTorque = 0;
     
      for (var part in this.planeParts) {
        //  if (part.update(this.SV)) {part.update(this.SV)};
        this.planeParts[part].update(this.SV); 
        netForce = linearAlgebra.vectorAdd(netForce, this.planeParts[part].forceContribution);
        netTorque += this.planeParts[part].torqueContribution;
      }   
     
/*
        this.planeParts.elevator.update(this.SV); 
        netForce = linearAlgebra.vectorAdd(netForce, this.planeParts.elevator.forceContribution);
        netTorque += this.planeParts.elevator.torqueContribution;
*/
      // reset the state vector to be the next one
      this.SV =  physics.computeNextSV(this.SV, netForce, netTorque, dt);
      
      
    },

    // ---- draw --------  

    draw: function(ctx) {
      ctx.fillStyle = "white";
      ctx.font = "10pt sans-serif";
   //   ctx.fillText("rotateCwiseBool : " + this.keyActionBools.rotateCwiseBool +
   //                " rotateCCwiseBool : " + this.KeyActionBools.rotateCCwiseBool,
   //                  200, 200);
      ctx.fillStyle = "white";
      ctx.save();
      ctx.translate(this.pong.width/2, this.pong.height/2);
                                         // move to cm position
      // BODY
      ctx.translate(0, -this.height/2);
      ctx.rotate(-1 * this.SV.theta);  // rotate to plane's current att
      ctx.fillStyle = "gray";
      drawAirplaneBody(ctx);

      // WING
    
      ctx.translate(this.length*.7, this.height*1.5); // just winging these numbers
      drawWing(ctx); 

      // ELEVATOR    

      ctx.translate(-this.length*2.7 , -this.height*1); //move to elevator center
      ctx.rotate(-1 * this.planeParts.elevator.angle); // elevator angle
      drawElevator(ctx);

      // FOR TESTING PURPOSES
      ctx.restore();
      if (this.leftPressedBool) {ctx.fillText("left Pressed", 170, 170); }
      ctx.fillText("x = " + Math.round(this.SV.x[0]), 10, 10);
      ctx.fillText("y = " + Math.round(this.SV.x[1]), 10, 20);
      ctx.fillText("dx = " + Math.round(this.SV.v[0]), 10, 30);
      ctx.fillText("dy = " + Math.round(this.SV.v[1]), 10, 40);
      ctx.fillText("elevator angle xy = " + this.planeParts.elevator.angle_xy, 10, 50);
      ctx.fillText("SV.theta = " + this.SV.theta, 10, 60);
      ctx.fillText("elevator force = " + this.planeParts.elevator.forceContribution, 10, 70);
      ctx.fillText("elevator AOA = " + this.planeParts.elevator.angle_of_attack, 10, 80);
      ctx.fillText("elevator wind_vector_xy= " + this.planeParts.elevator.wind_vector_xy, 10, 90);
      ctx.fillText("elevator planform area = " + this.planeParts.elevator.planform_area , 10, 110);
      ctx.fillText("elevator wind_angle_xy = " + this.planeParts.elevator.wind_angle_xy , 10, 120);
      ctx.fillText("wing force[0]  = " + this.planeParts.wing.forceContribution[0] , 10, 130);
      ctx.fillText("wing force[1]  = " + this.planeParts.wing.forceContribution[1] , 10, 140);
      ctx.fillText("spinvel[0]  = " + this.planeParts.elevator.spin_velocity[0] , 10, 150);
      ctx.fillText("spinvel[1]  = " + this.planeParts.elevator.spin_velocity[1] , 10, 160);
      ctx.fillText("elevator torque = " + this.planeParts.elevator.torqueContribution , 10, 170);
      ctx.fillText("elevator windspeed= " + this.planeParts.elevator.wind_speed, 10, 180);
      ctx.fillText("omega = " + this.SV.omega, 10, 190);
      ctx.fillText("force magnitude = " + linearAlgebra.vectorMag(this.planeParts.elevator.forceContribution), 10, 200);
//      ctx.fillStyle = "blue";
//      ctx.fillRect(100, 160, this.planeParts.wing.forceContribution[0] / 20,this.planeParts.wing.forceContribution[1] /20);
 //     ctx.fillStyle = "red";
 //     ctx.fillRect(200, 160, this.planeParts.elevator.forceContribution[0] / 4 , this.planeParts.elevator.forceContribution[1] / 4);
    } // draw 
} // Airplane 
