
'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { SimulationOutput } from '@/components/gesture-sim/SimulationOutput';
import { Github } from 'lucide-react';
import type { SimulationResult, SensorReading } from '@/types/simulation';

// --- Simulation Logic (Placeholder) ---

// Simplified model logic: Check dominant axis and magnitude
function runSimulatedInference(data: SensorReading): SimulationResult {
  const { accel_x, accel_y, accel_z } = data;
  const threshold = 0.6; // Threshold for clear gesture detection
  const dominanceFactor = 1.5; // How much stronger the dominant axis needs to be

  const absX = Math.abs(accel_x);
  const absY = Math.abs(accel_y);
  const absZ = Math.abs(accel_z);

  // Simulate some processing time and resource usage
  const cycles = Math.floor(Math.random() * 1500) + 500; // Random cycles (500-2000)
  const memory = Math.floor(Math.random() * 100) + 100;   // Random memory (100-200 bytes)

  let recognizedGesture: SimulationResult['recognizedGesture'] = 'unknown';

  // Check Y-axis dominance for Up/Down
  if (absY > absX * dominanceFactor && absY > absZ * dominanceFactor && absY > threshold) {
    recognizedGesture = accel_y > 0 ? 'up' : 'down';
  }
  // Check X-axis dominance for Left/Right
  else if (absX > absY * dominanceFactor && absX > absZ * dominanceFactor && absX > threshold) {
     recognizedGesture = accel_x > 0 ? 'right' : 'left';
  }
   // Basic check for a potential shake (high Z or general high magnitude without clear dominance)
   // This is very simplistic for demonstration
  else if (absZ > threshold * 1.2 || (absX + absY + absZ > threshold * 2.5)) {
       // Let's add a 'shake' gesture for variety, though not in the original request.
       // If sticking strictly to original, this would remain 'unknown'.
       // recognizedGesture = 'shake'; // Or keep as 'unknown'
       recognizedGesture = 'unknown'; // Keep as unknown to match original specified gestures
  }


  return { recognizedGesture, executionCycles: cycles, memoryUsage: memory };
}


// Example ARM Assembly (Conceptual - Remains the same conceptual example)
const exampleAssemblyCode = `
; Simple Gesture Recognition Logic (Conceptual)
; Input: R0=X, R1=Y, R2=Z (scaled integers)
; Output: R0 = Gesture ID (0:Unk, 1:Up, 2:Down, 3:Left, 4:Right)

  MOV R3, #0        ; R3 = Gesture ID (default Unknown)
  MOV R4, #60       ; Threshold value (scaled, e.g., 0.6 * 100)
  MOV R8, #15       ; Dominance factor numerator (e.g., 1.5 * 10 -> 15)
  MOV R9, #10       ; Dominance factor denominator

; Get absolute values
  ABS R5, R1        ; R5 = abs(Y)
  ABS R6, R0        ; R6 = abs(X)
  ABS R7, R2        ; R7 = abs(Z)

; Check Y-axis dominance: abs(Y) > abs(X) * 1.5 AND abs(Y) > abs(Z) * 1.5
  MUL R10, R6, R8   ; R10 = abs(X) * 15
  SDIV R10, R10, R9 ; R10 = (abs(X) * 15) / 10 = abs(X) * 1.5
  CMP R5, R10
  BLE CheckXAxis    ; Branch if abs(Y) <= abs(X) * 1.5

  MUL R10, R7, R8   ; R10 = abs(Z) * 15
  SDIV R10, R10, R9 ; R10 = abs(Z) * 1.5
  CMP R5, R10
  BLE CheckXAxis    ; Branch if abs(Y) <= abs(Z) * 1.5

; Check Y magnitude: abs(Y) > threshold
  CMP R5, R4
  BLE CheckXAxis    ; Branch if abs(Y) <= threshold

; Y is dominant and above threshold
  CMP R1, #0        ; Check original Y sign
  MOVGT R3, #1      ;   Gesture = Up (Positive Y)
  MOVLT R3, #2      ;   Gesture = Down (Negative Y)
  B EndCheck

CheckXAxis:
; Check X-axis dominance: abs(X) > abs(Y) * 1.5 AND abs(X) > abs(Z) * 1.5
  MUL R10, R5, R8   ; R10 = abs(Y) * 15
  SDIV R10, R10, R9 ; R10 = abs(Y) * 1.5
  CMP R6, R10
  BLE CheckZAxisOrEnd ; Branch if abs(X) <= abs(Y) * 1.5

  MUL R10, R7, R8   ; R10 = abs(Z) * 15
  SDIV R10, R10, R9 ; R10 = abs(Z) * 1.5
  CMP R6, R10
  BLE CheckZAxisOrEnd ; Branch if abs(X) <= abs(Z) * 1.5

; Check X magnitude: abs(X) > threshold
  CMP R6, R4
  BLE CheckZAxisOrEnd ; Branch if abs(X) <= threshold

; X is dominant and above threshold
  CMP R0, #0        ; Check original X sign
  MOVGT R3, #4      ;   Gesture = Right (Positive X)
  MOVLT R3, #3      ;   Gesture = Left (Negative X)
  B EndCheck

CheckZAxisOrEnd:
; Placeholder for further checks (e.g., Z-dominance for shake) or just end
  ; Add Z-axis check logic here if needed...

EndCheck:
  MOV R0, R3        ; Return Gesture ID in R0
  BX LR             ; Return
`;


// Generate random sensor data with clearer gesture patterns
function generateRandomSensorData(): SensorReading {
  const gestureType = Math.random();
  let x = (Math.random() - 0.5) * 0.3; // Base noise reduced
  let y = (Math.random() - 0.5) * 0.3;
  let z = (Math.random() - 0.5) * 0.3;
  const magnitude = 0.8 + Math.random() * 0.5; // 0.8 to 1.3

  if (gestureType < 0.2) { // Up
    y = magnitude;
    x *= 0.5; // Reduce non-dominant axes further
    z *= 0.5;
  } else if (gestureType < 0.4) { // Down
    y = -magnitude;
    x *= 0.5;
    z *= 0.5;
  } else if (gestureType < 0.6) { // Right
    x = magnitude;
    y *= 0.5;
    z *= 0.5;
  } else if (gestureType < 0.8) { // Left
    x = -magnitude;
    y *= 0.5;
    z *= 0.5;
  }
  // Else: ~20% chance of noisy/less clear data -> likely 'unknown'

  return {
    accel_x: parseFloat(x.toFixed(3)),
    accel_y: parseFloat(y.toFixed(3)),
    accel_z: parseFloat(z.toFixed(3)),
  };
}

// Default static state to ensure server and initial client render match
const defaultSensorReading: SensorReading = { accel_x: 0, accel_y: 0, accel_z: 0 };

export default function Home() {
  const [inputData, setInputData] = useState<SensorReading>(defaultSensorReading);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState(false); // Track mount state

  useEffect(() => {
    setIsMounted(true);
    // Generate the first random data set only on the client after mount
    // to prevent hydration mismatch if Math.random was used in default state.
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
    }, 1200); // Simulate 1.2 seconds delay (slightly reduced)
  };

  // Render default static data until mounted, then use the client-generated data
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
          {/* Disable button until component is mounted to prevent hydration issues */}
          <Button onClick={handleRunSimulation} disabled={isLoading || !isMounted}>
            {isLoading ? 'Simulating...' : (isMounted ? 'Generate Data & Run Simulation' : 'Loading...')}
          </Button>
        </div>

        <SimulationOutput
          inputData={displayInputData} // Use data appropriate for the render phase
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
