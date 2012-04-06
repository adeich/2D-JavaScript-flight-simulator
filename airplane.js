Airplane = {
 initialize: function(pong) {
      this.pong = pong;

      // aircraft's physical properties

      this.length = 40;   // initially drawing plane as gray rectangle
      this.height = 15;   //
      this.GRAVITY = 1;

  // ------- create state vector ---------

      this.SV = {
        x: [undefined, undefined],        
        v: [undefined, undefined],
        theta: 0,
        omega: 0,
        mass: 1,
        I: 1,
      }

  // ------- initialize state vector ----------

      this.SV.x[0] = this.pong.width / 2;  // x[0]; "x" normally
      this.SV.x[1] = this.pong.height/2;   // x[1]; "y" normally
      this.SV.v[0] = 10;                   // v[0]; "dx" normally
      this.SV.v[1] = 4;                    // v[1]; "dy" normally

   // ------- create plane's parts -----

      this.planeParts = {

        elevator: {
          bodySpaceLoc: [],
          angle: 0,                 // relative to plane body
          aero_force_contrib : [],  // in the x-y frame.
          updateElevatorAngle: function(clockwiseBool, dt) {},
          update: function(aircraftSV) { 
          }  
        },

        wing: {
          bodySpaceLoc: [],
          lift: 0,
          drag: 0,
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
      if (a.rightPressedBool) {this.SV.v[0] += 2;
                                  a.rightPressedBool = false;}
      if (a.leftPressedBool)  {this.SV.v[0] -= 2;
                                  a.leftPressedBool = false;}
      if (a.upPressedBool)    {this.SV.v[1] -= 2;
                                  a.upPressedBool = false;}
      if (a.downPressedBool)  {this.SV.v[1] += 2;
                                  a.downPressedBool = false;}
      if (a.rotateCwiseBool)  {this.SV.omega -= 0.1;
                                }
      if (a.rotateCCwiseBool) {this.SV.omega += 0.1;
                               }
      if (a.upElevatorBool) {this.planeParts.elevator.angle += .01;
                                upElevatorBool = false;}
      if (a.downElevatorBool) {this.planeParts.elevator.angle -= .01;
                                downElevatorBool = false; }

      this.SV.x[0] += this.SV.v[0] * dt; // x += dx * dt
      this.SV.x[1] += this.SV.v[1] * dt; // y += dy * dt
      this.SV.theta += this.SV.omega * dt;       // theta += omega * dt
      
      /*
      var netForce = [0, this.GRAVITY]; 
      var netTorque = 0;

      var part;
      for (part in this.planeParts) {
        if (part.update()) {part.update(this.SV)};
        netForce = vectorAdd(netForce, part.forceContribution);
        netTorque += part.TorqueContribution;
      }   

      var nextSV = physics.computeNextSV(this.SV, dt);
      this.SV = nextSV;

      */
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
      ctx.rotate(this.SV.theta * Math.PI);  // rotate to plane's current att
      ctx.fillStyle = "gray";
      drawAirplaneBody(ctx);

      // WING
    
      ctx.translate(this.length*.7, this.height*1.5); // just winging these numbers
      drawWing(ctx); 

      // ELEVATOR    

      ctx.translate(-this.length*2.7 , -this.height*1); //move to elevator center
      ctx.rotate(this.planeParts.elevator.angle * Math.PI); // elevator angle
      drawElevator(ctx);

      // FOR TESTING PURPOSES
      ctx.restore();
      if (this.leftPressedBool) {ctx.fillText("left Pressed", 170, 170); }
      ctx.fillText("x = " + Math.round(this.SV.x[0]), 10, 10);
      ctx.fillText("y = " + Math.round(this.SV.x[1]), 10, 20);
      ctx.fillText("dx = " + Math.round(this.SV.v[0]), 10, 30);
      ctx.fillText("dy = " + Math.round(this.SV.v[1]), 10, 40);
    } // draw 
} // Airplane 
