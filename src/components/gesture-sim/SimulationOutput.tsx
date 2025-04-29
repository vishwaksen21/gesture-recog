
'use client';

import type React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { GestureIcon } from './GestureIcon';
import { Badge } from '@/components/ui/badge';
import type { SimulationResult, SensorReading } from '@/types/simulation';
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton
import { Separator } from '../ui/separator';
import { Cpu, MemoryStick } from 'lucide-react'; // Import icons for metrics

interface SimulationOutputProps {
  inputData: SensorReading;
  assemblyCode: string;
  simulationResult: SimulationResult | null;
  isLoading: boolean;
}

// Helper to format numbers consistently
const formatAxis = (value: number | undefined): string => {
  if (value === undefined || value === null) {
    return '0.000';
  }
  return value.toFixed(3);
};


export const SimulationOutput: React.FC<SimulationOutputProps> = ({
  inputData,
  assemblyCode,
  simulationResult,
  isLoading,
}) => {

  const renderInputData = () => (
    <div className="grid grid-cols-3 gap-4 text-center p-4 bg-secondary/50 rounded-md">
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">X-Axis</p>
        <p className="font-mono text-xl font-medium">{formatAxis(inputData?.accel_x)} g</p>
      </div>
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Y-Axis</p>
        <p className="font-mono text-xl font-medium">{formatAxis(inputData?.accel_y)} g</p>
      </div>
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Z-Axis</p>
        <p className="font-mono text-xl font-medium">{formatAxis(inputData?.accel_z)} g</p>
      </div>
    </div>
  );

  const renderLoadingSkeletons = () => (
     <div className="space-y-6">
        {/* Input Data Skeleton */}
        <Card className="shadow-sm transition-shadow hover:shadow-md">
            <CardHeader>
                 <Skeleton className="h-6 w-1/2" />
                 <Skeleton className="h-4 w-3/4 mt-1" />
            </CardHeader>
            <CardContent>
                 <div className="grid grid-cols-3 gap-4 text-center p-4 bg-secondary/50 rounded-md">
                     {[...Array(3)].map((_, i) => (
                        <div key={i}>
                            <Skeleton className="h-3 w-1/2 mx-auto mb-2" />
                            <Skeleton className="h-6 w-3/4 mx-auto" />
                        </div>
                     ))}
                 </div>
            </CardContent>
        </Card>

        {/* Assembly Code Skeleton */}
         <Card className="shadow-sm transition-shadow hover:shadow-md">
            <CardHeader>
                 <Skeleton className="h-6 w-3/5" />
                 <Skeleton className="h-4 w-5/6 mt-1" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-40 w-full rounded-md" />
            </CardContent>
         </Card>

        {/* Simulation Result Skeleton */}
        <Card className="bg-card shadow-sm transition-shadow hover:shadow-md">
            <CardHeader>
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-1/2 mt-1" />
            </CardHeader>
            <CardContent>
                 <div className="flex items-center justify-center py-10">
                     <svg className="animate-spin h-10 w-10 text-primary mr-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                     </svg>
                    <p className="text-lg text-muted-foreground">Processing Simulation...</p>
                </div>
            </CardContent>
        </Card>
    </div>
  );


  if (isLoading) {
    return renderLoadingSkeletons();
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start"> {/* Use grid for layout */}

       {/* Left Column: Input & Assembly */}
      <div className="space-y-8">
          {/* Input Data Section */}
          <Card className="shadow-sm transition-shadow hover:shadow-md">
            <CardHeader>
              <CardTitle>Simulated Sensor Input</CardTitle>
              <CardDescription>Generated 3-axis accelerometer readings.</CardDescription>
            </CardHeader>
            <CardContent>
              {renderInputData()}
            </CardContent>
          </Card>

          {/* Assembly Code Section */}
           <Card className="shadow-sm transition-shadow hover:shadow-md">
            <CardHeader>
              <CardTitle>ARM Assembly Logic (Conceptual)</CardTitle>
              <CardDescription>Simplified inference code representation.</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs max-h-96"> {/* Constrain height */}
                <code>{assemblyCode}</code>
              </pre>
            </CardContent>
          </Card>
      </div>


      {/* Right Column: Simulation Result */}
       <Card className="bg-gradient-to-br from-secondary to-background shadow-md transition-shadow hover:shadow-lg sticky top-8"> {/* Added gradient and sticky */}
        <CardHeader>
          <CardTitle>Simulation Results</CardTitle>
          <CardDescription>Output from the virtual execution.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center min-h-[200px] p-6">
          {simulationResult ? (
            <div className="flex flex-col items-center text-center space-y-5 w-full"> {/* Increased spacing */}
              <div className="flex-shrink-0 p-5 bg-background rounded-full shadow-lg border border-accent/30"> {/* Enhanced styling */}
                 <GestureIcon gesture={simulationResult.recognizedGesture} className="w-20 h-20 text-accent" /> {/* Larger icon */}
              </div>
              <div>
                <p className="text-sm text-muted-foreground uppercase tracking-wider">Recognized Gesture</p>
                <p className="text-4xl font-bold capitalize text-accent mt-1"> {/* Larger text */}
                  {simulationResult.recognizedGesture}
                </p>
              </div>

              <Separator className="w-3/4 my-4" /> {/* Added separator */}

              <div className="flex flex-wrap justify-center gap-4 pt-2">
                   {simulationResult.executionCycles !== undefined && (
                     <Badge variant="outline" className="text-sm px-3 py-1 shadow-sm border-primary/30"> {/* More padding, subtle border */}
                       <Cpu className="w-4 h-4 mr-1.5 text-primary/80" />
                       Cycles: ~{simulationResult.executionCycles.toLocaleString()} {/* Format number */}
                     </Badge>
                   )}
                   {simulationResult.memoryUsage !== undefined && (
                      <Badge variant="outline" className="text-sm px-3 py-1 shadow-sm border-primary/30">
                         <MemoryStick className="w-4 h-4 mr-1.5 text-primary/80" />
                        Memory: ~{simulationResult.memoryUsage} Bytes
                      </Badge>
                   )}
                </div>
            </div>
          ) : (
             <p className="text-center text-muted-foreground py-10 text-lg">
               Click "Run Simulation" to generate data and see results.
             </p>
          )}
        </CardContent>
      </Card>

    </div>
  );
};
