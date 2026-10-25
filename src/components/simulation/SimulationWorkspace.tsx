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
}

export const SimulationWorkspace: React.FC<SimulationWorkspaceProps> = ({
  activeTab,
  vehicleType,
  state,
  events,
  telemetryHistory,
  onSelectVehicle,
  onAccelerate,
  onBrake,
  onToggleEngine,
  onRefuel,
  onCharge,
  onToggleCruise,
  onReset,
  setThrottleActive,
  setBrakeActive
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4">
      {/* Tab 1: 3D Interactive Simulation View */}
      {activeTab === 'simulation' && (
        <>
          {/* Vehicle Class Selector Hierarchy Cards */}
          <VehicleSelector
            currentType={vehicleType}
            onSelect={onSelectVehicle}
          />

          {/* 3D WebGL Vehicle Simulation Stage */}
          <div className="h-[360px] sm:h-[400px] rounded-xl overflow-hidden border border-slate-800 shadow-2xl relative">
            <VehicleScene3D
              type={vehicleType}
              speed={state.speed}
              engineState={state.engineState}
              isEngineOn={state.isEngineOn}
            />
          </div>

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

          {/* Telemetry Strip & Speed Chart */}
          <TelemetryPanel
            state={state}
            telemetryHistory={telemetryHistory}
          />

          {/* Simulation Event Log */}
          <EventLog events={events} />
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
