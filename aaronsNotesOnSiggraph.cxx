Struct RigidBody {
  ...
}

RigidBody Bodies[NBODIES];

/* Copy the state information into an array */
void State_to_Array(RigidBody *rb, double *y) {

  ...
}

/* Copy information from an array into the state variables */
void Array_to_State(RigidBody *rb, double *y){
  ...

  /* Compute auxiliary variables... */

}

#define STATE_SIZE      18

void Array_to_Bodies(double y[]) {
  for(int i = 0; i < NBODIES; i++)
    Array_to_State(&Bodies[i], &y[i * STATE_SIZE]);
}

void Bodies_to_Array(double y[]) {
  for(int i = 0; i < NBODIES; i++)
    State_to_Array(&Bodies[i], &y[i * STATE_SIZE]);
}

void Compute_Force_and_Torque(double t, RigidBody *rb);

void dydt(double t, double y[], double ydot[])  {
  /* put data in y[] into Bodies[] */
  Array_to_Bodies(y);
  for(int i = 0; i < NBODIES; i++) {
    Compute_Force_and_Torque(t, &Bodies[i]);
    ddt_State_to_Array(&Bodies[i],
    &ydot[i * STATE_SIZE]);
   }
}
