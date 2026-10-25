import React from 'react';
import { SimulationEvent } from '../../types/vehicle';
import { FileText, Trash2 } from 'lucide-react';

interface EventLogProps {
  events: SimulationEvent[];
  onClear?: () => void;
}

export const EventLog: React.FC<EventLogProps> = ({ events, onClear }) => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-sm flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <FileText className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-bold text-slate-800 tracking-tight">
            Event Log
          </span>
        </div>

        {onClear && (
          <button
            type="button"
            onClick={onClear}
            className="flex items-center space-x-1 text-slate-400 hover:text-slate-700 text-xs font-medium transition-colors"
            title="Clear event log history"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* Event List */}
      <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1 text-xs">
        {events.length === 0 ? (
          <div className="py-3 text-center text-slate-400 text-xs">
            No events logged yet. Use controls to interact.
          </div>
        ) : (
          events.slice(0, 15).map((evt) => {
            let dotColor = 'bg-blue-500';
            if (evt.type === 'success') dotColor = 'bg-emerald-500';
            else if (evt.type === 'warning') dotColor = 'bg-amber-500';
            else if (evt.type === 'action') dotColor = 'bg-blue-600';

            return (
              <div
                key={evt.id}
                className="py-1 px-1.5 rounded-md hover:bg-slate-50 flex items-center justify-between text-slate-700 transition-colors"
              >
                <div className="flex items-center space-x-2.5 overflow-hidden pr-2">
                  <span className={`w-2 h-2 rounded-full ${dotColor} flex-shrink-0`} />
                  <span className="truncate text-xs font-medium text-slate-700">
                    {evt.description || evt.title}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono flex-shrink-0">
                  {evt.timestamp}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
