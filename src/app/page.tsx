
'use client';

import type React from 'react';
import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { SimulationOutput } from '@/components/gesture-sim/SimulationOutput';
import { Github, Play } from 'lucide-react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { SimulationResult, SensorReading, Gesture } from '@/types/simulation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

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

  let recognizedGesture: Gesture = 'unknown';

  // Check Y-axis dominance for Up/Down
  if (absY > absX * dominanceFactor && absY > absZ * dominanceFactor && absY > threshold) {
    recognizedGesture = accel_y > 0 ? 'up' : 'down';
  }
  // Check X-axis dominance for Left/Right
  else if (absX > absY * dominanceFactor && absX > absZ * dominanceFactor && absX > threshold) {
     recognizedGesture = accel_x > 0 ? 'right' : 'left';
  }
   // Basic check for potential noise/unknown (low magnitude or no clear dominance)
  else if (absX < threshold * 0.5 && absY < threshold * 0.5 && absZ < threshold * 0.5) {
     recognizedGesture = 'unknown';
  } else if (absX < threshold && absY < threshold && absZ < threshold) {
      // Low magnitude, also potentially unknown
      recognizedGesture = 'unknown';
  } // Default remains 'unknown' if no other condition is met


  return { recognizedGesture, executionCycles: cycles, memoryUsage: memory };
}


// Example ARM Assembly (Conceptual - Remains the same conceptual example)
const exampleAssemblyCode = `
; Simple Gesture Recognition Logic (Conceptual)
; Input: R0=X, R1=Y, R2=Z (scaled integers, e.g., float * 100)
; Output: R0 = Gesture ID (0:Unk, 1:Up, 2:Down, 3:Left, 4:Right)

  MOV R3, #0        ; R3 = Gesture ID (default Unknown)
  MOV R4, #60       ; Threshold value (scaled, e.g., 0.6 * 100)
  MOV R8, #3        ; Dominance factor numerator (e.g., 1.5 -> 3/2)
  MOV R9, #2        ; Dominance factor denominator

; Get absolute values (assuming integer inputs now)
  CMP R1, #0
  IT LT
  RSBLT R5, R1, #0  ; R5 = abs(Y) if R1 < 0
  MOVGE R5, R1      ; R5 = abs(Y) if R1 >= 0

  CMP R0, #0
  IT LT
  RSBLT R6, R0, #0  ; R6 = abs(X) if R0 < 0
  MOVGE R6, R0      ; R6 = abs(X) if R0 >= 0

  CMP R2, #0
  IT LT
  RSBLT R7, R2, #0  ; R7 = abs(Z) if R2 < 0
  MOVGE R7, R2      ; R7 = abs(Z) if R2 >= 0


; Check Y-axis dominance: abs(Y) > abs(X) * 1.5 AND abs(Y) > abs(Z) * 1.5
  MUL R10, R6, R8   ; R10 = abs(X) * 3
  UDIV R10, R10, R9 ; R10 = abs(X) * 3 / 2 = abs(X) * 1.5 (integer division)
  CMP R5, R10
  BLE CheckXAxis    ; Branch if abs(Y) <= abs(X) * 1.5

  MUL R10, R7, R8   ; R10 = abs(Z) * 3
  UDIV R10, R10, R9 ; R10 = abs(Z) * 1.5
  CMP R5, R10
  BLE CheckXAxis    ; Branch if abs(Y) <= abs(Z) * 1.5

; Check Y magnitude: abs(Y) > threshold
  CMP R5, R4
  BLE CheckXAxis    ; Branch if abs(Y) <= threshold

; Y is dominant and above threshold
  CMP R1, #0        ; Check original Y sign (input register R1)
  MOVGT R3, #1      ;   Gesture = Up (Positive Y)
  MOVLT R3, #2      ;   Gesture = Down (Negative Y)
  B EndCheck

CheckXAxis:
; Check X-axis dominance: abs(X) > abs(Y) * 1.5 AND abs(X) > abs(Z) * 1.5
  MUL R10, R5, R8   ; R10 = abs(Y) * 3
  UDIV R10, R10, R9 ; R10 = abs(Y) * 1.5
  CMP R6, R10
  BLE EndCheck      ; Branch if abs(X) <= abs(Y) * 1.5 (Go to end if not dominant)

  MUL R10, R7, R8   ; R10 = abs(Z) * 3
  UDIV R10, R10, R9 ; R10 = abs(Z) * 1.5
  CMP R6, R10
  BLE EndCheck      ; Branch if abs(X) <= abs(Z) * 1.5 (Go to end if not dominant)

; Check X magnitude: abs(X) > threshold
  CMP R6, R4
  BLE EndCheck      ; Branch if abs(X) <= threshold (Go to end)

; X is dominant and above threshold
  CMP R0, #0        ; Check original X sign (input register R0)
  MOVGT R3, #4      ;   Gesture = Right (Positive X)
  MOVLT R3, #3      ;   Gesture = Left (Negative X)
  ; Fall through to EndCheck

EndCheck:
  MOV R0, R3        ; Return Gesture ID in R0
  BX LR             ; Return
`;


// Generate sensor data based on selected type
type GestureGenerationType = 'random' | Gesture;

function generateSensorData(type: GestureGenerationType): SensorReading {
  let x = (Math.random() - 0.5) * 0.3; // Base noise
  let y = (Math.random() - 0.5) * 0.3;
  let z = (Math.random() - 0.5) * 0.3;
  const magnitude = 0.8 + Math.random() * 0.5; // 0.8 to 1.3

  switch (type) {
    case 'up':
      y = magnitude;
      x *= 0.3; // Reduce non-dominant axes
      z *= 0.3;
      break;
    case 'down':
      y = -magnitude;
      x *= 0.3;
      z *= 0.3;
      break;
    case 'left':
      x = -magnitude;
      y *= 0.3;
      z *= 0.3;
      break;
    case 'right':
      x = magnitude;
      y *= 0.3;
      z *= 0.3;
      break;
    case 'unknown': // Generate data likely to be classified as unknown
      // Keep moderate noise on all axes, avoid clear dominance
       x = (Math.random() - 0.5) * 0.4; // Slightly lower noise for unknown
       y = (Math.random() - 0.5) * 0.4;
       z = (Math.random() - 0.5) * 0.4;
      break;
    case 'random':
    default:
      // Use existing random generation logic but ensure some variance
       const gestureType = Math.random();
       if (gestureType < 0.2) { // More pronounced up
           y = magnitude; x *= 0.4; z *= 0.4;
        } else if (gestureType < 0.4) { // More pronounced down
            y = -magnitude; x *= 0.4; z *= 0.4;
        } else if (gestureType < 0.6) { // More pronounced right
            x = magnitude; y *= 0.4; z *= 0.4;
        } else if (gestureType < 0.8) { // More pronounced left
            x = -magnitude; y *= 0.4; z *= 0.4;
        }
      // ~20% remain as less clear noise/unknown
      break;
  }

  return {
    accel_x: parseFloat(x.toFixed(3)),
    accel_y: parseFloat(y.toFixed(3)),
    accel_z: parseFloat(z.toFixed(3)),
  };
}

// Default static state for initial render, consistent between server and client
const defaultSensorReading: SensorReading = { accel_x: 0, accel_y: 0, accel_z: 0 };

export default function Home() {
  const [inputData, setInputData] = useState<SensorReading>(defaultSensorReading);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generationType, setGenerationType] = useState<GestureGenerationType>('random');


  const handleRunSimulation = useCallback(() => {
    setIsLoading(true);
    setSimulationResult(null); // Clear previous result immediately

    // Generate new data based on the selected type *before* simulation
    const newData = generateSensorData(generationType);
    setInputData(newData); // Update input data state *after* generation

    // Simulate asynchronous operation (e.g., calling the actual inference engine)
    // Using setTimeout for demonstration
    setTimeout(() => {
      // Run inference with the *newly generated* data
      const result = runSimulatedInference(newData);
      setSimulationResult(result);
      setIsLoading(false);
    }, 350); // Slightly longer delay for visual feedback
  }, [generationType]); // Depend on generationType


  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl"> {/* Increased max-width */}
      <header className="mb-8 flex flex-col items-center text-center">
        <h1 className="text-4xl font-bold text-primary mb-2">GestureSim</h1> {/* Larger heading */}
        <p className="text-lg text-muted-foreground max-w-2xl">
          Simulate Edge AI: Run gesture recognition logic written in ARM Assembly on virtual sensor data.
        </p>
         <a href="https://github.com/FirebaseExtended/studio-examples/tree/main/gesture-sim" target="_blank" rel="noopener noreferrer" className="inline-flex items-center mt-3 text-sm text-accent hover:underline">
          <Github className="w-4 h-4 mr-1.5" /> View Source on GitHub
        </a>
      </header>

      <main className="space-y-8"> {/* Increased spacing */}
         <Card className="shadow-md"> {/* Add shadow to card */}
           <CardHeader>
             <CardTitle>Simulation Control</CardTitle>
             <CardDescription>Generate sensor data and run the simulated inference.</CardDescription>
           </CardHeader>
           <CardContent className="flex flex-col sm:flex-row items-center justify-center gap-6"> {/* Increased gap */}
             {/* Data Generation Type Selection */}
             <div className="flex items-center gap-3"> {/* Increased gap */}
               <Label htmlFor="gesture-type-select" className="text-sm font-medium">Generate Data For:</Label> {/* Added font-medium */}
                <Select
                  value={generationType}
                  onValueChange={(value) => setGenerationType(value as GestureGenerationType)}
                  disabled={isLoading}
                >
                  <SelectTrigger id="gesture-type-select" className="w-[180px]"> {/* Wider select */}
                    <SelectValue placeholder="Select Gesture Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="random">Random Gesture</SelectItem>
                    <SelectItem value="up">Up Motion</SelectItem>
                    <SelectItem value="down">Down Motion</SelectItem>
                    <SelectItem value="left">Left Motion</SelectItem>
                    <SelectItem value="right">Right Motion</SelectItem>
                    <SelectItem value="unknown">Unknown (Noise)</SelectItem>
                  </SelectContent>
                </Select>
             </div>

            {/* Simulation Button */}
            <Button onClick={handleRunSimulation} disabled={isLoading} size="lg" className="w-full sm:w-auto shadow-sm"> {/* Larger button, add shadow */}
              <Play className="w-5 h-5 mr-2" /> {/* Add icon */}
              {isLoading ? 'Simulating...' : 'Run Simulation'}
            </Button>
          </CardContent>
         </Card>

        {/* Separator for visual distinction */}
         <Separator className="my-8" />

        {/* Pass the current inputData and simulationResult */}
        <SimulationOutput
          inputData={inputData}
          assemblyCode={exampleAssemblyCode}
          simulationResult={simulationResult}
          isLoading={isLoading}
        />
      </main>

      <footer className="mt-16 pt-8 border-t text-center text-sm text-muted-foreground"> {/* Increased margin */}
        <p>This is a conceptual simulation. Actual ARM execution requires a proper emulator (e.g., QEMU, Keil µVision) and toolchain.</p>
        <p>&copy; {new Date().getFullYear()} GestureSim Project. Built with Next.js and Shadcn/ui.</p>
      </footer>
    </div>
  );
}
