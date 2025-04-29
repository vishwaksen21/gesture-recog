
// Define the structure for simulated sensor data
export interface SensorReading {
  accel_x: number;
  accel_y: number;
  accel_z: number;
}

// Define the possible gestures
export type Gesture = 'up' | 'down' | 'left' | 'right' | 'unknown'; // Removed 'shake' to align with original request

// Define the structure for the simulation result
export interface SimulationResult {
  recognizedGesture: Gesture;
  executionCycles?: number; // Optional metrics
  memoryUsage?: number; // Optional metrics (e.g., in bytes)
}
