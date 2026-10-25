import { useState, useEffect } from 'react';
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
    setBrakeActive,
    clearEvents
  } = useVehicleSimulation();

  // Global Keyboard Shortcuts (matching hints: ↑ or W, ↓ or S, Space, R)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is inside an input or editable element
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        setThrottleActive(true);
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        setBrakeActive(true);
      } else if (e.code === 'Space') {
        e.preventDefault();
        toggleEngine();
      } else if (e.key === 'r' || e.key === 'R') {
        resetSimulation();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        setThrottleActive(false);
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        setBrakeActive(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [setThrottleActive, setBrakeActive, toggleEngine, resetSimulation]);

  return (
    <div className="min-h-screen h-screen flex flex-col bg-slate-50 text-slate-800 overflow-hidden font-sans">
      {/* Top Application Navbar matching reference */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        status={simulationStatus}
        onReset={resetSimulation}
      />

      {/* Main Dual-Column Workspace with consistent alignment and spacing */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden p-3.5 lg:p-5 gap-4 lg:gap-5 w-full max-w-[1800px] mx-auto">
        {/* LEFT COLUMN: ~61% Width - Simulation & Educational Workspace */}
        <div className="w-full lg:w-[61%] h-full flex flex-col overflow-hidden min-w-0">
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
            onClearEvents={clearEvents}
          />
        </div>

        {/* RIGHT COLUMN: ~39% Width - Persistent C++ Code Explorer */}
        <div className="w-full lg:w-[39%] h-full flex flex-col overflow-hidden min-w-0">
          <CodeExplorer
            currentVehicle={vehicleType}
            codeFocus={codeFocus}
          />
        </div>
      </main>
    </div>
  );
}
