import React from 'react';
import { 
  VehicleType, 
  VehicleState, 
  ActiveTab, 
  SimulationEvent,
  TelemetryPoint 
} from '../../types/vehicle';
import { VehicleScene3D } from './VehicleScene3D';
import { VehicleSelector } from './VehicleSelector';
import { VehicleControls } from './VehicleControls';
import { TelemetryPanel } from './TelemetryPanel';
import { EventLog } from './EventLog';
import { InheritanceDiagram } from '../diagrams/InheritanceDiagram';
import { ExecutionFlow } from '../flow/ExecutionFlow';
import { LearningPanel } from '../learning/LearningPanel';
import { QuizPanel } from '../quiz/QuizPanel';

interface SimulationWorkspaceProps {
  activeTab: ActiveTab;
  vehicleType: VehicleType;
  state: VehicleState;
  events: SimulationEvent[];
  telemetryHistory: TelemetryPoint[];
  onSelectVehicle: (type: VehicleType) => void;
  onAccelerate: () => void;
  onBrake: () => void;
  onToggleEngine: () => void;
  onRefuel: () => void;
  onCharge: () => void;
  onToggleCruise: () => void;
  onReset: () => void;
  setThrottleActive: (active: boolean) => void;
  setBrakeActive: (active: boolean) => void;
  onClearEvents?: () => void;
}

export const SimulationWorkspace: React.FC<SimulationWorkspaceProps> = ({
  activeTab,
  vehicleType,
  state,
  events,
  onSelectVehicle,
  onAccelerate,
  onBrake,
  onToggleEngine,
  onRefuel,
  onCharge,
  onToggleCruise,
  onReset,
  setThrottleActive,
  setBrakeActive,
  onClearEvents
}) => {
  return (
    <div className="flex-1 overflow-y-auto space-y-4 pr-1">
      {/* Tab 1: 3D Interactive Simulation View */}
      {activeTab === 'simulation' && (
        <>
          {/* Top Section Header Row matching reference image */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight font-sans">
                3D Vehicle Simulation
              </h2>
              <p className="text-xs text-slate-500 font-sans">
                Select a vehicle class and control it to see inheritance in action.
              </p>
            </div>

            {/* Compact Segmented Vehicle Selector */}
            <VehicleSelector
              currentType={vehicleType}
              onSelect={onSelectVehicle}
            />
          </div>

          {/* 3D WebGL Vehicle Simulation Stage */}
          <div className="h-[380px] sm:h-[400px] rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm relative">
            <VehicleScene3D
              type={vehicleType}
              speed={state.speed}
              distance={state.distance}
              engineState={state.engineState}
              isEngineOn={state.isEngineOn}
            />
          </div>

          {/* Telemetry 4-Card Strip */}
          <TelemetryPanel state={state} />

          {/* Interactive Drivetrain Controls */}
          <VehicleControls
            state={state}
            onAccelerate={onAccelerate}
            onBrake={onBrake}
            onToggleEngine={onToggleEngine}
            onRefuel={onRefuel}
            onCharge={onCharge}
            onToggleCruise={onToggleCruise}
            onReset={onReset}
            setThrottleActive={setThrottleActive}
            setBrakeActive={setBrakeActive}
          />

          {/* Event Log */}
          <EventLog events={events} onClear={onClearEvents} />
        </>
      )}

      {/* Tab 2: UML Class Inheritance Map */}
      {activeTab === 'inheritance' && (
        <InheritanceDiagram
          currentVehicle={vehicleType}
          onSelectVehicle={onSelectVehicle}
        />
      )}

      {/* Tab 3: Execution Flow Visualizer */}
      {activeTab === 'execution' && (
        <ExecutionFlow
          currentVehicle={vehicleType}
        />
      )}

      {/* Tab 4: OOP Concepts Deep Dive */}
      {activeTab === 'learning' && (
        <LearningPanel />
      )}

      {/* Tab 5: Knowledge Quiz */}
      {activeTab === 'quiz' && (
        <QuizPanel />
      )}
    </div>
  );
};
