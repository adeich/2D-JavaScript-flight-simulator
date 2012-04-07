physics = {
  // in xy frame.
  computeNextSV : function(SV, netForce, netTorque, dt) {
 
  // first, the linear stuff:
    // compute linear acceleration, a 2d vector.
    var a = [(1/SV.mass) * netForce[0], (1/SV.mass) * netForce[1]]; 
    // compute linear velocity, a 2d vector.
    var next_v = [SV.v[0] + (a[0] * dt), SV.v[1] + (a[1] * dt)];
    // compute new position of CM, a 2d vector.
    var next_x = [SV.x[0] + (SV.v[0] * dt), SV.x[1] + (SV.v[1] * dt)];
    
  // second, the rotational stuff:
    // compute rotational acceleration, a scalar
    var alpha =  netTorque / SV.I;
//    alert("alpha: " + alpha + " SV.I: " + SV.I + " nettorque: " + netTorque)
    // compute rotational velocity, a scalar.
    var next_omega = SV.omega + (alpha * dt);
//    alert("next_omega: " + next_omega)
    // compute rotational position, a scalar.
    var next_theta = SV.theta + (next_omega * dt);
//    alert("next_theta" + next_theta)    

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
                                   wind_vector_xy) {
    var ro = 1; // fluid density.
    var co_l = function(){
      var AOAdegrees = (180/Math.PI) * angle_of_attack;
      if (Math.abs(AOAdegrees) > 25) { return 0; }
      else {return (AOAdegrees * 0.001);}
    }(); // coefficient of lift.
    var co_d = function(){
      var AOAdegrees = (180/Math.PI) * angle_of_attack;
      return (AOAdegrees * 0.01);
    }(); // coefficient of drag.


   // alert(wind_vector_xy);
    var planformArea = surfaceArea * Math.sin(angle_of_attack); 
    // compute lift magnitude.
    var lift_mag = (1/2) * ro * (windSpeed) * (windSpeed) * planformArea * co_l;
    // compute drag magnitude.
    var drag_mag = Math.abs((1/2) * ro * (windSpeed) * (windSpeed) * planformArea * co_d);
    // compute force vector in frame where wind is horizontal.
    var net_force = [drag_mag, lift_mag];
 //   alert("lift_mag: " + lift_mag + " drag_mag: " + drag_mag )
    // rotate force vector to be in xy frame.
    // var wind_angle_in_xy = Math.atan(wind_vector_xy[1] / wind_vector_xy[0]);
    var normalized_wind_vec = linearAlgebra.normalize(wind_vector_xy);
    var drag_xy = linearAlgebra.scalarMult(normalized_wind_vec, -1 * drag_mag);
    var lift_xy = linearAlgebra.scalarMult(linearAlgebra.rotate2d(normalized_wind_vec, Math.PI / 2)
                                              , -1 * lift_mag);
    var net_force_xy = linearAlgebra.vectorAdd(drag_xy, lift_xy);

    return net_force_xy;
  },  
  


  //compute the torque exerted by force at displacement
  computeTorque: function(force, displacement) {
    var torque = force[0] * displacement[1] - force[1] * displacement[0];
    return torque;
  }
} // end of physics
