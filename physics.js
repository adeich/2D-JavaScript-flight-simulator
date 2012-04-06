physics = {
  // in xy frame.
  computeNextSV : function(SV, netForce, netTorque, dt) {
 
  // first, the linear stuff:
    // compute linear acceleration, a 2d vector.
    var a = [SV.mass * netForce[0], SV.mass * netForce[1]]; 
    // compute linear velocity, a 2d vector.
    var next_v = [SV.v[0] + (a[0] * dt), SV.v[1] + (a[1] * dt)];
    // compute new position of CM, a 2d vector.
    var next_x = [SV.x[0] + (v[0] * dt), SV.x[1] + (v[0] *dt)];
    
  // second, the rotational stuff:
    // compute rotational acceleration, a scalar
    var alpha = SV.I * netTorque;
    // compute rotational velocity, a scalar.
    var next_omega = SV.omega + (alpha * dt);
    // compute rotational position, a scalar.
    var next_theta = SV.theta + (next_omega * dt);
    
    var nextSV = {
      x: next_x,
      v: next_v,
      theta: next_theta,
      omega: next_omega,
      mass: SV.mass,
      I: SV.I
    };

    return nextSV; 
  },
  

  // returns total force contribution in xy frame.
  computeAeroForce: function(surfaceArea, angle_of_attack, windSpeed,
                                   wind_angle_in_xy) {
    var ro = 1; // fluid density.
    var co_l = 1; // coefficient of lift.
    var co_d = 1; // coefficient of drag.

    var planformArea = surfaceArea * Math.sin(angle_of_attack); 
    // compute lift magnitude.
    var lift_mag = (1/2) * ro * (windSpeed) * (windSpeed) * planformArea * co_l;
    // compute drag magnitude.
    var drag_mag = (-1) * (1/2) * ro * (windSpeed) * (windSpeed) * planformArea * co_d;
    // compute force vector in frame where wind is horizontal.
    var net_force = [drag_mag, lift_mag];
    // rotate force vector to be in xy frame.
    var net_force_xy = this.rotate(net_force, wind_angle_in_xy);

    return net_force_xy;
  },  
  

  rotate2d: function(vector, rotation_angle) {
    if (vector.length != 2) {throw "vector of wrong dimension!"};
    var a = rotation_angle;
    var round = function(m) {return Math.round(1000 * m) / 1000;};
    var sin_a = Math.sin(a);
    var cos_a = Math.cos(a);
    new_angle = [];
    var x = vector[0];
    var y = vector[1];
    new_angle[0] = round(x * cos_a - y * sin_a);
    new_angle[1] = round(x * sin_a + y * cos_a);
  
    return new_angle;
  }
} // end of physics
