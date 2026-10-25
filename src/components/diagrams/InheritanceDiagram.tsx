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
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col gap-5">
      {/* Title & Legend Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            UML Class Inheritance Map
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Interactive object-oriented architecture showing Single & Multilevel public inheritance.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-3 text-xs">
          <span className="flex items-center gap-1.5 text-slate-600">
            <span className="w-2.5 h-2.5 rounded-sm bg-blue-100 border border-blue-500 inline-block" />
            Newly Introduced
          </span>
          <span className="flex items-center gap-1.5 text-slate-500">
            <span className="w-2.5 h-2.5 rounded-sm bg-slate-100 border border-slate-300 inline-block" />
            Inherited
          </span>
          <span className="flex items-center gap-1.5 text-slate-600">
            <span className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[8px] border-b-slate-600 inline-block" />
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
          className={`w-full max-w-md rounded-xl border transition-all duration-150 cursor-pointer overflow-hidden shadow-sm ${
            currentVehicle === 'Vehicle'
              ? 'border-blue-600 ring-2 ring-blue-500/20 bg-white'
              : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow'
          }`}
        >
          {/* Compartment 1: Class Name & Type */}
          <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-600 font-bold">
                «Base Class»
              </span>
              <span className="text-sm font-bold text-slate-900 font-mono">Vehicle</span>
            </div>
            {currentVehicle === 'Vehicle' && (
              <span className="text-xs text-blue-600 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Selected
              </span>
            )}
          </div>

          {/* Compartment 2: Data Members */}
          <div className="p-3 border-b border-slate-100 font-mono text-xs space-y-1.5 bg-white">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Attributes (Protected)</div>
            <div className="flex items-center justify-between text-blue-600 font-medium">
              <span># speed : double</span>
              <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.2 rounded border border-blue-100">Introduced</span>
            </div>
            <div className="flex items-center justify-between text-blue-600 font-medium">
              <span># isRunning : bool</span>
              <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.2 rounded border border-blue-100">Introduced</span>
            </div>
            <div className="flex items-center justify-between text-blue-600 font-medium">
              <span># maxSpeed : double</span>
              <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.2 rounded border border-blue-100">Introduced</span>
            </div>
          </div>

          {/* Compartment 3: Member Functions */}
          <div className="p-3 font-mono text-xs space-y-1 bg-slate-50/50 text-slate-700">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1">Operations (Public)</div>
            <div>+ Vehicle(initialSpeed, maxSpeed)</div>
            <div>+ virtual ~Vehicle()</div>
            <div>+ virtual void startEngine()</div>
            <div>+ virtual void stopEngine()</div>
            <div>+ virtual void accelerate(delta)</div>
            <div>+ virtual void brake(delta)</div>
            <div>+ virtual void displayInfo() const</div>
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
          <div className="w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-b-[12px] border-b-slate-400 group-hover:border-b-blue-600 transition-colors" />
          <div className="w-0.5 h-6 bg-slate-300 group-hover:bg-blue-600 transition-colors" />
          <div className="px-3 py-0.5 rounded-full text-xs font-mono border border-slate-200 bg-slate-50 text-slate-600 shadow-sm mt-0.5 group-hover:border-blue-300 group-hover:text-blue-700">
            Single Inheritance (: public Vehicle)
          </div>
        </div>

        {/* ========================================================= */}
        {/* 2. DERIVED CLASS: Car */}
        {/* ========================================================= */}
        <div
          onClick={() => onSelectVehicle('Car')}
          className={`w-full max-w-md rounded-xl border transition-all duration-150 cursor-pointer overflow-hidden shadow-sm ${
            currentVehicle === 'Car'
              ? 'border-blue-600 ring-2 ring-blue-500/20 bg-white'
              : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow'
          }`}
        >
          {/* Compartment 1: Class Name & Type */}
          <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 font-bold">
                «Derived Class»
              </span>
              <span className="text-sm font-bold text-slate-900 font-mono">Car : public Vehicle</span>
            </div>
            {currentVehicle === 'Car' && (
              <span className="text-xs text-blue-600 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Selected
              </span>
            )}
          </div>

          {/* Compartment 2: Data Members */}
          <div className="p-3 border-b border-slate-100 font-mono text-xs space-y-1.5 bg-white">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Attributes</div>
            <div className="flex items-center justify-between text-amber-600 font-medium">
              <span># fuelLevel : double</span>
              <span className="text-[10px] bg-amber-50 text-amber-700 px-1.5 py-0.2 rounded border border-amber-100">Introduced in Car</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span className="line-through"># speed, isRunning, maxSpeed</span>
              <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.2 rounded">From Vehicle</span>
            </div>
          </div>

          {/* Compartment 3: Member Functions */}
          <div className="p-3 font-mono text-xs space-y-1 bg-slate-50/50 text-slate-700">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1">Operations</div>
            <div className="text-amber-700 font-medium">+ refuel(amount : double) <span className="text-[10px] bg-amber-100 text-amber-800 px-1 rounded ml-1">New</span></div>
            <div className="text-blue-600 font-medium">+ accelerate(delta) <span className="text-[10px] bg-blue-100 text-blue-800 px-1 rounded ml-1">Override</span></div>
            <div className="text-blue-600 font-medium">+ displayInfo() const <span className="text-[10px] bg-blue-100 text-blue-800 px-1 rounded ml-1">Override</span></div>
            <div className="text-slate-400">+ brake(), startEngine(), stopEngine() (Inherited)</div>
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
          <div className="w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-b-[12px] border-b-slate-400 group-hover:border-b-blue-600 transition-colors" />
          <div className="w-0.5 h-6 bg-slate-300 group-hover:bg-blue-600 transition-colors" />
          <div className="px-3 py-0.5 rounded-full text-xs font-mono border border-slate-200 bg-slate-50 text-slate-600 shadow-sm mt-0.5 group-hover:border-blue-300 group-hover:text-blue-700">
            Multilevel Inheritance (: public Car)
          </div>
        </div>

        {/* ========================================================= */}
        {/* 3. MULTILEVEL DERIVED CLASS: ElectricCar */}
        {/* ========================================================= */}
        <div
          onClick={() => onSelectVehicle('ElectricCar')}
          className={`w-full max-w-md rounded-xl border transition-all duration-150 cursor-pointer overflow-hidden shadow-sm ${
            currentVehicle === 'ElectricCar'
              ? 'border-blue-600 ring-2 ring-blue-500/20 bg-white'
              : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow'
          }`}
        >
          {/* Compartment 1: Class Name & Type */}
          <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-600 font-bold">
                «Multilevel Derived»
              </span>
              <span className="text-sm font-bold text-slate-900 font-mono">ElectricCar : public Car</span>
            </div>
            {currentVehicle === 'ElectricCar' && (
              <span className="text-xs text-blue-600 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Selected
              </span>
            )}
          </div>

          {/* Compartment 2: Data Members */}
          <div className="p-3 border-b border-slate-100 font-mono text-xs space-y-1.5 bg-white">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Attributes</div>
            <div className="flex items-center justify-between text-emerald-600 font-medium">
              <span># batteryLevel : double</span>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded border border-emerald-100">Introduced in EV</span>
            </div>
            <div className="flex items-center justify-between text-emerald-600 font-medium">
              <span># regenerativeBraking : bool</span>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded border border-emerald-100">Introduced in EV</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span># fuelLevel (from Car)</span>
              <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.2 rounded">Level 2 Inherited</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span># speed, maxSpeed (from Vehicle)</span>
              <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.2 rounded">Level 1 Inherited</span>
            </div>
          </div>

          {/* Compartment 3: Member Functions */}
          <div className="p-3 font-mono text-xs space-y-1 bg-slate-50/50 text-slate-700">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1">Operations</div>
            <div className="text-emerald-600 font-medium">+ chargeBattery(amount) <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1 rounded ml-1">New</span></div>
            <div className="text-blue-600 font-medium">+ accelerate(delta) <span className="text-[10px] bg-blue-100 text-blue-800 px-1 rounded ml-1">Override</span></div>
            <div className="text-blue-600 font-medium">+ brake(delta) [Regenerative] <span className="text-[10px] bg-blue-100 text-blue-800 px-1 rounded ml-1">Override</span></div>
            <div className="text-blue-600 font-medium">+ displayInfo() const <span className="text-[10px] bg-blue-100 text-blue-800 px-1 rounded ml-1">Override</span></div>
          </div>
        </div>
      </div>

      {/* Interactive Explanation Callout */}
      <div className="p-3.5 rounded-xl bg-blue-50/80 border border-blue-200 flex items-start space-x-3 text-xs">
        <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold text-blue-900 text-xs">
            {hoveredEdge === 'single'
              ? 'Single Inheritance: Vehicle → Car'
              : hoveredEdge === 'multilevel'
              ? 'Multilevel Inheritance: Vehicle → Car → ElectricCar'
              : 'Inheritance Architecture Insight'}
          </div>
          <p className="text-slate-600 leading-relaxed text-xs">
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
