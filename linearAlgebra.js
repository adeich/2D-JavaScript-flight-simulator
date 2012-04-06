function sum( ) {
  outputSum = 0;
  for (i = 0; i < arguments.length; i++) {
      outputSum += arguments[i];
  }
  return outputSum;
}


function vectorAdd(v1, v2) {
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
}

// recursive function; takes an array of matrices
function matrixMultiply(inputMatrixList) {
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
}




function testJavaScript() {
  sum = 0;
  for (i = 0; i < arguments.length; i++) {
      sum += arguments[i];
  }
  return arguments;
}
