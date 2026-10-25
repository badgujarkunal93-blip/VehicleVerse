export type VehicleType = 'Vehicle' | 'Car' | 'ElectricCar';

export type SimulationStatus = 'READY' | 'RUNNING' | 'PAUSED';

export type EngineState = 'OFF' | 'IDLE' | 'ACCELERATING' | 'CRUISING' | 'BRAKING';

export interface VehicleState {
  type: VehicleType;
  speed: number;          // km/h (0 to maxSpeed)
  maxSpeed: number;       // km/h
  distance: number;       // km travelled
  fuelLevel: number;      // % (0-100) for Car, N/A for Vehicle/ElectricCar
  batteryLevel: number;   // % (0-100) for ElectricCar, N/A for Vehicle/Car
  isEngineOn: boolean;
  cruiseControl: boolean;
  cruiseTargetSpeed: number;
  engineState: EngineState;
}

export type CodeFocusTarget = 
  | 'class_declaration'
  | 'constructor'
  | 'accelerate'
  | 'brake'
  | 'refuel'
  | 'charge'
  | 'display_info'
  | 'protected_members'
  | 'inheritance_syntax'
  | 'main_execution';

export interface CodeFocusState {
  target: CodeFocusTarget;
  title: string;
  explanation: string;
  highlightLines?: number[];
  targetClass: VehicleType | 'Complete';
}

export interface SimulationEvent {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  type: 'info' | 'action' | 'warning' | 'success';
  cppCodeSnippet?: string;
}

export interface TelemetryPoint {
  time: string;
  speed: number;
  energyLevel: number; // fuel or battery level or throttle
}

export type ActiveTab = 'simulation' | 'inheritance' | 'execution' | 'learning' | 'quiz';
