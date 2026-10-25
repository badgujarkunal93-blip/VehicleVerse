import React, { useState } from 'react';
import { VehicleType } from '../../types/vehicle';
import { ArrowDown, CheckCircle2, RefreshCw, Cpu } from 'lucide-react';

interface ExecutionFlowProps {
  currentVehicle: VehicleType;
}

export const ExecutionFlow: React.FC<ExecutionFlowProps> = ({ currentVehicle }) => {
  const [activeStep, setActiveStep] = useState<number>(3); // Default on constructor/initialization

  const steps = [
    {
      id: 1,
      name: 'Program Start',
      type: 'terminal',
      codeSnippet: 'int main() { ... }',
      description: 'Program execution begins in main(). Memory is allocated on stack or heap for vehicle instances.'
    },
    {
      id: 2,
      name: 'Select Vehicle Class',
      type: 'input',
      codeSnippet: currentVehicle === 'ElectricCar' 
        ? 'ElectricCar tesla(0.0, 90.0);' 
        : currentVehicle === 'Car' 
        ? 'Car sedan(0.0, 80.0);' 
        : 'Vehicle rover(0.0, 120.0);',
      description: `Targeting class: ${currentVehicle}. The C++ runtime prepares to invoke the constructor hierarchy chain.`
    },
    {
      id: 3,
      name: 'Constructor Execution Chain',
      type: 'process',
      codeSnippet: currentVehicle === 'ElectricCar'
        ? '1. Vehicle() -> 2. Car() -> 3. ElectricCar()'
        : currentVehicle === 'Car'
        ? '1. Vehicle() -> 2. Car()'
        : '1. Vehicle()',
      description: 'Top-down initialization: Base class constructors MUST finish executing before derived constructors execute!'
    },
    {
      id: 4,
      name: 'Member Initialization List',
      type: 'process',
      codeSnippet: currentVehicle === 'ElectricCar'
        ? ': Car(spd, 0.0), batteryLevel(batt)'
        : currentVehicle === 'Car'
        ? ': Vehicle(spd), fuelLevel(fuel)'
        : ': speed(0.0), isRunning(false)',
      description: 'C++ member initializer list delegates arguments up to the direct base class constructor.'
    },
    {
      id: 5,
      name: 'Dispatch Member Operation',
      type: 'decision',
      codeSnippet: 'obj.accelerate() / obj.brake()',
      description: 'Virtual member function lookup: Calls the derived implementation or base class method.'
    },
    {
      id: 6,
      name: 'State Mutation',
      type: 'process',
      codeSnippet: currentVehicle === 'ElectricCar'
        ? 'speed += 22; batteryLevel -= 2.0;'
        : currentVehicle === 'Car'
        ? 'speed += 18; fuelLevel -= 2.5;'
        : 'speed += 15;',
      description: 'Speed changes and energy stores (fuel/battery) deplete proportionally based on inheritance logic.'
    },
    {
      id: 7,
      name: 'Display State & Telemetry',
      type: 'input',
      codeSnippet: 'obj.displayInfo(); // Polymorphic display',
      description: 'Outputs state from all levels: speed (from Vehicle), drivetrain (from Car), and battery (from ElectricCar).'
    },
    {
      id: 8,
      name: 'Destruction / Scope Exit',
      type: 'terminal',
      codeSnippet: currentVehicle === 'ElectricCar'
        ? '1. ~ElectricCar() -> 2. ~Car() -> 3. ~Vehicle()'
        : currentVehicle === 'Car'
        ? '1. ~Car() -> 2. ~Vehicle()'
        : '1. ~Vehicle()',
      description: 'Destructor Execution Order: Objects are destroyed in strict REVERSE order of construction!'
    }
  ];

  return (
    <div className="bg-graphite-900 border border-slate-800 rounded-lg p-4 shadow-xl flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan" />
            C++ Runtime Execution & Constructor Order Flow
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Step-by-step lifecycle flow demonstrating base-to-derived construction and reverse destruction.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-graphite-800 border border-slate-700 text-cyan">
            Active: {currentVehicle}
          </span>
        </div>
      </div>

      {/* Constructor & Destructor Order Highlight Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-graphite-950/70 p-3 rounded-lg border border-slate-800">
        <div className="p-2.5 rounded bg-graphite-900/80 border border-emerald-500/30">
          <div className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5 mb-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> 1. Construction Order (Base → Derived)
          </div>
          <div className="font-mono text-[11px] text-slate-300 space-y-1">
            <div className="p-1 rounded bg-slate-900/90 border border-slate-800 flex items-center justify-between">
              <span>1st: Vehicle()</span>
              <span className="text-[10px] text-cyan">Base executes first</span>
            </div>
            {currentVehicle !== 'Vehicle' && (
              <div className="p-1 rounded bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                <span>2nd: Car()</span>
                <span className="text-[10px] text-fuel">Derived executes second</span>
              </div>
            )}
            {currentVehicle === 'ElectricCar' && (
              <div className="p-1 rounded bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                <span>3rd: ElectricCar()</span>
                <span className="text-[10px] text-purple-400">Most-derived executes last</span>
              </div>
            )}
          </div>
        </div>

        <div className="p-2.5 rounded bg-graphite-900/80 border border-rose-500/30">
          <div className="text-xs font-mono font-bold text-rose-400 flex items-center gap-1.5 mb-1.5">
            <RefreshCw className="w-3.5 h-3.5" /> 2. Destruction Order (Reverse: Derived → Base)
          </div>
          <div className="font-mono text-[11px] text-slate-300 space-y-1">
            {currentVehicle === 'ElectricCar' && (
              <div className="p-1 rounded bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                <span>1st: ~ElectricCar()</span>
                <span className="text-[10px] text-purple-400">Released first</span>
              </div>
            )}
            {currentVehicle !== 'Vehicle' && (
              <div className="p-1 rounded bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                <span>2nd: ~Car()</span>
                <span className="text-[10px] text-fuel">Released second</span>
              </div>
            )}
            <div className="p-1 rounded bg-slate-900/90 border border-slate-800 flex items-center justify-between">
              <span>Last: ~Vehicle()</span>
              <span className="text-[10px] text-cyan">Base destructor cleans up last</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Flowchart Nodes */}
      <div className="space-y-2 py-2">
        {steps.map((step, idx) => {
          const isActive = activeStep === step.id;
          return (
            <div key={step.id} className="flex flex-col items-center">
              <div
                onClick={() => setActiveStep(step.id)}
                className={`w-full max-w-xl p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                  isActive
                    ? 'bg-graphite-850 border-cyan ring-1 ring-cyan/40 shadow-[0_0_15px_rgba(0,242,254,0.15)]'
                    : 'bg-graphite-950/60 border-slate-800 hover:border-slate-700 hover:bg-graphite-900/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <span
                      className={`w-6 h-6 rounded-full font-mono text-xs flex items-center justify-center font-bold ${
                        isActive ? 'bg-cyan text-graphite-950' : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {step.id}
                    </span>
                    <span className="font-semibold text-sm text-slate-100 font-mono">
                      {step.name}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800/80 text-slate-400">
                    {step.type}
                  </span>
                </div>

                <div className="mt-2 text-xs text-slate-400 pl-8 leading-relaxed">
                  {step.description}
                </div>

                <div className="mt-2 ml-8 p-1.5 rounded bg-graphite-900 border border-slate-800 font-mono text-[11px] text-cyan overflow-x-auto">
                  {step.codeSnippet}
                </div>
              </div>

              {/* Arrow Connector between steps */}
              {idx < steps.length - 1 && (
                <div className="my-1 text-slate-600">
                  <ArrowDown className="w-4 h-4 text-slate-600" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
