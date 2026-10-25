import { useState } from 'react';
import { useVehicleSimulation } from './hooks/useVehicleSimulation';
import { ActiveTab } from './types/vehicle';
import { Navbar } from './components/common/Navbar';
import { SimulationWorkspace } from './components/simulation/SimulationWorkspace';
import { CodeExplorer } from './components/code/CodeExplorer';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('simulation');

  const {
    vehicleType,
    selectVehicleType,
    simulationStatus,
    state,
    codeFocus,
    events,
    telemetryHistory,
    accelerate,
    brake,
    refuel,
    chargeBattery,
    toggleEngine,
    toggleCruiseControl,
    resetSimulation,
    setThrottleActive,
    setBrakeActive
  } = useVehicleSimulation();

  return (
    <div className="min-h-screen h-screen flex flex-col bg-graphite-950 bg-tech-grid text-slate-100 overflow-hidden font-sans">
      {/* Top Application Navbar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        status={simulationStatus}
        onReset={resetSimulation}
      />

      {/* Main Dual-Column Engineering Workspace */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* LEFT COLUMN: 63% Width - Simulation & Educational Workspace */}
        <div className="w-full lg:w-[63%] h-full flex flex-col overflow-hidden bg-graphite-950/70 border-r border-slate-800">
          <SimulationWorkspace
            activeTab={activeTab}
            vehicleType={vehicleType}
            state={state}
            events={events}
            telemetryHistory={telemetryHistory}
            onSelectVehicle={selectVehicleType}
            onAccelerate={accelerate}
            onBrake={brake}
            onToggleEngine={toggleEngine}
            onRefuel={refuel}
            onCharge={chargeBattery}
            onToggleCruise={toggleCruiseControl}
            onReset={resetSimulation}
            setThrottleActive={setThrottleActive}
            setBrakeActive={setBrakeActive}
          />
        </div>

        {/* RIGHT COLUMN: 37% Width - Persistent C++ Code Explorer */}
        <div className="w-full lg:w-[37%] h-full flex flex-col overflow-hidden bg-graphite-900 border-t lg:border-t-0 border-slate-800">
          <CodeExplorer
            currentVehicle={vehicleType}
            codeFocus={codeFocus}
          />
        </div>
      </main>
    </div>
  );
}
