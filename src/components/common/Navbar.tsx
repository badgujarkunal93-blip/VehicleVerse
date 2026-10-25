import React from 'react';
import { ActiveTab, SimulationStatus } from '../../types/vehicle';
import { Car, Layers, GitCommit, BookOpen, HelpCircle, RotateCcw } from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  status: SimulationStatus;
  onReset: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  status,
  onReset
}) => {
  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'simulation', label: '3D Simulation', icon: <Car className="w-4 h-4" /> },
    { id: 'inheritance', label: 'Inheritance Map', icon: <Layers className="w-4 h-4" /> },
    { id: 'execution', label: 'Execution Flow', icon: <GitCommit className="w-4 h-4" /> },
    { id: 'learning', label: 'OOP Concepts', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'quiz', label: 'Quiz', icon: <HelpCircle className="w-4 h-4" /> },
  ];

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 lg:px-6 flex items-center justify-between select-none z-30 sticky top-0 shadow-sm">
      {/* Brand & Logo */}
      <div className="flex items-center space-x-3">
        <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
          <Car className="w-5 h-5 stroke-[2.2]" />
        </div>
        <div>
          <div className="flex items-center space-x-1.5">
            <span className="font-extrabold text-base lg:text-lg tracking-tight text-slate-900 font-sans">
              VEHICLE<span className="text-blue-600">VERSE</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 font-normal leading-none hidden sm:block">
            Understand Inheritance. Experience the Drive.
          </p>
        </div>
      </div>

      {/* Navigation Segmented Tabs */}
      <nav className="flex items-center space-x-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/80 overflow-x-auto text-xs font-sans">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all duration-150 whitespace-nowrap font-medium text-xs ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Status & Reset Action */}
      <div className="flex items-center space-x-2.5">
        {/* Status Indicator */}
        <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
          <span
            className={`w-2 h-2 rounded-full bg-emerald-500 ${
              status === 'RUNNING' ? 'animate-pulse' : ''
            }`}
          />
          <span className="tracking-wide text-[11px]">{status}</span>
        </div>

        {/* Global Reset */}
        <button
          type="button"
          onClick={onReset}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors shadow-sm"
          title="Reset simulation parameters"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset Lab</span>
        </button>
      </div>
    </header>
  );
};
