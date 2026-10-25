import React, { useState } from 'react';
import { VehicleType } from '../../types/vehicle';
import { ArrowDown, CheckCircle2, RefreshCw, GitCommit } from 'lucide-react';

interface ExecutionFlowProps {
  currentVehicle: VehicleType;
}

export const ExecutionFlow: React.FC<ExecutionFlowProps> = ({ currentVehicle }) => {
  const [activeStep, setActiveStep] = useState<number>(3);

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
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <GitCommit className="w-4 h-4 text-blue-600" />
            C++ Runtime Execution & Constructor Order Flow
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Step-by-step lifecycle flow demonstrating base-to-derived construction and reverse destruction.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-600">
            Active: {currentVehicle}
          </span>
        </div>
      </div>

      {/* Constructor & Destructor Order Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200">
          <div className="text-xs font-bold text-emerald-800 flex items-center gap-1.5 mb-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 1. Construction Order (Base → Derived)
          </div>
          <div className="font-mono text-xs space-y-1.5">
            <div className="p-2 rounded-lg bg-white border border-emerald-100 flex items-center justify-between shadow-2xl">
              <span className="font-semibold text-slate-800">1st: Vehicle()</span>
              <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">Base executes first</span>
            </div>
            {currentVehicle !== 'Vehicle' && (
              <div className="p-2 rounded-lg bg-white border border-emerald-100 flex items-center justify-between shadow-sm">
                <span className="font-semibold text-slate-800">2nd: Car()</span>
                <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">Derived executes second</span>
              </div>
            )}
            {currentVehicle === 'ElectricCar' && (
              <div className="p-2 rounded-lg bg-white border border-emerald-100 flex items-center justify-between shadow-sm">
                <span className="font-semibold text-slate-800">3rd: ElectricCar()</span>
                <span className="text-[10px] text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">Most-derived executes last</span>
              </div>
            )}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-200">
          <div className="text-xs font-bold text-rose-800 flex items-center gap-1.5 mb-2">
            <RefreshCw className="w-4 h-4 text-rose-600" /> 2. Destruction Order (Reverse: Derived → Base)
          </div>
          <div className="font-mono text-xs space-y-1.5">
            {currentVehicle === 'ElectricCar' && (
              <div className="p-2 rounded-lg bg-white border border-rose-100 flex items-center justify-between shadow-sm">
                <span className="font-semibold text-slate-800">1st: ~ElectricCar()</span>
                <span className="text-[10px] text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">Released first</span>
              </div>
            )}
            {currentVehicle !== 'Vehicle' && (
              <div className="p-2 rounded-lg bg-white border border-rose-100 flex items-center justify-between shadow-sm">
                <span className="font-semibold text-slate-800">2nd: ~Car()</span>
                <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">Released second</span>
              </div>
            )}
            <div className="p-2 rounded-lg bg-white border border-rose-100 flex items-center justify-between shadow-sm">
              <span className="font-semibold text-slate-800">Last: ~Vehicle()</span>
              <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">Base cleans up last</span>
            </div>
          </div>
        </div>
      </div>

      {/* Flowchart Steps */}
      <div className="space-y-2 py-2">
        {steps.map((step, idx) => {
          const isActive = activeStep === step.id;
          return (
            <div key={step.id} className="flex flex-col items-center">
              <div
                onClick={() => setActiveStep(step.id)}
                className={`w-full max-w-xl p-3.5 rounded-xl border cursor-pointer transition-all duration-150 ${
                  isActive
                    ? 'bg-blue-50/40 border-blue-500 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <span
                      className={`w-6 h-6 rounded-full font-mono text-xs flex items-center justify-center font-bold ${
                        isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {step.id}
                    </span>
                    <span className="font-bold text-sm text-slate-900 font-sans">
                      {step.name}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    {step.type}
                  </span>
                </div>

                <div className="mt-1.5 text-xs text-slate-600 pl-8 leading-relaxed font-sans">
                  {step.description}
                </div>

                <div className="mt-2 ml-8 p-2 rounded-lg bg-slate-50 border border-slate-200 font-mono text-xs text-blue-700 overflow-x-auto">
                  {step.codeSnippet}
                </div>
              </div>

              {idx < steps.length - 1 && (
                <div className="my-1 text-slate-300">
                  <ArrowDown className="w-4 h-4 text-slate-400" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
