linearAlgebra = {
  sum: function sum( ) {
  outputSum = 0;
  for (i = 0; i < arguments.length; i++) {
      outputSum += arguments[i];
  }
  return outputSum;
},

vectorAdd: function(v1, v2) {
  if (v1.length != v2.length) {
    throw {
      name: 'WrongVectorDimensions',
      message: 'cannot add vectors of different dimensions'
    }
    return;
  }
  dimension = v1.length;
  output = new Array(dimension);              // will add v1 to v2 
  for (i = 0; i < dimension; i += 1) {
    output[i] = v1[i] + v2[i]
  }
  return output;
},


// recursive function; takes an array of matrices
matrixMultiply : function(inputMatrixList) {
  m0 = inputMatrixList[0]; 
  m1 = inputMatrixList[1];
  
  if (m0[0].length != m1.length)  // if dimensions not right
    {                                           // between first and second matrices
      errorMessageString = 'first matrix is (' + m0.length + ' x ' 
                  + m0[0].length + ') and second matrix is ('
                + m1.length + ' x ' + m1[0].length + ').';

     throw {
        name: 'WrongMatrixDimensions',
        message: errorMessageString
      } 
    return;
  }  


  // create new empty matrix which will contain m0 and m1 multiplied
  var multipliedMatrix = new Array();    
  for (i = 0; i < m0.length; i++)  {             
    multipliedMatrix[i] = new Array();
  }
  

  // the actual matrix multiplication
  for (i = 0; i < m0.length; i++) {    // i is rows
    for (j = 0; j < m1[0].length; j++) {   // j is columns
      littleSum = 0;
      for (k = 0; k < m0[0].length; k++) {
        littleSum += m0[i][k] * m1[k][j];
      }
     multipliedMatrix[i][j] =  littleSum;
    }
  }   
  
  // if only two or one matrices were given, no more recursion 
  if (inputMatrixList.length == 1 || inputMatrixList.length == 2) {
    return multipliedMatrix;
  } 
  // otherwise, recursion!
  else {
  inputMatrixList.splice(0,2); // remove first two elements 
  newInputMatrixList = [multipliedMatrix].concat(inputMatrixList);
  return  matrixMultiply(newInputMatrixList);  
  }
},


// return the magnitude of an n-dimensional vector
vectorMag : function(vec) {
  var square_sum = 0;
  for (i in vec) {
    square_sum += vec[i] * vec[i];
  }
  return Math.sqrt(square_sum);
},

// return the normalized version of an n-dimensional vector
normalize: function(vec) {
  var length = this.vectorMag(vec);
  var out_vec = [];
  for (i in vec) {
    out_vec[i] = vec[i] / length;
  }
  return out_vec;
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
},

//returns vec * m, where m is a scalar.
scalarMult: function(vec, m) {
  output_vec = [];
  for (i in vec) {
    output_vec[i] = vec[i] * m;
  } 
  return output_vec;
}

} // end of linearAlgebra
