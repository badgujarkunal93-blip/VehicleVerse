import React from 'react';
import { VehicleState, TelemetryPoint } from '../../types/vehicle';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Gauge, Fuel, Battery, Navigation, Activity } from 'lucide-react';

interface TelemetryPanelProps {
  state: VehicleState;
  telemetryHistory: TelemetryPoint[];
}

export const TelemetryPanel: React.FC<TelemetryPanelProps> = ({ state, telemetryHistory }) => {
  const isElectric = state.type === 'ElectricCar';
  const isCar = state.type === 'Car';

  return (
    <div className="bg-graphite-900/90 border border-slate-800 rounded-lg p-3 shadow-md flex flex-col gap-3">
      {/* 4 Digital Readout Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {/* Speed Readout */}
        <div className="bg-graphite-850/80 border border-slate-800/80 rounded-md p-2.5 flex items-center space-x-2.5">
          <div className="p-2 rounded bg-cyan/10 border border-cyan/30 text-cyan">
            <Gauge className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-mono text-slate-400">Velocity</div>
            <div className="text-lg font-mono font-bold text-cyan">
              {Math.round(state.speed)} <span className="text-[11px] font-normal text-slate-400">km/h</span>
            </div>
          </div>
        </div>

        {/* Distance Readout */}
        <div className="bg-graphite-850/80 border border-slate-800/80 rounded-md p-2.5 flex items-center space-x-2.5">
          <div className="p-2 rounded bg-purple-500/10 border border-purple-500/30 text-purple-400">
            <Navigation className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-mono text-slate-400">Odometer</div>
            <div className="text-lg font-mono font-bold text-slate-200">
              {state.distance.toFixed(2)} <span className="text-[11px] font-normal text-slate-400">km</span>
            </div>
          </div>
        </div>

        {/* Fuel or Battery Readout */}
        <div className="bg-graphite-850/80 border border-slate-800/80 rounded-md p-2.5 flex items-center space-x-2.5">
          {isElectric ? (
            <>
              <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <Battery className="w-4 h-4" />
              </div>
              <div className="w-full">
                <div className="text-[10px] uppercase font-mono text-slate-400">EV Battery</div>
                <div className="text-lg font-mono font-bold text-emerald-400">
                  {Math.round(state.batteryLevel)}%
                </div>
              </div>
            </>
          ) : isCar ? (
            <>
              <div className="p-2 rounded bg-fuel/10 border border-fuel/30 text-fuel">
                <Fuel className="w-4 h-4" />
              </div>
              <div className="w-full">
                <div className="text-[10px] uppercase font-mono text-slate-400">Fuel Tank</div>
                <div className="text-lg font-mono font-bold text-fuel">
                  {Math.round(state.fuelLevel)}%
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="p-2 rounded bg-slate-800 border border-slate-700 text-slate-400">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-mono text-slate-400">Energy Store</div>
                <div className="text-sm font-mono text-slate-400">None (Base)</div>
              </div>
            </>
          )}
        </div>

        {/* Drivetrain Operational State */}
        <div className="bg-graphite-850/80 border border-slate-800/80 rounded-md p-2.5 flex items-center space-x-2.5">
          <div className="p-2 rounded bg-blue-500/10 border border-blue-500/30 text-blue-400">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-mono text-slate-400">Drivetrain</div>
            <div className="text-xs font-mono font-semibold text-slate-200 uppercase truncate">
              {state.engineState}
            </div>
          </div>
        </div>
      </div>

      {/* Energy Level Bar Indicator (when Car or ElectricCar) */}
      {(isCar || isElectric) && (
        <div className="bg-graphite-850/60 rounded p-2 border border-slate-800/70">
          <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 mb-1">
            <span>{isElectric ? 'Battery Pack Capacity' : 'Fuel Tank Capacity'}</span>
            <span className={isElectric ? 'text-emerald-400' : 'text-fuel'}>
              {isElectric ? `${state.batteryLevel.toFixed(1)}%` : `${state.fuelLevel.toFixed(1)}%`}
            </span>
          </div>
          <div className="w-full bg-graphite-950 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                isElectric
                  ? (state.batteryLevel > 20 ? 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-500 animate-pulse')
                  : (state.fuelLevel > 20 ? 'bg-fuel shadow-[0_0_8px_rgba(255,138,0,0.5)]' : 'bg-red-500 animate-pulse')
              }`}
              style={{ width: `${Math.max(2, Math.min(100, isElectric ? state.batteryLevel : state.fuelLevel))}%` }}
            />
          </div>
        </div>
      )}

      {/* Speed Over Time Telemetry Spark-chart */}
      <div className="bg-graphite-850/50 rounded-md p-2 border border-slate-800/60">
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1 px-1">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan inline-block animate-ping" />
            Live Speed Telemetry (km/h)
          </span>
          <span className="text-slate-500">Max: {state.maxSpeed} km/h</span>
        </div>
        <div className="h-14 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={telemetryHistory} margin={{ top: 2, right: 4, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="speedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00f2fe" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#00f2fe" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" hide />
              <YAxis domain={[0, state.maxSpeed]} hide />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-graphite-900 border border-slate-700 px-2 py-1 rounded text-[10px] font-mono text-cyan shadow-lg">
                        {payload[0].value} km/h
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="speed"
                stroke="#00f2fe"
                strokeWidth={1.5}
                fillOpacity={1}
                fill="url(#speedGradient)"
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
