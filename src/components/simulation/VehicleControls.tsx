import React from 'react';
import { VehicleState } from '../../types/vehicle';
import { 
  Play, 
  Power, 
  Gauge, 
  Fuel, 
  BatteryCharging, 
  RotateCcw,
  Compass
} from 'lucide-react';

interface VehicleControlsProps {
  state: VehicleState;
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

export const VehicleControls: React.FC<VehicleControlsProps> = ({
  state,
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
  const isElectric = state.type === 'ElectricCar';
  const isCar = state.type === 'Car';
  const isEnergyDepleted = (isCar && state.fuelLevel <= 0) || (isElectric && state.batteryLevel <= 0);

  return (
    <div className="bg-graphite-900/80 border border-slate-800 rounded-lg p-3.5 shadow-md">
      <div className="flex items-center justify-between mb-3 border-b border-slate-800/80 pb-2">
        <span className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Gauge className="w-3.5 h-3.5 text-cyan" /> Interactive Drivetrain Controls
        </span>
        <span className="text-[11px] font-mono text-slate-400">
          Engine Status: <strong className={state.isEngineOn ? 'text-emerald-400' : 'text-slate-500'}>
            {state.isEngineOn ? (isElectric ? 'EV CONTACTORS ON' : 'IGNITION ON') : 'OFF'}
          </strong>
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
        {/* 1. Start / Stop Ignition */}
        <button
          type="button"
          onClick={onToggleEngine}
          className={`flex flex-col items-center justify-center p-2.5 rounded-lg border font-mono text-xs font-semibold transition-all shadow-sm ${
            state.isEngineOn
              ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/50'
              : 'bg-graphite-800 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-200'
          }`}
          title="Toggle vehicle engine or EV motor contactors"
        >
          <Power className={`w-5 h-5 mb-1 ${state.isEngineOn ? 'text-emerald-400 animate-pulse' : 'text-slate-400'}`} />
          <span>{state.isEngineOn ? 'Engine Stop' : 'Engine Start'}</span>
        </button>

        {/* 2. Accelerate Button */}
        <button
          type="button"
          onClick={onAccelerate}
          onMouseDown={() => setThrottleActive(true)}
          onMouseUp={() => setThrottleActive(false)}
          onMouseLeave={() => setThrottleActive(false)}
          onTouchStart={() => setThrottleActive(true)}
          onTouchEnd={() => setThrottleActive(false)}
          disabled={!state.isEngineOn || isEnergyDepleted}
          className={`flex flex-col items-center justify-center p-2.5 rounded-lg border font-mono text-xs font-semibold transition-all shadow-sm select-none ${
            !state.isEngineOn || isEnergyDepleted
              ? 'bg-graphite-950/50 border-slate-800 text-slate-600 cursor-not-allowed'
              : 'bg-cyan-950/40 border-cyan/50 text-cyan hover:bg-cyan-900/40 active:scale-95 shadow-[0_0_12px_rgba(0,242,254,0.15)]'
          }`}
          title="Click to pulse throttle or hold down for continuous acceleration"
        >
          <Play className="w-5 h-5 mb-1 text-cyan fill-cyan/30 rotate-0" />
          <span>Accelerate</span>
        </button>

        {/* 3. Brake Button */}
        <button
          type="button"
          onClick={onBrake}
          onMouseDown={() => setBrakeActive(true)}
          onMouseUp={() => setBrakeActive(false)}
          onMouseLeave={() => setBrakeActive(false)}
          onTouchStart={() => setBrakeActive(true)}
          onTouchEnd={() => setBrakeActive(false)}
          className="flex flex-col items-center justify-center p-2.5 rounded-lg border font-mono text-xs font-semibold transition-all shadow-sm select-none bg-rose-950/40 border-rose-500/40 text-rose-300 hover:bg-rose-900/40 active:scale-95"
          title="Click or hold to apply hydraulic brakes"
        >
          <div className="w-5 h-5 mb-1 rounded-full border-2 border-rose-400 flex items-center justify-center text-[10px] font-bold">
            !
          </div>
          <span>Brake</span>
        </button>

        {/* 4. Refuel or Charge (Polymorphic) */}
        {isCar ? (
          <button
            type="button"
            onClick={onRefuel}
            className="flex flex-col items-center justify-center p-2.5 rounded-lg border font-mono text-xs font-semibold transition-all shadow-sm bg-fuel/10 border-fuel/40 text-fuel hover:bg-fuel/20 active:scale-95"
            title="Refuel combustion gas tank (+30%)"
          >
            <Fuel className="w-5 h-5 mb-1 text-fuel" />
            <span>Refuel (+30%)</span>
          </button>
        ) : isElectric ? (
          <button
            type="button"
            onClick={onCharge}
            className="flex flex-col items-center justify-center p-2.5 rounded-lg border font-mono text-xs font-semibold transition-all shadow-sm bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/40 active:scale-95"
            title="Fast-charge high-voltage battery (+25%)"
          >
            <BatteryCharging className="w-5 h-5 mb-1 text-emerald-400" />
            <span>Charge (+25%)</span>
          </button>
        ) : (
          <div className="flex flex-col items-center justify-center p-2.5 rounded-lg border border-slate-800 bg-graphite-950/40 text-slate-600 font-mono text-xs text-center">
            <span className="text-[10px] leading-tight">No Fuel/EV Cell in Base</span>
          </div>
        )}

        {/* 5. Cruise Control Toggle */}
        <button
          type="button"
          onClick={onToggleCruise}
          disabled={!state.isEngineOn || state.speed <= 10}
          className={`flex flex-col items-center justify-center p-2.5 rounded-lg border font-mono text-xs font-semibold transition-all shadow-sm ${
            state.cruiseControl
              ? 'bg-purple-950/50 border-purple-500 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.25)]'
              : (!state.isEngineOn || state.speed <= 10
                  ? 'bg-graphite-950/50 border-slate-800 text-slate-600 cursor-not-allowed'
                  : 'bg-graphite-800/80 border-slate-700 text-slate-300 hover:border-slate-600')
          }`}
          title="Maintain constant cruising velocity"
        >
          <Compass className={`w-5 h-5 mb-1 ${state.cruiseControl ? 'text-purple-400 animate-spin' : 'text-slate-400'}`} style={{ animationDuration: '6s' }} />
          <span>Cruise {state.cruiseControl ? 'ON' : 'OFF'}</span>
        </button>

        {/* 6. Reset Simulation */}
        <button
          type="button"
          onClick={onReset}
          className="flex flex-col items-center justify-center p-2.5 rounded-lg border font-mono text-xs font-semibold transition-all shadow-sm bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-600 active:scale-95"
          title="Reset odometer, velocity, and state"
        >
          <RotateCcw className="w-5 h-5 mb-1 text-slate-400" />
          <span>Reset Lab</span>
        </button>
      </div>
    </div>
  );
};
