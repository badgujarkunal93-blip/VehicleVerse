import React from 'react';
import { SimulationEvent } from '../../types/vehicle';
import { Terminal, ShieldAlert, CheckCircle, Info, Zap } from 'lucide-react';

interface EventLogProps {
  events: SimulationEvent[];
}

export const EventLog: React.FC<EventLogProps> = ({ events }) => {
  return (
    <div className="bg-graphite-900/90 border border-slate-800 rounded-lg p-3 shadow-md flex flex-col h-44">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80">
        <span className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Terminal className="w-3.5 h-3.5 text-cyan" /> Simulation & OOP Event Dispatcher
        </span>
        <span className="text-[10px] font-mono text-slate-500">
          {events.length} Events Logged
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 font-mono text-xs">
        {events.map((evt) => {
          let badgeColor = 'text-cyan bg-cyan/10 border-cyan/30';
          let icon = <Info className="w-3 h-3 text-cyan" />;

          if (evt.type === 'warning') {
            badgeColor = 'text-amber-400 bg-amber-950/40 border-amber-500/40';
            icon = <ShieldAlert className="w-3 h-3 text-amber-400" />;
          } else if (evt.type === 'success') {
            badgeColor = 'text-emerald-400 bg-emerald-950/40 border-emerald-500/40';
            icon = <CheckCircle className="w-3 h-3 text-emerald-400" />;
          } else if (evt.type === 'action') {
            badgeColor = 'text-purple-400 bg-purple-950/40 border-purple-500/40';
            icon = <Zap className="w-3 h-3 text-purple-400" />;
          }

          return (
            <div
              key={evt.id}
              className="p-1.5 rounded bg-graphite-950/60 border border-slate-800/80 flex flex-col gap-0.5 transition-colors hover:border-slate-700"
            >
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center space-x-1.5">
                  {icon}
                  <span className="font-semibold text-slate-200">{evt.title}</span>
                  <span className={`text-[9px] uppercase px-1 py-0.2 rounded border font-mono ${badgeColor}`}>
                    {evt.type}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500">{evt.timestamp}</span>
              </div>
              <p className="text-[11px] text-slate-400 pl-4">{evt.description}</p>
              {evt.cppCodeSnippet && (
                <div className="ml-4 mt-0.5 text-[10px] text-cyan/90 bg-graphite-900/90 px-2 py-0.5 rounded border border-cyan/20 truncate font-mono">
                  {evt.cppCodeSnippet}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
