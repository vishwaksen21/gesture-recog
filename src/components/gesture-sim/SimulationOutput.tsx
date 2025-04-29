
'use client';

import type React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { GestureIcon } from './GestureIcon';
import { Badge } from '@/components/ui/badge';
import type { SimulationResult, SensorReading } from '@/types/simulation';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '../ui/separator';
import { Cpu, MemoryStick, Box, Code2, Sparkles } from 'lucide-react'; // Added icons

interface SimulationOutputProps {
  inputData: SensorReading;
  assemblyCode: string;
  simulationResult: SimulationResult | null;
  isLoading: boolean;
}

const formatAxis = (value: number | undefined): string => {
  if (value === undefined || value === null) {
    return 'N/A'; // Handle potential null/undefined
  }
  // Add sign explicitly for clarity
  return `${value >= 0 ? '+' : ''}${value.toFixed(3)}`;
};

export const SimulationOutput: React.FC<SimulationOutputProps> = ({
  inputData,
  assemblyCode,
  simulationResult,
  isLoading,
}) => {

  const renderInputData = () => (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center p-5 bg-secondary/70 rounded-lg shadow-inner backdrop-blur-sm border border-border/30">
      {/* Added outer border and shadow */}
      {(['x', 'y', 'z'] as const).map((axis) => (
          <div key={axis} className="p-3 bg-background/50 rounded-md border border-border/20 shadow-sm">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{axis.toUpperCase()}-Axis</p>
            <p className={`font-mono text-2xl font-semibold ${inputData?.[`accel_${axis}`] >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {formatAxis(inputData?.[`accel_${axis}`])} g
            </p>
          </div>
      ))}
    </div>
  );

  const renderLoadingSkeletons = () => (
     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start animate-pulse"> {/* Animate pulse for loading */}
        {/* Left Column Skeletons */}
        <div className="space-y-8">
            <Card className="shadow-md bg-card/80 backdrop-blur-sm">
                <CardHeader>
                     <Skeleton className="h-7 w-3/5 mb-2" />
                     <Skeleton className="h-4 w-4/5" />
                </CardHeader>
                <CardContent>
                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 bg-secondary/70 rounded-lg">
                         {[...Array(3)].map((_, i) => (
                            <div key={i} className="p-3 bg-background/50 rounded-md">
                                <Skeleton className="h-3 w-1/3 mx-auto mb-2" />
                                <Skeleton className="h-7 w-3/4 mx-auto" />
                            </div>
                         ))}
                     </div>
                </CardContent>
            </Card>

            <Card className="shadow-md bg-card/80 backdrop-blur-sm">
                <CardHeader>
                     <Skeleton className="h-7 w-2/5 mb-2" />
                     <Skeleton className="h-4 w-3/4" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-60 w-full rounded-md bg-muted" />
                </CardContent>
             </Card>
        </div>

        {/* Right Column Skeleton */}
        <Card className="bg-card/80 backdrop-blur-sm shadow-lg sticky top-8">
            <CardHeader>
                <Skeleton className="h-7 w-1/2 mb-2" />
                <Skeleton className="h-4 w-2/3" />
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center min-h-[300px] p-6 space-y-4">
                 <Skeleton className="h-24 w-24 rounded-full bg-secondary" />
                 <Skeleton className="h-5 w-1/4" />
                 <Skeleton className="h-10 w-1/2" />
                 <Skeleton className="h-px w-3/4 bg-border" />
                 <div className="flex gap-4">
                    <Skeleton className="h-8 w-24 rounded-full" />
                    <Skeleton className="h-8 w-28 rounded-full" />
                 </div>
            </CardContent>
        </Card>
    </div>
  );


  if (isLoading) {
    return renderLoadingSkeletons();
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      {/* Left Column: Input & Assembly */}
      <div className="space-y-8">
          {/* Input Data Section */}
          <Card className="shadow-md transition-shadow hover:shadow-lg bg-card/80 backdrop-blur-sm border border-border/50">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Box className="w-5 h-5 text-primary/80"/> Simulated Sensor Input
              </CardTitle>
              <CardDescription>Generated 3-axis accelerometer data.</CardDescription>
            </CardHeader>
            <CardContent>
              {renderInputData()}
            </CardContent>
          </Card>

          {/* Assembly Code Section */}
           <Card className="shadow-md transition-shadow hover:shadow-lg bg-card/80 backdrop-blur-sm border border-border/50">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                 <Code2 className="w-5 h-5 text-primary/80"/> ARM Assembly Logic (Conceptual)
              </CardTitle>
              <CardDescription>Representation of the low-level inference code.</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted/90 p-4 rounded-lg overflow-x-auto text-xs max-h-96 shadow-inner border border-border/30"> {/* Added border */}
                <code>{assemblyCode}</code>
              </pre>
            </CardContent>
          </Card>
      </div>

      {/* Right Column: Simulation Result */}
       <Card className="bg-gradient-to-br from-card/90 to-secondary/80 backdrop-blur-sm shadow-xl transition-shadow hover:shadow-2xl sticky top-8 border border-border/50"> {/* Enhanced gradient, shadow, sticky */}
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-accent" /> Simulation Results
          </CardTitle>
          <CardDescription>Output from the virtual microcontroller execution.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center min-h-[300px] p-8 space-y-6"> {/* Increased padding and spacing */}
          {simulationResult ? (
            <div className="flex flex-col items-center text-center space-y-6 w-full">
              {/* Gesture Icon and Label */}
              <div className="flex flex-col items-center space-y-3">
                  <div className="p-6 bg-background rounded-full shadow-lg border-2 border-accent/50 transform hover:scale-105 transition-transform">
                     <GestureIcon gesture={simulationResult.recognizedGesture} className="w-24 h-24 text-accent" /> {/* Even larger icon */}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground uppercase tracking-wider font-medium">Recognized Gesture</p>
                    <p className="text-5xl font-bold capitalize text-accent mt-1 animate-fade-in"> {/* Larger text, animation */}
                      {simulationResult.recognizedGesture}
                    </p>
                  </div>
              </div>

              <Separator className="w-3/4 my-5 bg-border/60" /> {/* Thicker separator */}

              {/* Metrics */}
              <div className="flex flex-wrap justify-center items-center gap-5 pt-2">
                   {simulationResult.executionCycles !== undefined && (
                     <Badge variant="secondary" className="text-base px-4 py-2 shadow-md border border-border/30 transform hover:-translate-y-1 transition-transform"> {/* Larger badge */}
                       <Cpu className="w-5 h-5 mr-2 text-primary/90" />
                       <span className="font-semibold">Cycles:</span> &nbsp; ~{simulationResult.executionCycles.toLocaleString()}
                     </Badge>
                   )}
                   {simulationResult.memoryUsage !== undefined && (
                      <Badge variant="secondary" className="text-base px-4 py-2 shadow-md border border-border/30 transform hover:-translate-y-1 transition-transform">
                         <MemoryStick className="w-5 h-5 mr-2 text-primary/90" />
                        <span className="font-semibold">Memory:</span> &nbsp; ~{simulationResult.memoryUsage} Bytes
                      </Badge>
                   )}
                </div>
            </div>
          ) : (
             <div className="text-center text-muted-foreground py-16 space-y-3">
                <Cpu className="w-12 h-12 mx-auto text-primary/50 animate-bounce" />
                <p className="text-xl">
                    Click <span className="font-semibold text-accent">"Run Simulation"</span> to start.
                </p>
                <p className="text-sm">Generate data and see the inference results here.</p>
             </div>
          )}
        </CardContent>
      </Card>

    </div>
  );
};

// Add a simple fade-in animation
const styles = `
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fade-in 0.5s ease-out forwards;
  }
`;
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
}
