//=============================================================================
// PONG
//=============================================================================

Pong = {

// GAME LOOP ===========================================================
// INITIALIZE ------------------------------------------------------------

  Defaults: {
    width:     640,   // logical canvas width (browser will scale to physical canvas size - which is controlled by @media css queries)
    height:    480,   // logical canvas height (ditto)
    wallWidth: 10,
    stats:     true
  },


  initialize: function(runner, cfg) {
    this.cfg    = cfg; // cfg refers to Defaults
    this.runner = runner;
    this.width  = runner.width;
    this.height = runner.height;
    this.airplane = this.constructAirplane();
    this.aaronsClouds = this.constructAaronsClouds(); //AARONS FUNCTION
    this.doDrawAlert = true;
    this.runner.start();
  },


  constructAirplane: function() {
    var airplane = Object.construct(Airplane, this); 
                          // was Pong.Airplane, but now refers to Airplane defined in 
                          // Airplane.js
    return airplane;
  },

  constructAaronsClouds: function() {
    var clouds = Object.construct(Pong.AaronsClouds, this);
    return clouds;
  },

// UPDATE -------------------------------------------------------------------

  localUpdate: function(dt) {
      this.airplane.update(dt);
      screenCorner = this.airplane.getScreenCorner();
      this.aaronsClouds.update(screenCorner);
  },
  update: function(dt) {  // update is called by game.js
    this.localUpdate(dt);      
  },

// DRAW --------------------------------------------------------------------

  draw: function(ctx) {
//    this.drawAlert(ctx);
    this.aaronsClouds.draw(ctx);
    this.airplane.draw(ctx);
  },

  drawAlert: function(ctx) { //AARONS FUNCTION
    if (this.doDrawAlert) {
      ctx.fillStyle = 'black';
      ctx.font = '11pt sans-serif';
      ctx.fillText("test alert", 150, 150);
      }
  },

// END OF GAME LOOP ==========================================================

// ----------- key assignment ------------

  onkeydown: function(keyCode) {
    var a = this.airplane.keyMaps;
    switch(keyCode) {
      case Game.KEY.A: this.aaronsClouds.drawIt(); 
                        a.rotateCCwisePressed(); break; 
      case Game.KEY.L: this.aaronsClouds.drawIt2();
                        a.rotateCwisePressed(); break;
      case Game.KEY.UP: a.upPressed(); break;
      case Game.KEY.DOWN: a.downPressed(); break;
      case Game.KEY.LEFT: a.leftPressed(); 
                          a.upElevatorPressed(); break;
      case Game.KEY.RIGHT: a.rightPressed();
                           a.downElevatorPressed();  break;
    }
  },

  onkeyup: function(keyCode) {
    var a = this.airplane.keyMaps;
    switch(keyCode) {
      case Game.KEY.A: this.aaronsClouds.stopDrawIt();
                      a.rotateCCwiseUnPressed(); break;
      case Game.KEY.L: this.aaronsClouds.stopDrawIt2();
                        a.rotateCwiseUnPressed(); break;
      case Game.KEY.UP: a.upUnPressed(); break;
      case Game.KEY.DOWN: a.downUnPressed(); break;
      case Game.KEY.LEFT: a.leftUnPressed(); 
                          a.upElevatorUnPressed(); break;
      case Game.KEY.RIGHT: a.rightUnPressed();
                           a.downElevatorUnPressed();  break;
    }
  },

// --------- Clouds -------------------

  AaronsClouds: {     //clouds is a rectangle twice the court area
    initialize: function(pong) {
      this.pong = pong; // 'this' is bound to the object AaronsClouds.
      this.x = 0; // x is the left side of the rect.
      this.y = 0; // y is the top of the rect.
      this.height = 2 * pong.height;
      this.width = 2 * pong.width;
      this.dx = 100; // speed is built in for now
      this.dy = 100; // speed is built in for now
      this.numClouds = 3;
      this.drawAlert = true;
      this.drawAlert2 = true;
    },

    update: function(screenCorner) {  // the parameter is an array
      this.x = screenCorner[0];
      this.y = screenCorner[1];
    },

    draw: function(ctx) {
    // FOR TESTING: 
    //  ctx.fillStyle = 'purple';
    //  ctx.font = '11pt sans-serif';
    //  ctx.fillText("x is " + this.x + " and y is " + this.y, 200, 200);
      this.cloudCornerX = this.x % (this.pong.width/this.numClouds);
      this.cloudCornerY = this.y % (this.pong.height/this.numClouds);
      numClouds = this.numClouds;

      ctx.fillStyle = "rgb(123, 206, 250)"; // sky blue
      ctx.fillRect(0, 0, this.width, this.height);
      ctx.fillStyle = "rgb(136, 218, 262)"; // cloud color
      for (i = 0; i <= numClouds; i++) {
        for (j = 0; j <= numClouds; j++) {
          ctx.fillRect((this.pong.width / this.numClouds)*i 
                              - this.cloudCornerX, 
                   (this.pong.height /this.numClouds)*j 
                              - this.cloudCornerY,
                      this.pong.width / (this.numClouds +1),
                      this.pong.height / (this.numClouds +1));
        }
      }
      ctx.fillStyle = 'purple';
      ctx.fillText("cloudCornerX is " +
          Math.round(this.cloudCornerX/1) +
                    ", cloudCornerY is " +
          Math.round(this.cloudCornerY/1),
                                   100, 100);

        if (this.drawAlert) {
          ctx.fillStyle = 'black';
          ctx.font = '11pt sans-serif';
          ctx.fillText("test alert A", 150, 150);
          };

        if (this.drawAlert2) {
          ctx.fillStyle = 'black';
          ctx.font = '11pt sans-serif';
          ctx.fillText("test alert L", 160, 160);
          }
    },

    drawIt:     function() { this.drawAlert = true; },
    stopDrawIt: function() { this.drawAlert = false;},
    drawIt2:     function() { this.drawAlert2 = true; },
    stopDrawIt2: function() { this.drawAlert2 = false;}
    
  } // AaronsClouds

}; // Pong
