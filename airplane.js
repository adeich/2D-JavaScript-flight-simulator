log = 'log:';


Airplane = {
 initialize: function(pong) {
      this.pong = pong;

      // aircraft's physical properties

      this.length = 40;   // meters. initially drawing plane as gray rectangle
      this.height = 15;   // meters
      this.GRAVITY = 0* 100 * 10 *  9.8;  // m/s^2

  // ------- create state vector ---------

      this.SV = {
        x: [undefined, undefined],        
        v: [undefined, undefined],
        theta: 0,     // radians
        omega: 0,     // radians / sec
        mass: 1000, // kg
        I: 100000,
      }

  // ------- initialize state vector ----------

      this.SV.x[0] = this.pong.width / 2;  // x[0]; "x" normally
      this.SV.x[1] = this.pong.height/2;   // x[1]; "y" normally
      this.SV.v[0] = 100;                   // v[0]; "dx" normally
      this.SV.v[1] = 40;                    // v[1]; "dy" normally

   // ------- create plane's parts -----

      this.planeParts = {

        elevator: {
          bodySpaceLoc: [-30, 0],
          surface_area: 1,
          angle: 0,                 // relative to plane body
          angle_xy: 0,
          angle_of_attack: 0,
          forceContribution: [0, 0],  // in the x-y frame.
          torqueContribution: 0,
          wind_angle_xy: 0, 
          wind_vector_xy: [],
          planform_area: 0,
          updateElevatorAngle: function(clockwiseBool, dt) {},
          update: function(aircraftSV) {
            this.angle_xy = this.angle + aircraftSV.theta;
            this.wind_angle_xy = Math.atan(aircraftSV.v[1] / aircraftSV.v[0]);
   //         alert("wind_angle: " + wind_angle_in_xy);
            this.angle_of_attack = this.angle_xy + this.wind_angle_xy;
   //         alert("this.angle: " + this.angle + " angle_of_attack: " + angle_of_attack);
            var wind_speed = linearAlgebra.vectorMag(aircraftSV.v);
            this.wind_vector_xy = [aircraftSV.v[0], aircraftSV.v[1]];
            this.planform_area = this.surface_area * Math.sin(this.angle_of_attack);
            this.forceContribution = physics.computeAeroForce(this.surface_area,
                                        this.angle_of_attack, wind_speed, this.wind_vector_xy); 
   //         alert("force: " + this.forceContribution);
            this.torqueContribution = physics.computeTorque(this.forceContribution, 
                                                            this.bodySpaceLoc);
   //         alert("torque: " + this.torqueContribution);
          }  
        },

        wing: {
          surface_area: 7,   // this should really be set in some airplane-specs object.
          bodySpaceLoc: [-10, 0],  
          forceContribution: [0, 0],
          torqueContribution: 0,
          wind_angle_xy: 0,
          angle_of_attack: 0,
          wind_vector_xy: [0,0],
          planform_area: 0,
          update: function(aircraftSV) {
            this.wind_angle_xy = Math.atan(aircraftSV.v[1] / aircraftSV.v[0]);
   //         alert("wind_angle: " + wind_angle_in_xy);
            this.angle_of_attack = aircraftSV.theta + this.wind_angle_xy;
   //         alert("this.angle: " + this.angle + " angle_of_attack: " + angle_of_attack);
            var wind_speed = linearAlgebra.vectorMag(aircraftSV.v);
            this.wind_vector_xy = [aircraftSV.v[0], aircraftSV.v[1]];
            this.planform_area = this.surface_area * Math.sin(this.angle_of_attack);
            this.forceContribution = physics.computeAeroForce(this.surface_area,
                                        this.angle_of_attack, wind_speed, this.wind_vector_xy); 
   //         alert("force: " + this.forceContribution);
            this.torqueContribution = physics.computeTorque(this.forceContribution, 
                                                            this.bodySpaceLoc);
   //         alert("torque: " + this.torqueContribution);

          }
        } 
      }
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
      
      
      var netForce = [0, this.GRAVITY]; 
      var netTorque = 0;
     
      
      for (part in this.planeParts) {
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
      ctx.rotate(-1 * this.SV.theta * Math.PI);  // rotate to plane's current att
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
      ctx.fillStyle = "blue";
      ctx.fillRect(100, 160, this.planeParts.wing.forceContribution[0] / 20,this.planeParts.wing.forceContribution[1] /20);
      ctx.fillStyle = "red";
      ctx.fillRect(200, 160, this.planeParts.elevator.forceContribution[0] / 4 , this.planeParts.elevator.forceContribution[1] / 4);
    } // draw 
} // Airplane 
