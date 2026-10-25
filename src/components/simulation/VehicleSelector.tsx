import React from 'react';
import { VehicleType } from '../../types/vehicle';
import { Layers, Zap, Flame, ChevronRight } from 'lucide-react';

interface VehicleSelectorProps {
  currentType: VehicleType;
  onSelect: (type: VehicleType) => void;
}

export const VehicleSelector: React.FC<VehicleSelectorProps> = ({ currentType, onSelect }) => {
  const cards: {
    type: VehicleType;
    title: string;
    badge: string;
    badgeColor: string;
    description: string;
    icon: React.ReactNode;
    introducedMembers: string[];
    inheritedMembers: string[];
  }[] = [
    {
      type: 'Vehicle',
      title: 'Vehicle',
      badge: 'Base Class',
      badgeColor: 'border-cyan/40 bg-cyan/10 text-cyan',
      description: 'The root of the OOP hierarchy. Establishes common state & member functions.',
      icon: <Layers className="w-4 h-4 text-cyan" />,
      introducedMembers: ['speed', 'isRunning', 'accelerate()', 'brake()'],
      inheritedMembers: ['None (Root Class)']
    },
    {
      type: 'Car',
      title: 'Car',
      badge: 'Single Inheritance',
      badgeColor: 'border-fuel/40 bg-fuel/10 text-fuel',
      description: 'Derives from Vehicle. Adds internal combustion fuel tank & consumption logic.',
      icon: <Flame className="w-4 h-4 text-fuel" />,
      introducedMembers: ['fuelLevel', 'refuel()'],
      inheritedMembers: ['speed', 'isRunning', 'accelerate()', 'brake()']
    },
    {
      type: 'ElectricCar',
      title: 'ElectricCar',
      badge: 'Multilevel Inheritance',
      badgeColor: 'border-inheritance/40 bg-inheritance/10 text-inheritance',
      description: 'Derives from Car (which derives from Vehicle). Adds EV battery & regenerative braking.',
      icon: <Zap className="w-4 h-4 text-emerald-400" />,
      introducedMembers: ['batteryLevel', 'chargeBattery()', 'regenerativeBraking'],
      inheritedMembers: ['speed (from Vehicle)', 'fuelLevel (from Car)']
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
      {cards.map((card) => {
        const isSelected = currentType === card.type;
        return (
          <button
            key={card.type}
            type="button"
            onClick={() => onSelect(card.type)}
            className={`text-left p-3 rounded-lg border transition-all duration-200 relative overflow-hidden group ${
              isSelected
                ? 'bg-graphite-850/90 border-cyan shadow-[0_0_15px_rgba(0,242,254,0.15)] ring-1 ring-cyan/40'
                : 'bg-graphite-900/60 border-slate-800 hover:border-slate-700 hover:bg-graphite-850/60'
            }`}
          >
            {/* Active Top Bar Indicator */}
            {isSelected && (
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan via-emerald-400 to-purple-500" />
            )}

            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center space-x-2">
                <span className="p-1.5 rounded-md bg-graphite-800 border border-slate-700">
                  {card.icon}
                </span>
                <span className="font-semibold text-sm text-slate-100 font-mono">
                  {card.title}
                </span>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${card.badgeColor}`}>
                {card.badge}
              </span>
            </div>

            <p className="text-xs text-slate-400 line-clamp-2 mb-2 leading-relaxed">
              {card.description}
            </p>

            <div className="pt-2 border-t border-slate-800/80 flex flex-col gap-1 text-[11px] font-mono">
              <div className="flex items-center text-slate-400">
                <span className="text-[10px] text-slate-500 w-16">Introduced:</span>
                <span className="text-cyan truncate font-semibold">
                  {card.introducedMembers.join(', ')}
                </span>
              </div>
              <div className="flex items-center text-slate-400">
                <span className="text-[10px] text-slate-500 w-16">Inherited:</span>
                <span className="text-slate-300 truncate">
                  {card.inheritedMembers.join(', ')}
                </span>
              </div>
            </div>

            {isSelected && (
              <div className="mt-2 pt-1 flex items-center justify-end text-[10px] text-cyan font-mono font-medium">
                Active in Lab <ChevronRight className="w-3 h-3 ml-0.5" />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};
