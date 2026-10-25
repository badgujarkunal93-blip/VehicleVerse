import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  VehicleType, 
  VehicleState, 
  SimulationStatus, 
  CodeFocusState, 
  SimulationEvent,
  TelemetryPoint 
} from '../types/vehicle';

export function useVehicleSimulation() {
  const [vehicleType, setVehicleType] = useState<VehicleType>('Car');
  const [simulationStatus, setSimulationStatus] = useState<SimulationStatus>('READY');
  
  const [state, setState] = useState<VehicleState>({
    type: 'Car',
    speed: 0,
    maxSpeed: 180,
    distance: 0,
    fuelLevel: 85,
    batteryLevel: 90,
    isEngineOn: true,
    cruiseControl: false,
    cruiseTargetSpeed: 60,
    engineState: 'IDLE'
  });

  const [codeFocus, setCodeFocus] = useState<CodeFocusState>({
    target: 'class_declaration',
    title: 'Car : public Vehicle',
    explanation: 'Single Inheritance active: Car inherits speed, maxSpeed, and methods from Vehicle while adding fuelLevel.',
    targetClass: 'Car'
  });

  const [events, setEvents] = useState<SimulationEvent[]>([
    {
      id: 'init-1',
      timestamp: new Date().toLocaleTimeString(),
      title: 'Simulation Initialized',
      description: 'Vehicle hierarchy loaded: Vehicle -> Car -> ElectricCar.',
      type: 'info',
      cppCodeSnippet: 'Car sedan(0.0, 85.0); // Derived constructor called'
    }
  ]);

  const [telemetryHistory, setTelemetryHistory] = useState<TelemetryPoint[]>([
    { time: '0s', speed: 0, energyLevel: 85 }
  ]);

  const throttleActiveRef = useRef(false);
  const brakeActiveRef = useRef(false);
  const animationFrameRef = useRef<number | null>(null);
  const lastTickTimeRef = useRef<number>(performance.now());
  const telemetryTickCounterRef = useRef<number>(0);

  const addEvent = useCallback((event: Omit<SimulationEvent, 'id' | 'timestamp'>) => {
    setEvents(prev => [
      {
        ...event,
        id: Math.random().toString(36).substring(2, 9),
        timestamp: new Date().toLocaleTimeString()
      },
      ...prev.slice(0, 35) // Keep bounded to 35 entries
    ]);
  }, []);

  const clearEvents = useCallback(() => {
    setEvents([]);
  }, []);

  // Switch Vehicle Type
  const selectVehicleType = useCallback((newType: VehicleType) => {
    setVehicleType(newType);
    let maxSpd = 120;
    if (newType === 'Car') maxSpd = 180;
    if (newType === 'ElectricCar') maxSpd = 220;

    setState(prev => ({
      ...prev,
      type: newType,
      maxSpeed: maxSpd,
      speed: 0,
      engineState: prev.isEngineOn ? 'IDLE' : 'OFF',
      cruiseControl: false
    }));

    if (newType === 'Vehicle') {
      setCodeFocus({
        target: 'class_declaration',
        title: 'Base Class: Vehicle',
        explanation: 'The root base class declaring protected attributes: speed, isRunning, and virtual methods.',
        targetClass: 'Vehicle'
      });
      addEvent({
        title: 'Vehicle Base Selected',
        description: 'Instantiated Vehicle base class object. Base speed and operational methods ready.',
        type: 'info',
        cppCodeSnippet: 'Vehicle* v = new Vehicle(0.0, 120.0);'
      });
    } else if (newType === 'Car') {
      setCodeFocus({
        target: 'inheritance_syntax',
        title: 'Single Inheritance: Car : public Vehicle',
        explanation: 'Car derives publicly from Vehicle, inheriting speed and adding fuelLevel (Combustion Engine).',
        targetClass: 'Car'
      });
      addEvent({
        title: 'Car Derived Class Selected',
        description: 'Single inheritance demonstrated. Car inherits speed and adds fuelLevel attribute.',
        type: 'info',
        cppCodeSnippet: 'class Car : public Vehicle { protected: double fuelLevel; };'
      });
    } else {
      setCodeFocus({
        target: 'inheritance_syntax',
        title: 'Multilevel Inheritance: ElectricCar : public Car',
        explanation: 'ElectricCar derives from Car (which derives from Vehicle). Adds high-voltage batteryLevel & regenerative braking.',
        targetClass: 'ElectricCar'
      });
      addEvent({
        title: 'ElectricCar Multilevel Selected',
        description: 'Multilevel inheritance: Vehicle -> Car -> ElectricCar. All attributes and methods chain together.',
        type: 'info',
        cppCodeSnippet: 'class ElectricCar : public Car { protected: double batteryLevel; };'
      });
    }
  }, [addEvent]);

  // Start / Stop Engine or Motor
  const toggleEngine = useCallback(() => {
    setState(prev => {
      const nextState = !prev.isEngineOn;
      const newEngineState = nextState ? (prev.speed > 0 ? 'ACCELERATING' : 'IDLE') : 'OFF';

      if (nextState) {
        addEvent({
          title: prev.type === 'ElectricCar' ? 'EV Motor Activated' : 'Engine Started',
          description: prev.type === 'ElectricCar' 
            ? 'High-voltage contactors closed. Dual motors armed.' 
            : 'Ignition on. Internal combustion idle.',
          type: 'success',
          cppCodeSnippet: `${prev.type.toLowerCase()}Obj.startEngine(); // isRunning = true`
        });
        setCodeFocus({
          target: 'class_declaration',
          title: 'startEngine() Invoked',
          explanation: 'Modifies protected bool isRunning = true (inherited from base Vehicle).',
          targetClass: prev.type
        });
      } else {
        addEvent({
          title: 'Drivetrain Powered Off',
          description: 'Engine stopped. Speed rolling to zero.',
          type: 'warning',
          cppCodeSnippet: `${prev.type.toLowerCase()}Obj.stopEngine(); // isRunning = false`
        });
      }

      return {
        ...prev,
        isEngineOn: nextState,
        engineState: newEngineState,
        cruiseControl: nextState ? prev.cruiseControl : false,
        speed: nextState ? prev.speed : Math.max(0, prev.speed - 5)
      };
    });
  }, [addEvent]);

  // Accelerate action trigger (discrete pulse or continuous)
  const accelerate = useCallback(() => {
    setState(prev => {
      if (!prev.isEngineOn) {
        addEvent({
          title: 'Ignition Required',
          description: 'Cannot accelerate: Drivetrain is OFF! Start engine/motor first.',
          type: 'warning',
          cppCodeSnippet: '// Checked !isRunning in Vehicle::accelerate()'
        });
        return prev;
      }

      // Check fuel or battery limits
      if (prev.type === 'Car' && prev.fuelLevel <= 0) {
        addEvent({
          title: 'Fuel Tank Depleted',
          description: 'Out of gasoline! Refuel Car to resume acceleration.',
          type: 'warning',
          cppCodeSnippet: 'if (fuelLevel <= 0.0) { stopEngine(); }'
        });
        return { ...prev, isEngineOn: false, engineState: 'OFF', cruiseControl: false };
      }

      if (prev.type === 'ElectricCar' && prev.batteryLevel <= 0) {
        addEvent({
          title: 'EV Battery Depleted',
          description: 'Charge battery to engage electric propulsion.',
          type: 'warning',
          cppCodeSnippet: 'if (batteryLevel <= 0.0) { stopEngine(); }'
        });
        return { ...prev, isEngineOn: false, engineState: 'OFF', cruiseControl: false };
      }

      const accelRate = prev.type === 'ElectricCar' ? 12 : (prev.type === 'Car' ? 8 : 6);
      const newSpeed = Math.min(prev.maxSpeed, prev.speed + accelRate);
      
      const fuelDrain = prev.type === 'Car' ? 1.5 : 0;
      const batteryDrain = prev.type === 'ElectricCar' ? 1.2 : 0;

      return {
        ...prev,
        speed: newSpeed,
        fuelLevel: Math.max(0, prev.fuelLevel - fuelDrain),
        batteryLevel: Math.max(0, prev.batteryLevel - batteryDrain),
        engineState: 'ACCELERATING'
      };
    });

    setCodeFocus({
      target: 'accelerate',
      title: 'accelerate() Called',
      explanation: `${vehicleType}::accelerate() invoked. Overridden in derived classes to modify speed and burn fuel/battery.`,
      targetClass: vehicleType
    });

    setSimulationStatus('RUNNING');
  }, [vehicleType, addEvent]);

  // Brake action trigger
  const brake = useCallback(() => {
    setState(prev => {
      const brakePower = 14;
      const newSpeed = Math.max(0, prev.speed - brakePower);
      
      // Regenerative braking for ElectricCar!
      let newBattery = prev.batteryLevel;
      if (prev.type === 'ElectricCar' && prev.speed > 5 && prev.batteryLevel < 100) {
        newBattery = Math.min(100, prev.batteryLevel + 0.4);
      }

      return {
        ...prev,
        speed: newSpeed,
        batteryLevel: newBattery,
        engineState: newSpeed > 0 ? 'BRAKING' : (prev.isEngineOn ? 'IDLE' : 'OFF'),
        cruiseControl: false // Braking disengages cruise control
      };
    });

    setCodeFocus({
      target: 'brake',
      title: 'brake() Invoked',
      explanation: vehicleType === 'ElectricCar' 
        ? 'ElectricCar::brake() calls Car::brake() and recovers kinetic energy via KERS regenerative recovery (+0.4%).'
        : `${vehicleType}::brake() decelerates vehicle by decrementing speed safely.`,
      targetClass: vehicleType
    });
  }, [vehicleType]);

  // Refuel Car
  const refuel = useCallback(() => {
    setState(prev => {
      if (prev.type !== 'Car') return prev;
      const newFuel = Math.min(100, prev.fuelLevel + 30);
      addEvent({
        title: 'Car Refueled',
        description: `Gasoline tank refilled to ${newFuel.toFixed(0)}%.`,
        type: 'success',
        cppCodeSnippet: 'car.refuel(30.0); // Car specific member method'
      });
      return { ...prev, fuelLevel: newFuel };
    });

    setCodeFocus({
      target: 'refuel',
      title: 'Car::refuel(30.0) Called',
      explanation: 'refuel() is a specialized member function introduced in the Car derived class.',
      targetClass: 'Car'
    });
  }, [addEvent]);

  // Charge ElectricCar
  const chargeBattery = useCallback(() => {
    setState(prev => {
      if (prev.type !== 'ElectricCar') return prev;
      const newBatt = Math.min(100, prev.batteryLevel + 25);
      addEvent({
        title: 'EV Fast-Charged',
        description: `Lithium-ion battery pack charged to ${newBatt.toFixed(0)}%.`,
        type: 'success',
        cppCodeSnippet: 'electricCar.chargeBattery(25.0); // Member method'
      });
      return { ...prev, batteryLevel: newBatt };
    });

    setCodeFocus({
      target: 'charge',
      title: 'ElectricCar::chargeBattery(25.0)',
      explanation: 'chargeBattery() is introduced in the multilevel derived ElectricCar class.',
      targetClass: 'ElectricCar'
    });
  }, [addEvent]);

  // Toggle Cruise Control
  const toggleCruiseControl = useCallback(() => {
    setState(prev => {
      if (!prev.isEngineOn || prev.speed <= 10) {
        addEvent({
          title: 'Cruise Control Unavailable',
          description: 'Requires running engine and speed > 10 km/h to engage.',
          type: 'warning'
        });
        return prev;
      }
      const nextCc = !prev.cruiseControl;
      addEvent({
        title: nextCc ? 'Cruise Control Engaged' : 'Cruise Control Disengaged',
        description: nextCc ? `Maintaining target velocity at ${Math.round(prev.speed)} km/h.` : 'Manual throttle restored.',
        type: 'info'
      });
      return {
        ...prev,
        cruiseControl: nextCc,
        cruiseTargetSpeed: Math.round(prev.speed)
      };
    });
  }, [addEvent]);

  // Reset Simulation
  const resetSimulation = useCallback(() => {
    setState({
      type: vehicleType,
      speed: 0,
      maxSpeed: vehicleType === 'ElectricCar' ? 220 : (vehicleType === 'Car' ? 180 : 120),
      distance: 0,
      fuelLevel: 85,
      batteryLevel: 90,
      isEngineOn: true,
      cruiseControl: false,
      cruiseTargetSpeed: 60,
      engineState: 'IDLE'
    });
    setSimulationStatus('READY');
    addEvent({
      title: 'Simulation Reset',
      description: 'Chassis odometer, velocity, and telemetry returned to initial state.',
      type: 'info',
      cppCodeSnippet: '// Object re-initialized'
    });
    setCodeFocus({
      target: 'constructor',
      title: 'Constructors Executed',
      explanation: `Constructor chain re-executed: ${vehicleType === 'ElectricCar' ? 'Vehicle() -> Car() -> ElectricCar()' : (vehicleType === 'Car' ? 'Vehicle() -> Car()' : 'Vehicle()')}.`,
      targetClass: vehicleType
    });
  }, [vehicleType, addEvent]);

  // Continuous Hold Throttle handlers
  const setThrottleActive = useCallback((active: boolean) => {
    throttleActiveRef.current = active;
  }, []);

  const setBrakeActive = useCallback((active: boolean) => {
    brakeActiveRef.current = active;
  }, []);

  // Main Simulation Physics Loop (deterministic 60fps rAF with delta-time)
  useEffect(() => {
    const tick = (now: number) => {
      const deltaSec = Math.min(0.1, (now - lastTickTimeRef.current) / 1000);
      lastTickTimeRef.current = now;

      if (simulationStatus !== 'PAUSED') {
        setState(prev => {
          let currentSpeed = prev.speed;
          let currentFuel = prev.fuelLevel;
          let currentBattery = prev.batteryLevel;
          let currentDistance = prev.distance;
          let currentEngineState = prev.engineState;

          // 1. If brake active
          if (brakeActiveRef.current) {
            currentSpeed = Math.max(0, currentSpeed - 35 * deltaSec);
            if (prev.type === 'ElectricCar' && currentSpeed > 5 && currentBattery < 100) {
              currentBattery = Math.min(100, currentBattery + 1.2 * deltaSec);
            }
            currentEngineState = currentSpeed > 0 ? 'BRAKING' : (prev.isEngineOn ? 'IDLE' : 'OFF');
          } 
          // 2. If throttle active
          else if (throttleActiveRef.current && prev.isEngineOn) {
            const hasEnergy = (prev.type === 'Car' && currentFuel > 0) || 
                              (prev.type === 'ElectricCar' && currentBattery > 0) || 
                              prev.type === 'Vehicle';

            if (hasEnergy) {
              const accelRate = prev.type === 'ElectricCar' ? 32 : (prev.type === 'Car' ? 24 : 18);
              currentSpeed = Math.min(prev.maxSpeed, currentSpeed + accelRate * deltaSec);
              
              if (prev.type === 'Car') {
                currentFuel = Math.max(0, currentFuel - 2.8 * deltaSec);
              } else if (prev.type === 'ElectricCar') {
                currentBattery = Math.max(0, currentBattery - 2.2 * deltaSec);
              }
              currentEngineState = 'ACCELERATING';
            } else {
              currentEngineState = 'OFF';
            }
          }
          // 3. Cruise Control
          else if (prev.cruiseControl && prev.isEngineOn) {
            if (currentSpeed < prev.cruiseTargetSpeed) {
              currentSpeed = Math.min(prev.cruiseTargetSpeed, currentSpeed + 15 * deltaSec);
            } else if (currentSpeed > prev.cruiseTargetSpeed) {
              currentSpeed = Math.max(prev.cruiseTargetSpeed, currentSpeed - 12 * deltaSec);
            }
            if (prev.type === 'Car') currentFuel = Math.max(0, currentFuel - 1.2 * deltaSec);
            if (prev.type === 'ElectricCar') currentBattery = Math.max(0, currentBattery - 0.9 * deltaSec);
            currentEngineState = 'CRUISING';
          }
          // 4. Natural deceleration / rolling friction
          else {
            if (currentSpeed > 0) {
              currentSpeed = Math.max(0, currentSpeed - 8 * deltaSec);
              currentEngineState = currentSpeed > 0 ? 'CRUISING' : (prev.isEngineOn ? 'IDLE' : 'OFF');
            } else {
              currentEngineState = prev.isEngineOn ? 'IDLE' : 'OFF';
            }
          }

          // Accumulate distance (speed in km/h -> km travelled)
          currentDistance += (currentSpeed / 3600) * deltaSec;

          return {
            ...prev,
            speed: currentSpeed,
            fuelLevel: currentFuel,
            batteryLevel: currentBattery,
            distance: currentDistance,
            engineState: currentEngineState
          };
        });

        // Telemetry point recording every ~1 second
        telemetryTickCounterRef.current += deltaSec;
        if (telemetryTickCounterRef.current >= 0.8) {
          telemetryTickCounterRef.current = 0;
          setTelemetryHistory(hist => {
            const nextTime = `${(hist.length * 0.8).toFixed(0)}s`;
            return [
              ...hist.slice(-18),
              {
                time: nextTime,
                speed: Math.round(state.speed),
                energyLevel: Math.round(state.type === 'ElectricCar' ? state.batteryLevel : state.fuelLevel)
              }
            ];
          });
        }
      }

      animationFrameRef.current = requestAnimationFrame(tick);
    };

    animationFrameRef.current = requestAnimationFrame(tick);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [simulationStatus, state.speed, state.type, state.batteryLevel, state.fuelLevel]);

  return {
    vehicleType,
    selectVehicleType,
    simulationStatus,
    setSimulationStatus,
    state,
    codeFocus,
    setCodeFocus,
    events,
    telemetryHistory,
    accelerate,
    brake,
    refuel,
    chargeBattery,
    toggleEngine,
    toggleCruiseControl,
    resetSimulation,
    setThrottleActive,
    setBrakeActive,
    clearEvents
  };
}
