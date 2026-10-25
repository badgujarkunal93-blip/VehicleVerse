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
    { id: 'simulation', label: '3D Simulation', icon: <Car className="w-3.5 h-3.5" /> },
    { id: 'inheritance', label: 'Inheritance Map', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'execution', label: 'Execution Flow', icon: <GitCommit className="w-3.5 h-3.5" /> },
    { id: 'learning', label: 'OOP Concepts', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { id: 'quiz', label: 'Quiz', icon: <HelpCircle className="w-3.5 h-3.5" /> },
  ];

  return (
    <header className="h-14 bg-graphite-950/90 border-b border-slate-800 backdrop-blur-md px-3 sm:px-4 flex items-center justify-between select-none z-30 sticky top-0">
      {/* Brand & Logo */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center shadow-[0_0_15px_rgba(0,242,254,0.3)]">
            <Car className="w-5 h-5 text-graphite-950 font-black" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-sm sm:text-base tracking-wider bg-gradient-to-r from-cyan via-slate-100 to-purple-400 bg-clip-text text-transparent font-mono">
                VEHICLEVERSE
              </span>
              <span className="text-[9px] uppercase font-mono px-1 py-0.2 rounded bg-cyan/10 border border-cyan/30 text-cyan hidden sm:inline-block">
                C++ OOP LAB
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden md:block leading-none">
              Understand Inheritance. Experience the Drive.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Segmented Tabs */}
      <nav className="flex items-center space-x-1 bg-graphite-900/90 p-1 rounded-lg border border-slate-800 overflow-x-auto text-xs font-mono">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md transition-all duration-150 whitespace-nowrap ${
                isActive
                  ? 'bg-graphite-800 text-cyan border border-slate-700 shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-graphite-850'
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Status & Reset Action */}
      <div className="flex items-center space-x-2.5">
        {/* Status Indicator */}
        <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-graphite-900 border border-slate-800 text-[11px] font-mono">
          <span
            className={`w-2 h-2 rounded-full ${
              status === 'RUNNING'
                ? 'bg-emerald-400 animate-ping'
                : status === 'PAUSED'
                ? 'bg-amber-400'
                : 'bg-cyan'
            }`}
          />
          <span className="text-slate-400">STATUS:</span>
          <span className="text-slate-200 font-semibold">{status}</span>
        </div>

        {/* Global Reset */}
        <button
          type="button"
          onClick={onReset}
          className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-graphite-800 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-cyan text-xs font-mono transition-colors shadow-sm"
          title="Reset simulation parameters"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Reset Lab</span>
        </button>
      </div>
    </header>
  );
};
