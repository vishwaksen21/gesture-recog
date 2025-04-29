
'use client';

import type React from 'react';
import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { SimulationOutput } from '@/components/gesture-sim/SimulationOutput';
import { Github, Play, Activity, Cpu, MemoryStick } from 'lucide-react'; // Added Activity
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

// --- Simulation Logic (Placeholder - Remains the same) ---
function runSimulatedInference(data: SensorReading): SimulationResult {
  const { accel_x, accel_y, accel_z } = data;
  const threshold = 0.6;
  const dominanceFactor = 1.5;

  const absX = Math.abs(accel_x);
  const absY = Math.abs(accel_y);
  const absZ = Math.abs(accel_z);

  const cycles = Math.floor(Math.random() * 1500) + 500;
  const memory = Math.floor(Math.random() * 100) + 100;

  let recognizedGesture: Gesture = 'unknown';

  if (absY > absX * dominanceFactor && absY > absZ * dominanceFactor && absY > threshold) {
    recognizedGesture = accel_y > 0 ? 'up' : 'down';
  } else if (absX > absY * dominanceFactor && absX > absZ * dominanceFactor && absX > threshold) {
     recognizedGesture = accel_x > 0 ? 'right' : 'left';
  } else if (absX < threshold * 0.5 && absY < threshold * 0.5 && absZ < threshold * 0.5) {
     recognizedGesture = 'unknown';
  } else if (absX < threshold && absY < threshold && absZ < threshold) {
      recognizedGesture = 'unknown';
  }

  return { recognizedGesture, executionCycles: cycles, memoryUsage: memory };
}

// Example ARM Assembly (Conceptual - Remains the same)
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

// Generate sensor data based on selected type (Remains the same)
type GestureGenerationType = 'random' | Gesture;

function generateSensorData(type: GestureGenerationType): SensorReading {
  let x = (Math.random() - 0.5) * 0.3;
  let y = (Math.random() - 0.5) * 0.3;
  let z = (Math.random() - 0.5) * 0.3;
  const magnitude = 0.8 + Math.random() * 0.5;

  switch (type) {
    case 'up':
      y = magnitude; x *= 0.3; z *= 0.3; break;
    case 'down':
      y = -magnitude; x *= 0.3; z *= 0.3; break;
    case 'left':
      x = -magnitude; y *= 0.3; z *= 0.3; break;
    case 'right':
      x = magnitude; y *= 0.3; z *= 0.3; break;
    case 'unknown':
       x = (Math.random() - 0.5) * 0.4;
       y = (Math.random() - 0.5) * 0.4;
       z = (Math.random() - 0.5) * 0.4; break;
    case 'random':
    default:
       const gestureType = Math.random();
       if (gestureType < 0.2) { y = magnitude; x *= 0.4; z *= 0.4; }
       else if (gestureType < 0.4) { y = -magnitude; x *= 0.4; z *= 0.4; }
       else if (gestureType < 0.6) { x = magnitude; y *= 0.4; z *= 0.4; }
       else if (gestureType < 0.8) { x = -magnitude; y *= 0.4; z *= 0.4; }
      break;
  }

  return {
    accel_x: parseFloat(x.toFixed(3)),
    accel_y: parseFloat(y.toFixed(3)),
    accel_z: parseFloat(z.toFixed(3)),
  };
}

// Use a non-random default state for initial render to avoid hydration mismatch
const defaultSensorReading: SensorReading = { accel_x: 0.123, accel_y: -0.456, accel_z: 0.789 };

export default function Home() {
  const [inputData, setInputData] = useState<SensorReading>(defaultSensorReading);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generationType, setGenerationType] = useState<GestureGenerationType>('random');


  const handleRunSimulation = useCallback(() => {
    setIsLoading(true);
    setSimulationResult(null);

    const newData = generateSensorData(generationType);
    setInputData(newData);

    // Simulate async operation
    setTimeout(() => {
      const result = runSimulatedInference(newData);
      setSimulationResult(result);
      setIsLoading(false);
    }, 500); // Slightly increased delay
  }, [generationType]);


  return (
     // Added subtle background pattern
    <div className="relative min-h-screen bg-gradient-to-br from-background via-secondary/50 to-background">
       {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pattern-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%3E%3Cpath%20fill%3D%22%232c3e50%22%20fill-opacity%3D%220.1%22%20d%3D%22M0%200h20v20H0zM20%2020h20v20H20z%22%2F%3E%3C%2Fsvg%3E')]"></div>

      <div className="container mx-auto px-4 py-10 relative z-10 max-w-6xl"> {/* Increased max-width */}
        <header className="mb-10 text-center">
          <Activity className="mx-auto h-12 w-12 text-primary mb-3" /> {/* Added icon */}
          <h1 className="text-5xl font-extrabold text-primary mb-3 tracking-tight">GestureSim</h1> {/* Bolder, larger heading */}
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Visualize Edge AI: Simulate gesture recognition using ARM Assembly logic on virtual sensor data.
          </p>
          <a href="https://github.com/FirebaseExtended/studio-examples/tree/main/gesture-sim" target="_blank" rel="noopener noreferrer" className="inline-flex items-center mt-4 text-sm text-accent hover:text-accent/80 transition-colors">
            <Github className="w-4 h-4 mr-1.5" /> View Source on GitHub
          </a>
        </header>

        <main className="space-y-10"> {/* Increased spacing */}
          <Card className="shadow-lg backdrop-blur-sm bg-card/90 border border-border/50"> {/* Enhanced card style */}
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                 <Cpu className="w-6 h-6 text-primary/80" /> Simulation Control
              </CardTitle>
              <CardDescription>Configure data generation and initiate the simulation.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row items-center justify-center gap-8 p-6"> {/* Increased gap, padding */}
              <div className="flex items-center gap-4"> {/* Increased gap */}
                <Label htmlFor="gesture-type-select" className="text-base font-medium shrink-0">Generate Data For:</Label>
                  <Select
                    value={generationType}
                    onValueChange={(value) => setGenerationType(value as GestureGenerationType)}
                    disabled={isLoading}
                  >
                    <SelectTrigger id="gesture-type-select" className="w-[200px] bg-background shadow-inner"> {/* Wider select, bg */}
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

              <Button
                onClick={handleRunSimulation}
                disabled={isLoading}
                size="lg"
                className="w-full sm:w-auto shadow-md hover:shadow-lg transition-shadow bg-accent hover:bg-accent/90 text-accent-foreground" // Use accent color
              >
                <Play className="w-5 h-5 mr-2 animate-pulse" /> {/* Added animation */}
                {isLoading ? 'Simulating...' : 'Run Simulation'}
              </Button>
            </CardContent>
          </Card>

          <Separator className="my-10 bg-border/50" />

          <SimulationOutput
            inputData={inputData}
            assemblyCode={exampleAssemblyCode}
            simulationResult={simulationResult}
            isLoading={isLoading}
          />
        </main>

        <footer className="mt-20 pt-8 border-t border-border/50 text-center text-sm text-muted-foreground"> {/* Increased margin */}
          <p>Conceptual simulation. Real ARM execution needs an emulator (QEMU, Keil) & toolchain.</p>
          <p>&copy; {new Date().getFullYear()} GestureSim. Built with Next.js, Shadcn/ui, and Tailwind CSS.</p>
        </footer>
      </div>
    </div>
  );
}
