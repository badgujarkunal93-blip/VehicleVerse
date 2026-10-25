import React from 'react';
import { VehicleState } from '../../types/vehicle';
import { ArrowUp, Power, RotateCcw, Zap, Fuel, CircleDot } from 'lucide-react';

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
  onReset,
  setThrottleActive,
  setBrakeActive
}) => {
  const isElectric = state.type === 'ElectricCar';
  const isCar = state.type === 'Car';
  const isEnergyDepleted = (isCar && state.fuelLevel <= 0) || (isElectric && state.batteryLevel <= 0);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3">
      {/* 1. Accelerate Button */}
      <button
        type="button"
        onClick={onAccelerate}
        onMouseDown={() => setThrottleActive(true)}
        onMouseUp={() => setThrottleActive(false)}
        onMouseLeave={() => setThrottleActive(false)}
        onTouchStart={() => setThrottleActive(true)}
        onTouchEnd={() => setThrottleActive(false)}
        disabled={!state.isEngineOn || isEnergyDepleted}
        className={`flex items-center justify-center space-x-3 py-3 px-4 rounded-xl font-medium transition-all shadow-sm select-none ${
          !state.isEngineOn || isEnergyDepleted
            ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white shadow-blue-500/20'
        }`}
        title="Accelerate (Click, hold, or press ↑ / W)"
      >
        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
          <ArrowUp className="w-5 h-5 stroke-[2.5]" />
        </div>
        <div className="text-left">
          <div className="font-bold text-sm leading-tight">Accelerate</div>
          <div className="text-[11px] text-blue-100 font-mono">↑ or W</div>
        </div>
      </button>

      {/* 2. Brake Button */}
      <button
        type="button"
        onClick={onBrake}
        onMouseDown={() => setBrakeActive(true)}
        onMouseUp={() => setBrakeActive(false)}
        onMouseLeave={() => setBrakeActive(false)}
        onTouchStart={() => setBrakeActive(true)}
        onTouchEnd={() => setBrakeActive(false)}
        className="flex items-center justify-center space-x-3 py-3 px-4 rounded-xl font-medium transition-all shadow-sm select-none bg-rose-50 border border-rose-200/90 text-rose-700 hover:bg-rose-100 active:scale-[0.98]"
        title="Brake (Click, hold, or press ↓ / S)"
      >
        <div className="w-8 h-8 rounded-lg bg-rose-200/60 flex items-center justify-center text-rose-700">
          <CircleDot className="w-5 h-5 stroke-[2.5]" />
        </div>
        <div className="text-left">
          <div className="font-bold text-sm leading-tight">Brake</div>
          <div className="text-[11px] text-rose-500 font-mono">↓ or S</div>
        </div>
      </button>

      {/* 3. Start / Stop Button */}
      <button
        type="button"
        onClick={onToggleEngine}
        className={`flex items-center justify-center space-x-3 py-3 px-4 rounded-xl font-medium transition-all shadow-sm ${
          state.isEngineOn
            ? 'bg-white border border-slate-200 text-slate-800 hover:bg-slate-50'
            : 'bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100'
        }`}
        title="Toggle engine / contactors (Spacebar)"
      >
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${state.isEngineOn ? 'bg-slate-100 text-slate-700' : 'bg-emerald-200/60 text-emerald-700'}`}>
          <Power className="w-5 h-5 stroke-[2.2]" />
        </div>
        <div className="text-left">
          <div className="font-bold text-sm leading-tight">
            {state.isEngineOn ? 'Stop Engine' : 'Start Engine'}
          </div>
          <div className="text-[11px] text-slate-400 font-mono">Space</div>
        </div>
      </button>

      {/* 4. Charge or Refuel / Reset Button */}
      {isElectric ? (
        <button
          type="button"
          onClick={onCharge}
          className="flex items-center justify-center space-x-3 py-3 px-4 rounded-xl font-medium transition-all shadow-sm bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 active:scale-[0.98]"
          title="Charge high-voltage battery pack (+25%)"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-200/60 flex items-center justify-center text-emerald-700">
            <Zap className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div className="text-left">
            <div className="font-bold text-sm leading-tight">Charge</div>
            <div className="text-[11px] text-emerald-600 font-mono">+25% Battery</div>
          </div>
        </button>
      ) : isCar ? (
        <button
          type="button"
          onClick={onRefuel}
          className="flex items-center justify-center space-x-3 py-3 px-4 rounded-xl font-medium transition-all shadow-sm bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100 active:scale-[0.98]"
          title="Refuel combustion gas tank (+30%)"
        >
          <div className="w-8 h-8 rounded-lg bg-amber-200/60 flex items-center justify-center text-amber-700">
            <Fuel className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div className="text-left">
            <div className="font-bold text-sm leading-tight">Refuel</div>
            <div className="text-[11px] text-amber-600 font-mono">+30% Gas</div>
          </div>
        </button>
      ) : (
        <button
          type="button"
          onClick={onReset}
          className="flex items-center justify-center space-x-3 py-3 px-4 rounded-xl font-medium transition-all shadow-sm bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 active:scale-[0.98]"
          title="Reset simulation parameters"
        >
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
            <RotateCcw className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div className="text-left">
            <div className="font-bold text-sm leading-tight">Reset Lab</div>
            <div className="text-[11px] text-slate-400 font-mono">Reset R</div>
          </div>
        </button>
      )}
    </div>
  );
};
