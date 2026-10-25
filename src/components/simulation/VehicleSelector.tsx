import React from 'react';
import { VehicleType } from '../../types/vehicle';
import { Layers, Flame, Zap } from 'lucide-react';

interface VehicleSelectorProps {
  currentType: VehicleType;
  onSelect: (type: VehicleType) => void;
}

export const VehicleSelector: React.FC<VehicleSelectorProps> = ({ currentType, onSelect }) => {
  const options: { type: VehicleType; label: string; icon: React.ReactNode }[] = [
    { type: 'Vehicle', label: 'Vehicle', icon: <Layers className="w-3.5 h-3.5" /> },
    { type: 'Car', label: 'Car', icon: <Flame className="w-3.5 h-3.5" /> },
    { type: 'ElectricCar', label: 'ElectricCar', icon: <Zap className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="bg-slate-100/90 p-1 rounded-xl border border-slate-200 flex items-center space-x-1 shadow-sm">
      {options.map((opt) => {
        const isSelected = currentType === opt.type;
        return (
          <button
            key={opt.type}
            type="button"
            onClick={() => onSelect(opt.type)}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
              isSelected
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
            }`}
          >
            {opt.icon}
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
};
