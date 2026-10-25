import React from 'react';
import { VehicleState } from '../../types/vehicle';
import { Gauge, Fuel, Battery, MapPin, Zap } from 'lucide-react';

interface TelemetryPanelProps {
  state: VehicleState;
}

export const TelemetryPanel: React.FC<TelemetryPanelProps> = ({ state }) => {
  const isElectric = state.type === 'ElectricCar';
  const isCar = state.type === 'Car';

  // Energy percentage
  const energyPercent = isElectric ? state.batteryLevel : (isCar ? state.fuelLevel : 100);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {/* 1. Battery / Fuel Card */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-sm flex flex-col justify-between">
        <div className="flex items-center space-x-2 text-slate-500 mb-1">
          {isElectric ? (
            <Battery className="w-4 h-4 text-emerald-600" />
          ) : isCar ? (
            <Fuel className="w-4 h-4 text-amber-600" />
          ) : (
            <Zap className="w-4 h-4 text-blue-600" />
          )}
          <span className="text-xs font-medium text-slate-600">
            {isElectric ? 'Battery Level' : (isCar ? 'Fuel Level' : 'Base Drivetrain')}
          </span>
        </div>

        <div className="text-xl font-bold text-slate-900 mb-2">
          {isElectric || isCar ? `${Math.round(energyPercent)}%` : 'Ready'}
        </div>

        {/* Clean Progress Bar */}
        {(isElectric || isCar) && (
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isElectric ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
              style={{ width: `${Math.max(3, Math.min(100, energyPercent))}%` }}
            />
          </div>
        )}
      </div>

      {/* 2. Drivetrain Status Card */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-sm flex flex-col justify-between">
        <div className="flex items-center space-x-2 text-slate-500 mb-1">
          <Zap className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-medium text-slate-600">Drivetrain Status</span>
        </div>
        <div>
          <div className="text-sm font-bold text-emerald-600 flex items-center gap-1.5">
            {state.isEngineOn ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{isElectric ? 'EV Mode (Running)' : 'Active (Running)'}</span>
              </>
            ) : (
              <span className="text-slate-500 font-medium">Ignition Off</span>
            )}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5 capitalize">
            State: {state.engineState.toLowerCase()}
          </div>
        </div>
      </div>

      {/* 3. Max Speed Card */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-sm flex flex-col justify-between">
        <div className="flex items-center space-x-2 text-slate-500 mb-1">
          <Gauge className="w-4 h-4 text-slate-700" />
          <span className="text-xs font-medium text-slate-600">Max Speed</span>
        </div>
        <div className="text-xl font-bold text-slate-900">
          {state.maxSpeed} <span className="text-xs font-normal text-slate-500">km/h</span>
        </div>
      </div>

      {/* 4. Total Distance Card */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-sm flex flex-col justify-between">
        <div className="flex items-center space-x-2 text-slate-500 mb-1">
          <MapPin className="w-4 h-4 text-slate-700" />
          <span className="text-xs font-medium text-slate-600">Total Distance</span>
        </div>
        <div className="text-xl font-bold text-slate-900">
          {state.distance.toFixed(1)} <span className="text-xs font-normal text-slate-500">km</span>
        </div>
      </div>
    </div>
  );
};
