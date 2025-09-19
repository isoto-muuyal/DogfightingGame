import * as THREE from "three";
import { AircraftState } from "./stores/useFlightGame";

export interface FlightControls {
  throttleUp: boolean;
  throttleDown: boolean;
  pitchUp: boolean;
  pitchDown: boolean;
  yawLeft: boolean;
  yawRight: boolean;
  rollLeft: boolean;
  rollRight: boolean;
  moveUp: boolean;
  moveDown: boolean;
  brake: boolean;
  shoot: boolean;
}

export function applyFlightPhysics(
  currentState: AircraftState,
  controls: FlightControls,
  deltaTime: number
): AircraftState {
  // Create new state object
  const newState: AircraftState = {
    position: currentState.position.clone(),
    rotation: currentState.rotation.clone(),
    velocity: currentState.velocity.clone(),
    health: currentState.health,
    throttle: currentState.throttle
  };

  // Throttle control
  const throttleSpeed = 2.0; // How fast throttle changes
  if (controls.throttleUp) {
    newState.throttle = Math.min(1.0, newState.throttle + throttleSpeed * deltaTime);
  }
  if (controls.throttleDown) {
    newState.throttle = Math.max(0.0, newState.throttle - throttleSpeed * deltaTime);
  }
  if (controls.brake) {
    newState.throttle = Math.max(0.0, newState.throttle - throttleSpeed * 2 * deltaTime);
  }

  // Flight control responsiveness
  const pitchSpeed = 1.5;
  const yawSpeed = 1.0;
  const rollSpeed = 2.0;
  const verticalSpeed = 15.0;

  // Pitch control (up/down)
  if (controls.pitchUp) {
    newState.rotation.x -= pitchSpeed * deltaTime;
  }
  if (controls.pitchDown) {
    newState.rotation.x += pitchSpeed * deltaTime;
  }

  // Yaw control (left/right)
  if (controls.yawLeft) {
    newState.rotation.y += yawSpeed * deltaTime;
  }
  if (controls.yawRight) {
    newState.rotation.y -= yawSpeed * deltaTime;
  }

  // Roll control
  if (controls.rollLeft) {
    newState.rotation.z += rollSpeed * deltaTime;
  }
  if (controls.rollRight) {
    newState.rotation.z -= rollSpeed * deltaTime;
  }

  // Direct vertical movement (R/F keys for up/down)
  if (controls.moveUp) {
    newState.velocity.y += verticalSpeed * deltaTime;
  }
  if (controls.moveDown) {
    newState.velocity.y -= verticalSpeed * deltaTime;
  }

  // Limit rotation angles for realism
  newState.rotation.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, newState.rotation.x));
  newState.rotation.z = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, newState.rotation.z));

  // Calculate forward direction based on rotation
  const forward = new THREE.Vector3(0, 0, -1);
  const quaternion = new THREE.Euler(
    newState.rotation.x,
    newState.rotation.y,
    newState.rotation.z
  );
  forward.applyEuler(quaternion);

  // Apply throttle to create thrust
  const maxSpeed = 50;
  const thrust = forward.multiplyScalar(newState.throttle * maxSpeed);

  // Simple physics: velocity affected by thrust and drag
  const drag = 0.98; // Drag coefficient
  newState.velocity.multiplyScalar(drag);
  newState.velocity.add(thrust.multiplyScalar(deltaTime));

  // Gravity effect
  const gravity = new THREE.Vector3(0, -9.8, 0);
  newState.velocity.add(gravity.multiplyScalar(deltaTime));

  // Update position
  newState.position.add(newState.velocity.clone().multiplyScalar(deltaTime));

  // Ground collision (simple)
  if (newState.position.y <= 2) {
    newState.position.y = 2;
    newState.velocity.y = Math.max(0, newState.velocity.y);
  }

  // Boundary limits to keep player in the green area (approximately 100x100 area)
  const boundary = 100;
  if (newState.position.x > boundary) {
    newState.position.x = boundary;
    newState.velocity.x = Math.min(0, newState.velocity.x);
  }
  if (newState.position.x < -boundary) {
    newState.position.x = -boundary;
    newState.velocity.x = Math.max(0, newState.velocity.x);
  }
  if (newState.position.z > boundary) {
    newState.position.z = boundary;
    newState.velocity.z = Math.min(0, newState.velocity.z);
  }
  if (newState.position.z < -boundary) {
    newState.position.z = -boundary;
    newState.velocity.z = Math.max(0, newState.velocity.z);
  }

  // Auto-level tendencies for easier flight
  const levelingForce = 0.5;
  newState.rotation.x *= (1 - levelingForce * deltaTime);
  newState.rotation.z *= (1 - levelingForce * deltaTime);

  return newState;
}
