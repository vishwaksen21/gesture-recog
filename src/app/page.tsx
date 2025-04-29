
'use client';

import { useState, useEffect } from 'react';
import type React from 'react';
import { Button } from '@/components/ui/button';
import { SimulationOutput } from '@/components/gesture-sim/SimulationOutput';
import { Github } from 'lucide-react';

// --- Simulation Logic (Placeholder) ---
// In a real scenario, this would involve:
// 1. Sending data to a backend/worker that runs QEMU/Keil.
// 2. Receiving the result.
// Here, we simulate the process with a delay and predefined logic.

interface SensorReading {
  accel_x: number;
  accel_y: number;
  accel_z: number;
}

interface SimulationResult {
  recognizedGesture: 'up' | 'down' | 'left' | 'right' | 'unknown';
  executionCycles?: number;
  memoryUsage?: number;
}

// Simplified model logic (example: based on dominant axis)
function runSimulatedInference(data: SensorReading): SimulationResult {
  const { accel_x, accel_y, accel_z } = data;
  const threshold = 0.5; // Example threshold

  // Simulate some processing time
  const cycles = Math.floor(Math.random() * 1000) + 500; // Random cycles (500-1500)
  const memory = Math.floor(Math.random() * 50) + 100;    // Random memory (100-150 bytes)

  if (Math.abs(accel_y) > Math.abs(accel_x) && Math.abs(accel_y) > Math.abs(accel_z)) {
    if (accel_y > threshold) return { recognizedGesture: 'up', executionCycles: cycles, memoryUsage: memory };
    if (accel_y < -threshold) return { recognizedGesture: 'down', executionCycles: cycles, memoryUsage: memory };
  } else if (Math.abs(accel_x) > Math.abs(accel_y) && Math.abs(accel_x) > Math.abs(accel_z)) {
    if (accel_x > threshold) return { recognizedGesture: 'right', executionCycles: cycles, memoryUsage: memory };
    if (accel_x < -threshold) return { recognizedGesture: 'left', executionCycles: cycles, memoryUsage: memory };
  }

  // If no clear dominant axis or below threshold
  return { recognizedGesture: 'unknown', executionCycles: cycles, memoryUsage: memory };
}


// Example ARM Assembly (Conceptual - Not functional simulation)
const exampleAssemblyCode = `
; Simple Gesture Recognition Logic (Conceptual)
; Input: R0=X, R1=Y, R2=Z (scaled integers)
; Output: R0 = Gesture ID (0:Unk, 1:Up, 2:Down, 3:Left, 4:Right)

  MOV R3, #0        ; R3 = Gesture ID (default Unknown)
  MOV R4, #50       ; Threshold value (scaled)

; Check Y-axis dominance
  ABS R5, R1        ; R5 = abs(Y)
  ABS R6, R0        ; R6 = abs(X)
  ABS R7, R2        ; R7 = abs(Z)

  CMP R5, R6        ; if abs(Y) > abs(X)
  BLE CheckXAxis    ; Branch if less than or equal
  CMP R5, R7        ;   and abs(Y) > abs(Z)
  BLE CheckXAxis    ; Branch if less than or equal

; Y is dominant
  CMP R1, R4        ; if Y > Threshold
  MOVGT R3, #1      ;   Gesture = Up
  CMP R1, #-R4      ; if Y < -Threshold
  MOVLT R3, #2      ;   Gesture = Down
  B EndCheck

CheckXAxis:
; Check X-axis dominance (only if Y wasn't dominant)
  CMP R6, R7        ; if abs(X) > abs(Z)
  BLE EndCheck      ; Branch if less than or equal

; X is dominant
  CMP R0, R4        ; if X > Threshold
  MOVGT R3, #4      ;   Gesture = Right
  CMP R0, #-R4      ; if X < -Threshold
  MOVLT R3, #3      ;   Gesture = Left

EndCheck:
  MOV R0, R3        ; Return Gesture ID in R0
  BX LR             ; Return
`;


// Generate random sensor data
function generateRandomSensorData(): SensorReading {
  // Skew towards one axis sometimes for clearer gestures
  const axis = Math.random();
  let x = (Math.random() - 0.5) * 0.5; // Base noise
  let y = (Math.random() - 0.5) * 0.5;
  let z = (Math.random() - 0.5) * 0.5;

  if (axis < 0.2) y = 0.8 + Math.random() * 0.4; // Up
  else if (axis < 0.4) y = -0.8 - Math.random() * 0.4; // Down
  else if (axis < 0.6) x = 0.8 + Math.random() * 0.4; // Right
  else if (axis < 0.8) x = -0.8 - Math.random() * 0.4; // Left
  // Else: remains noisy/near zero -> unknown

  return {
    accel_x: parseFloat(x.toFixed(3)), // Keep precision consistent
    accel_y: parseFloat(y.toFixed(3)),
    accel_z: parseFloat(z.toFixed(3)),
  };
}

// Default state to ensure server and initial client render match
const defaultSensorReading: SensorReading = { accel_x: 0, accel_y: 0, accel_z: 0 };

export default function Home() {
  const [inputData, setInputData] = useState<SensorReading>(defaultSensorReading);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState(false); // Track mount state

  useEffect(() => {
    setIsMounted(true);
    // Generate the first random data set only on the client after mount
    setInputData(generateRandomSensorData());
  }, []); // Empty dependency array ensures this runs only once after mount

  const handleRunSimulation = () => {
    setIsLoading(true);
    setSimulationResult(null); // Clear previous result

    // Generate new data for this run
    const newData = generateRandomSensorData();
    setInputData(newData);

    // Simulate asynchronous operation (like calling an external simulator)
    setTimeout(() => {
      const result = runSimulatedInference(newData);
      setSimulationResult(result);
      setIsLoading(false);
    }, 1500); // Simulate 1.5 seconds delay
  };

  // Prevent rendering potentially mismatched data during hydration
  const displayInputData = isMounted ? inputData : defaultSensorReading;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-primary mb-2">GestureSim</h1>
        <p className="text-muted-foreground">
          Simulated Edge AI: ARM Assembly Gesture Recognition on a Virtual Microcontroller
        </p>
         <a href="https://github.com/FirebaseExtended/studio-examples/tree/main/gesture-sim" target="_blank" rel="noopener noreferrer" className="inline-flex items-center mt-2 text-sm text-accent hover:underline">
          <Github className="w-4 h-4 mr-1" /> View Source on GitHub
        </a>
      </header>

      <main className="space-y-6">
         <div className="text-center mb-6">
          <Button onClick={handleRunSimulation} disabled={isLoading || !isMounted}>
            {isLoading ? 'Simulating...' : (isMounted ? 'Generate Data & Run Simulation' : 'Loading...')}
          </Button>
        </div>

        <SimulationOutput
          inputData={displayInputData}
          assemblyCode={exampleAssemblyCode}
          simulationResult={simulationResult}
          isLoading={isLoading || !isMounted} // Show loading until mounted and first data generated
        />
      </main>

      <footer className="mt-12 pt-6 border-t text-center text-sm text-muted-foreground">
        <p>This is a conceptual simulation. Actual ARM execution requires a proper emulator (QEMU/Keil) environment.</p>
        <p>&copy; {new Date().getFullYear()} GestureSim Project</p>
      </footer>
    </div>
  );
}
