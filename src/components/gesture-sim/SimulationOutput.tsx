'use client';

import type React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { GestureIcon } from './GestureIcon';
import { Badge } from '@/components/ui/badge';

// Define the structure for simulated sensor data
interface SensorReading {
  accel_x: number;
  accel_y: number;
  accel_z: number;
}

// Define the structure for the simulation result
interface SimulationResult {
  recognizedGesture: 'up' | 'down' | 'left' | 'right' | 'unknown';
  executionCycles?: number; // Optional metrics
  memoryUsage?: number; // Optional metrics (e.g., in bytes)
}

interface SimulationOutputProps {
  inputData: SensorReading;
  assemblyCode: string;
  simulationResult: SimulationResult | null; // Can be null initially
  isLoading: boolean;
}

export const SimulationOutput: React.FC<SimulationOutputProps> = ({
  inputData,
  assemblyCode,
  simulationResult,
  isLoading,
}) => {
  return (
    <div className="space-y-6">
      {/* Input Data Section */}
      <Card>
        <CardHeader>
          <CardTitle>Simulated Sensor Input</CardTitle>
          <CardDescription>3-axis accelerometer readings.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-muted-foreground">X-Axis</p>
              <p className="font-mono text-lg">{inputData.accel_x.toFixed(3)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Y-Axis</p>
              <p className="font-mono text-lg">{inputData.accel_y.toFixed(3)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Z-Axis</p>
              <p className="font-mono text-lg">{inputData.accel_z.toFixed(3)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assembly Code Section */}
      <Card>
        <CardHeader>
          <CardTitle>ARM Assembly Inference Logic</CardTitle>
           <CardDescription>Simplified representation of the inference code.</CardDescription>
        </CardHeader>
        <CardContent>
          <pre><code>{assemblyCode}</code></pre>
        </CardContent>
      </Card>

      {/* Simulation Result Section */}
      <Card className="bg-secondary">
        <CardHeader>
          <CardTitle>Simulation Results</CardTitle>
          <CardDescription>Output from the virtual ARM Cortex-M execution.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="ml-3 text-muted-foreground">Running simulation...</p>
            </div>
          ) : simulationResult ? (
            <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-8">
              <div className="flex-shrink-0 p-4 bg-background rounded-full shadow-inner">
                 <GestureIcon gesture={simulationResult.recognizedGesture} className="w-16 h-16 text-accent" />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-sm text-muted-foreground">Recognized Gesture</p>
                <p className="text-3xl font-semibold capitalize text-accent">
                  {simulationResult.recognizedGesture}
                </p>
                <div className="mt-3 space-x-2">
                   {simulationResult.executionCycles !== undefined && (
                     <Badge variant="outline">Cycles: {simulationResult.executionCycles}</Badge>
                   )}
                   {simulationResult.memoryUsage !== undefined && (
                      <Badge variant="outline">Memory: {simulationResult.memoryUsage} B</Badge>
                   )}
                </div>
              </div>
            </div>
          ) : (
             <p className="text-center text-muted-foreground py-8">Click "Run Simulation" to see the results.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
