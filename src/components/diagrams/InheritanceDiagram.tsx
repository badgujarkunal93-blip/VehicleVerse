import React, { useState } from 'react';
import { VehicleType } from '../../types/vehicle';
import { Layers, Info, CheckCircle2 } from 'lucide-react';

interface InheritanceDiagramProps {
  currentVehicle: VehicleType;
  onSelectVehicle: (type: VehicleType) => void;
}

export const InheritanceDiagram: React.FC<InheritanceDiagramProps> = ({
  currentVehicle,
  onSelectVehicle
}) => {
  const [hoveredEdge, setHoveredEdge] = useState<string | null>(null);

  return (
    <div className="bg-graphite-900 border border-slate-800 rounded-lg p-4 shadow-xl flex flex-col gap-6">
      {/* Title & Legend Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan" />
            UML Class Inheritance Map
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Interactive object-oriented architecture showing Single & Multilevel public inheritance.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-3 text-[11px] font-mono">
          <span className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-sm bg-cyan/20 border border-cyan inline-block" />
            Newly Introduced
          </span>
          <span className="flex items-center gap-1.5 text-slate-400">
            <span className="w-2.5 h-2.5 rounded-sm bg-slate-800 border border-slate-600 inline-block" />
            Inherited
          </span>
          <span className="flex items-center gap-1.5 text-purple-400">
            <span className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[8px] border-b-purple-400 inline-block" />
            UML Generalization
          </span>
        </div>
      </div>

      {/* UML Hierarchy Layout */}
      <div className="flex flex-col items-center justify-center py-2 relative">
        {/* ========================================================= */}
        {/* 1. BASE CLASS: Vehicle */}
        {/* ========================================================= */}
        <div
          onClick={() => onSelectVehicle('Vehicle')}
          className={`w-full max-w-md rounded-lg border-2 transition-all duration-200 cursor-pointer overflow-hidden shadow-lg ${
            currentVehicle === 'Vehicle'
              ? 'border-cyan bg-graphite-850 ring-2 ring-cyan/40 shadow-[0_0_20px_rgba(0,242,254,0.15)]'
              : 'border-slate-700 bg-graphite-900/90 hover:border-slate-600 hover:bg-graphite-850/60'
          }`}
        >
          {/* Compartment 1: Class Name & Type */}
          <div className="bg-graphite-950 px-3 py-2 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-cyan/10 border border-cyan/40 text-cyan font-bold">
                «Base Class»
              </span>
              <span className="text-sm font-bold font-mono text-slate-100">Vehicle</span>
            </div>
            {currentVehicle === 'Vehicle' && (
              <span className="text-[10px] text-cyan font-mono flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Selected
              </span>
            )}
          </div>

          {/* Compartment 2: Data Members */}
          <div className="p-2.5 border-b border-slate-800/80 font-mono text-xs space-y-1 bg-graphite-900/40">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 font-semibold">Attributes (Protected)</div>
            <div className="flex items-center justify-between text-cyan font-medium">
              <span># speed : double</span>
              <span className="text-[10px] text-cyan/70 bg-cyan/10 px-1 rounded">Introduced</span>
            </div>
            <div className="flex items-center justify-between text-cyan font-medium">
              <span># isRunning : bool</span>
              <span className="text-[10px] text-cyan/70 bg-cyan/10 px-1 rounded">Introduced</span>
            </div>
            <div className="flex items-center justify-between text-cyan font-medium">
              <span># maxSpeed : double</span>
              <span className="text-[10px] text-cyan/70 bg-cyan/10 px-1 rounded">Introduced</span>
            </div>
          </div>

          {/* Compartment 3: Member Functions */}
          <div className="p-2.5 font-mono text-xs space-y-1 bg-graphite-900/20">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 font-semibold">Operations (Public)</div>
            <div className="text-slate-300">+ Vehicle(initialSpeed, maxSpeed)</div>
            <div className="text-slate-300">+ virtual ~Vehicle()</div>
            <div className="text-slate-300">+ virtual void startEngine()</div>
            <div className="text-slate-300">+ virtual void stopEngine()</div>
            <div className="text-slate-300">+ virtual void accelerate(delta)</div>
            <div className="text-slate-300">+ virtual void brake(delta)</div>
            <div className="text-slate-300">+ virtual void displayInfo() const</div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* UML INHERITANCE CONNECTOR 1: Vehicle -> Car */}
        {/* ========================================================= */}
        <div
          onMouseEnter={() => setHoveredEdge('single')}
          onMouseLeave={() => setHoveredEdge(null)}
          className="my-3 flex flex-col items-center justify-center cursor-pointer group"
        >
          {/* UML Hollow Triangle pointing UP to base */}
          <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[14px] border-b-slate-300 group-hover:border-b-cyan transition-colors" />
          <div className="w-0.5 h-6 bg-slate-500 group-hover:bg-cyan transition-colors" />
          <div className="px-2.5 py-0.5 rounded-full text-[10px] font-mono border border-purple-500/40 bg-purple-950/40 text-purple-300 shadow-sm mt-0.5">
            Single Inheritance (: public Vehicle)
          </div>
        </div>

        {/* ========================================================= */}
        {/* 2. DERIVED CLASS: Car */}
        {/* ========================================================= */}
        <div
          onClick={() => onSelectVehicle('Car')}
          className={`w-full max-w-md rounded-lg border-2 transition-all duration-200 cursor-pointer overflow-hidden shadow-lg ${
            currentVehicle === 'Car'
              ? 'border-fuel bg-graphite-850 ring-2 ring-fuel/40 shadow-[0_0_20px_rgba(255,138,0,0.15)]'
              : 'border-slate-700 bg-graphite-900/90 hover:border-slate-600 hover:bg-graphite-850/60'
          }`}
        >
          {/* Compartment 1: Class Name & Type */}
          <div className="bg-graphite-950 px-3 py-2 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-fuel/10 border border-fuel/40 text-fuel font-bold">
                «Derived Class»
              </span>
              <span className="text-sm font-bold font-mono text-slate-100">Car : public Vehicle</span>
            </div>
            {currentVehicle === 'Car' && (
              <span className="text-[10px] text-fuel font-mono flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Selected
              </span>
            )}
          </div>

          {/* Compartment 2: Data Members */}
          <div className="p-2.5 border-b border-slate-800/80 font-mono text-xs space-y-1 bg-graphite-900/40">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 font-semibold">Attributes</div>
            {/* Newly introduced */}
            <div className="flex items-center justify-between text-fuel font-medium">
              <span># fuelLevel : double</span>
              <span className="text-[10px] text-fuel/80 bg-fuel/10 px-1 rounded">Introduced in Car</span>
            </div>
            {/* Inherited from Vehicle */}
            <div className="flex items-center justify-between text-slate-400">
              <span className="line-through decoration-slate-600"># speed, isRunning, maxSpeed</span>
              <span className="text-[10px] text-slate-400 bg-slate-800 px-1 rounded">Inherited from Vehicle</span>
            </div>
          </div>

          {/* Compartment 3: Member Functions */}
          <div className="p-2.5 font-mono text-xs space-y-1 bg-graphite-900/20">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 font-semibold">Operations</div>
            <div className="text-fuel font-medium">+ refuel(amount : double) <span className="text-[10px] text-fuel/80 bg-fuel/10 px-1 rounded ml-1">New</span></div>
            <div className="text-cyan">+ accelerate(delta) <span className="text-[10px] text-cyan/80 bg-cyan/10 px-1 rounded ml-1">Override</span></div>
            <div className="text-cyan">+ displayInfo() const <span className="text-[10px] text-cyan/80 bg-cyan/10 px-1 rounded ml-1">Override</span></div>
            <div className="text-slate-400 text-[11px]">+ brake(), startEngine(), stopEngine() (Inherited)</div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* UML INHERITANCE CONNECTOR 2: Car -> ElectricCar */}
        {/* ========================================================= */}
        <div
          onMouseEnter={() => setHoveredEdge('multilevel')}
          onMouseLeave={() => setHoveredEdge(null)}
          className="my-3 flex flex-col items-center justify-center cursor-pointer group"
        >
          {/* UML Hollow Triangle pointing UP to Car */}
          <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[14px] border-b-slate-300 group-hover:border-b-purple-400 transition-colors" />
          <div className="w-0.5 h-6 bg-slate-500 group-hover:bg-purple-400 transition-colors" />
          <div className="px-2.5 py-0.5 rounded-full text-[10px] font-mono border border-purple-500/50 bg-purple-950/50 text-purple-300 shadow-sm mt-0.5">
            Multilevel Inheritance (: public Car)
          </div>
        </div>

        {/* ========================================================= */}
        {/* 3. MULTILEVEL DERIVED CLASS: ElectricCar */}
        {/* ========================================================= */}
        <div
          onClick={() => onSelectVehicle('ElectricCar')}
          className={`w-full max-w-md rounded-lg border-2 transition-all duration-200 cursor-pointer overflow-hidden shadow-lg ${
            currentVehicle === 'ElectricCar'
              ? 'border-purple-500 bg-graphite-850 ring-2 ring-purple-500/40 shadow-[0_0_20px_rgba(168,85,247,0.15)]'
              : 'border-slate-700 bg-graphite-900/90 hover:border-slate-600 hover:bg-graphite-850/60'
          }`}
        >
          {/* Compartment 1: Class Name & Type */}
          <div className="bg-graphite-950 px-3 py-2 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-purple-500/20 border border-purple-500/40 text-purple-300 font-bold">
                «Multilevel Derived»
              </span>
              <span className="text-sm font-bold font-mono text-slate-100">ElectricCar : public Car</span>
            </div>
            {currentVehicle === 'ElectricCar' && (
              <span className="text-[10px] text-purple-400 font-mono flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Selected
              </span>
            )}
          </div>

          {/* Compartment 2: Data Members */}
          <div className="p-2.5 border-b border-slate-800/80 font-mono text-xs space-y-1 bg-graphite-900/40">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 font-semibold">Attributes</div>
            {/* Newly introduced */}
            <div className="flex items-center justify-between text-emerald-400 font-medium">
              <span># batteryLevel : double</span>
              <span className="text-[10px] text-emerald-400/80 bg-emerald-950 px-1 rounded">Introduced in EV</span>
            </div>
            <div className="flex items-center justify-between text-emerald-400 font-medium">
              <span># regenerativeBraking : bool</span>
              <span className="text-[10px] text-emerald-400/80 bg-emerald-950 px-1 rounded">Introduced in EV</span>
            </div>
            {/* Inherited from 2 levels */}
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-slate-400"># fuelLevel (from Car)</span>
              <span className="text-[10px] text-slate-400 bg-slate-800 px-1 rounded">Level 2 Inherited</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-slate-400"># speed, maxSpeed (from Vehicle)</span>
              <span className="text-[10px] text-cyan/70 bg-cyan/10 px-1 rounded">Level 1 Inherited</span>
            </div>
          </div>

          {/* Compartment 3: Member Functions */}
          <div className="p-2.5 font-mono text-xs space-y-1 bg-graphite-900/20">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 font-semibold">Operations</div>
            <div className="text-emerald-400 font-medium">+ chargeBattery(amount) <span className="text-[10px] text-emerald-400/80 bg-emerald-950 px-1 rounded ml-1">New</span></div>
            <div className="text-purple-300">+ accelerate(delta) <span className="text-[10px] text-purple-400/80 bg-purple-950 px-1 rounded ml-1">Override</span></div>
            <div className="text-purple-300">+ brake(delta) [Regenerative] <span className="text-[10px] text-purple-400/80 bg-purple-950 px-1 rounded ml-1">Override</span></div>
            <div className="text-purple-300">+ displayInfo() const <span className="text-[10px] text-purple-400/80 bg-purple-950 px-1 rounded ml-1">Override</span></div>
          </div>
        </div>
      </div>

      {/* Interactive Explanation Callout */}
      <div className="p-3 rounded-lg bg-graphite-850/70 border border-slate-800 flex items-start space-x-3 text-xs">
        <Info className="w-4 h-4 text-cyan flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-semibold text-slate-200">
            {hoveredEdge === 'single'
              ? 'Single Inheritance Relationship: Vehicle → Car'
              : hoveredEdge === 'multilevel'
              ? 'Multilevel Inheritance Relationship: Vehicle → Car → ElectricCar'
              : 'Classroom Insight: Direct vs Inherited Member Scope'}
          </div>
          <p className="text-slate-400 leading-relaxed">
            {hoveredEdge === 'single'
              ? 'Car inherits all protected and public members of Vehicle. In C++, single inheritance occurs when a derived class is created from exactly one base class using "class Car : public Vehicle".'
              : hoveredEdge === 'multilevel'
              ? 'ElectricCar inherits from Car, which already inherits from Vehicle. This forms a chain of inheritance where ElectricCar transitively acquires all members of Vehicle and Car while adding its own EV-specific state.'
              : 'Click any class box above to instantly inspect its implementation in the C++ Code Explorer on the right and load it into the 3D simulation stage!'}
          </p>
        </div>
      </div>
    </div>
  );
};
