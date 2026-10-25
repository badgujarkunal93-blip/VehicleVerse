export interface ClassCodeDefinition {
  className: string;
  filename: string;
  inheritanceType: string;
  description: string;
  code: string;
  focusLineRanges: Record<string, { lines: number[]; explanation: string }>;
}

export const CPP_CLASSES: Record<'Vehicle' | 'Car' | 'ElectricCar', ClassCodeDefinition> = {
  Vehicle: {
    className: 'Vehicle',
    filename: 'Vehicle.h',
    inheritanceType: 'Base Class (Root of Hierarchy)',
    description: 'The foundation class containing common state (speed, isRunning) and fundamental operations inherited by all vehicles.',
    code: `// ==========================================
// Base Class: Vehicle
// Common attributes & foundational methods
// ==========================================
#ifndef VEHICLE_H
#define VEHICLE_H

#include <iostream>
#include <iomanip>
#include <string>

class Vehicle {
protected:
    // Protected members are accessible by derived classes (Car, ElectricCar)
    double speed;        // Current speed in km/h
    bool isRunning;      // Engine / motor operational status
    double maxSpeed;     // Terminal velocity limit (km/h)

public:
    // Default Constructor
    Vehicle() : speed(0.0), isRunning(false), maxSpeed(120.0) {
        std::cout << "[Vehicle] Base constructor: Chassis initialized\\n";
    }

    // Parameterized Constructor
    Vehicle(double initialSpeed, double maxSpd = 120.0) 
        : speed(initialSpeed), isRunning(false), maxSpeed(maxSpd) {
        std::cout << "[Vehicle] Base constructor with speed: " << speed << " km/h\\n";
    }

    // Virtual Destructor ensures proper cleanup in inheritance hierarchies
    virtual ~Vehicle() {
        std::cout << "[Vehicle] Base destructor: Chassis released\\n";
    }

    // Fundamental Vehicle Operations
    virtual void startEngine() {
        isRunning = true;
        std::cout << "[Vehicle] Drivetrain active. Ready to drive.\\n";
    }

    virtual void stopEngine() {
        isRunning = false;
        speed = 0.0;
        std::cout << "[Vehicle] Drivetrain powered down.\\n";
    }

    virtual void accelerate(double delta = 15.0) {
        if (!isRunning) {
            std::cout << "[Vehicle] Cannot accelerate: Engine is OFF!\\n";
            return;
        }
        speed += delta;
        if (speed > maxSpeed) speed = maxSpeed;
        std::cout << "[Vehicle] Accelerating! Speed: " << speed << " km/h\\n";
    }

    virtual void brake(double delta = 20.0) {
        speed -= delta;
        if (speed < 0.0) speed = 0.0;
        std::cout << "[Vehicle] Braking applied. Speed: " << speed << " km/h\\n";
    }

    // Polymorphic display method
    virtual void displayInfo() const {
        std::cout << "--- [Vehicle Base Telemetry] ---\\n"
                  << "Speed: " << speed << " / " << maxSpeed << " km/h | "
                  << "Status: " << (isRunning ? "ACTIVE" : "OFF") << "\\n";
    }

    // Getters
    double getSpeed() const { return speed; }
    bool getIsRunning() const { return isRunning; }
};

#endif // VEHICLE_H`,
    focusLineRanges: {
      class_declaration: {
        lines: [11, 12, 13, 14, 15, 16, 17],
        explanation: 'Vehicle declares protected data members: speed, isRunning, and maxSpeed. "protected" allows derived classes to access them directly.'
      },
      constructor: {
        lines: [19, 20, 21, 22, 24, 25, 26, 27],
        explanation: 'Base constructor initializes foundational state (speed = 0.0, isRunning = false) using C++ member initializer lists.'
      },
      accelerate: {
        lines: [42, 43, 44, 45, 46, 47, 48, 49, 50],
        explanation: 'Base accelerate() method increases speed up to maxSpeed if the engine is running.'
      },
      brake: {
        lines: [52, 53, 54, 55, 56],
        explanation: 'Base brake() method decrements speed safely down to 0 km/h.'
      },
      display_info: {
        lines: [58, 59, 60, 61, 62, 63],
        explanation: 'virtual displayInfo() method prints baseline vehicle telemetry to std::cout.'
      }
    }
  },

  Car: {
    className: 'Car',
    filename: 'Car.h',
    inheritanceType: 'Single Inheritance: Car : public Vehicle',
    description: 'Inherits all properties of Vehicle and introduces internal combustion attributes (fuelLevel, refuel).',
    code: `// ==========================================
// Derived Class: Car (Single Inheritance)
// Inherits publicly from Vehicle
// Introduces internal combustion fuel attributes
// ==========================================
#ifndef CAR_H
#define CAR_H

#include "Vehicle.h"

// SINGLE INHERITANCE: Car inherits all public & protected members of Vehicle
class Car : public Vehicle {
protected:
    // Newly introduced attribute in Car
    double fuelLevel; // Fuel percentage (0.0 to 100.0%)

public:
    // Default Constructor: Delegates base initialization to Vehicle()
    Car() : Vehicle(0.0, 180.0), fuelLevel(100.0) {
        std::cout << "[Car] Derived constructor: Combustion fuel tank initialized\\n";
    }

    // Parameterized Constructor: Passes speed to base Vehicle constructor
    Car(double initialSpeed, double initialFuel) 
        : Vehicle(initialSpeed, 180.0), fuelLevel(initialFuel) {
        std::cout << "[Car] Initialized with fuel: " << fuelLevel << "%\\n";
    }

    virtual ~Car() {
        std::cout << "[Car] Derived destructor: Fuel system safely drained\\n";
    }

    // Car-specific fuel management
    void refuel(double amount = 30.0) {
        fuelLevel += amount;
        if (fuelLevel > 100.0) fuelLevel = 100.0;
        std::cout << "[Car] Refueled + " << amount << "%. Tank: " << fuelLevel << "%\\n";
    }

    // Method Overriding: Consumes fuel when accelerating
    void accelerate(double delta = 18.0) override {
        if (!isRunning) {
            std::cout << "[Car] Start the ignition before driving!\\n";
            return;
        }
        if (fuelLevel <= 0.0) {
            std::cout << "[Car] Out of fuel! Cannot accelerate.\\n";
            stopEngine();
            return;
        }

        // Accelerate base speed & consume fuel
        Vehicle::accelerate(delta); // Call base class logic
        fuelLevel -= 2.5;           // Combustion fuel burn
        if (fuelLevel < 0.0) fuelLevel = 0.0;
        
        std::cout << "[Car] Combustion burn: Fuel remaining: " << fuelLevel << "%\\n";
    }

    // Extends displayInfo() to output fuel alongside inherited speed
    void displayInfo() const override {
        Vehicle::displayInfo(); // Output base telemetry (speed, status)
        std::cout << "Fuel Level: " << std::fixed << std::setprecision(1) 
                  << fuelLevel << "% [Combustion Engine]\\n";
    }

    // Getter
    double getFuelLevel() const { return fuelLevel; }
};

#endif // CAR_H`,
    focusLineRanges: {
      inheritance_syntax: {
        lines: [11, 12, 13, 14],
        explanation: '"class Car : public Vehicle" implements Single Inheritance. Car inherits speed, isRunning, and methods from Vehicle.'
      },
      class_declaration: {
        lines: [12, 13, 14, 15, 16],
        explanation: 'Car introduces protected double fuelLevel (0-100%). It retains protected access so ElectricCar can inherit it.'
      },
      constructor: {
        lines: [18, 19, 20, 21, 23, 24, 25, 26],
        explanation: 'Member initializer list delegates to base constructor: ": Vehicle(initialSpeed, 180.0), fuelLevel(initialFuel)". Base constructor executes first!'
      },
      accelerate: {
        lines: [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52],
        explanation: 'Overridden accelerate() checks fuelLevel, invokes Vehicle::accelerate(delta), and burns 2.5% fuel per throttle pulse.'
      },
      refuel: {
        lines: [30, 31, 32, 33, 34],
        explanation: 'Car introduces refuel() to replenish the internal combustion fuel tank.'
      },
      display_info: {
        lines: [54, 55, 56, 57, 58, 59],
        explanation: 'displayInfo() calls Vehicle::displayInfo() to reuse base code, then appends fuelLevel telemetry.'
      }
    }
  },

  ElectricCar: {
    className: 'ElectricCar',
    filename: 'ElectricCar.h',
    inheritanceType: 'Multilevel Inheritance: ElectricCar : public Car',
    description: 'Inherits from Car (which inherits from Vehicle). Adds high-voltage batteryLevel and electric regenerative drivetrain.',
    code: `// ==========================================
// Derived Class: ElectricCar (Multilevel Inheritance)
// Hierarchy: Vehicle -> Car -> ElectricCar
// Introduces EV battery pack & regenerative braking
// ==========================================
#ifndef ELECTRIC_CAR_H
#define ELECTRIC_CAR_H

#include "Car.h"

// MULTILEVEL INHERITANCE: ElectricCar inherits from Car, which inherits from Vehicle
class ElectricCar : public Car {
protected:
    // Newly introduced EV attribute
    double batteryLevel; // Battery percentage (0.0 to 100.0%)
    bool regenerativeBraking;

public:
    // Default Constructor: Chained constructor call
    // Order: Vehicle() -> Car() -> ElectricCar()
    ElectricCar() : Car(0.0, 0.0), batteryLevel(100.0), regenerativeBraking(true) {
        maxSpeed = 220.0; // Accessing protected member inherited from Vehicle
        std::cout << "[ElectricCar] Derived constructor: 100kWh Battery Pack online\\n";
    }

    // Parameterized Constructor
    ElectricCar(double initialSpeed, double initialBattery)
        : Car(initialSpeed, 0.0), batteryLevel(initialBattery), regenerativeBraking(true) {
        maxSpeed = 220.0;
        std::cout << "[ElectricCar] Initialized with battery: " << batteryLevel << "%\\n";
    }

    virtual ~ElectricCar() {
        std::cout << "[ElectricCar] Derived destructor: High-voltage system disconnected\\n";
    }

    // EV-specific charging method
    void chargeBattery(double amount = 25.0) {
        batteryLevel += amount;
        if (batteryLevel > 100.0) batteryLevel = 100.0;
        std::cout << "[ElectricCar] Fast-charge complete. Battery: " << batteryLevel << "%\\n";
    }

    // Overridden accelerate() for electric dual-motor torque
    void accelerate(double delta = 22.0) override {
        if (!isRunning) {
            std::cout << "[ElectricCar] Press START button to engage EV contactors!\\n";
            return;
        }
        if (batteryLevel <= 0.0) {
            std::cout << "[ElectricCar] Battery depleted! Vehicle shut down.\\n";
            stopEngine();
            return;
        }

        // Direct access to protected member speed inherited from Vehicle
        speed += delta;
        if (speed > maxSpeed) speed = maxSpeed;

        // Drain battery
        batteryLevel -= 2.0;
        if (batteryLevel < 0.0) batteryLevel = 0.0;

        std::cout << "[ElectricCar] Instant EV Torque! Speed: " << speed 
                  << " km/h | Battery: " << batteryLevel << "%\\n";
    }

    // Overridden brake() with regenerative braking recovery
    void brake(double delta = 20.0) override {
        Car::brake(delta); // Call inherited brake logic
        if (regenerativeBraking && batteryLevel < 100.0 && speed > 0.0) {
            batteryLevel += 0.5; // KERS kinetic energy recovery
            if (batteryLevel > 100.0) batteryLevel = 100.0;
            std::cout << "[ElectricCar] Regenerative braking recovered +0.5% charge!\\n";
        }
    }

    // Display info showing all 3 levels of the inheritance hierarchy
    void displayInfo() const override {
        std::cout << "=== [ElectricCar Multilevel Telemetry] ===\\n"
                  << "Inherited from Vehicle -> Speed: " << speed << " / " << maxSpeed << " km/h\\n"
                  << "Inherited from Car     -> Drivetrain: Active\\n"
                  << "Added by ElectricCar   -> Battery: " << batteryLevel << "% (Dual Motor EV)\\n";
    }

    // Getter
    double getBatteryLevel() const { return batteryLevel; }
};

#endif // ELECTRIC_CAR_H`,
    focusLineRanges: {
      inheritance_syntax: {
        lines: [11, 12, 13, 14],
        explanation: '"class ElectricCar : public Car" completes Multilevel Inheritance (Vehicle → Car → ElectricCar).'
      },
      class_declaration: {
        lines: [12, 13, 14, 15, 16],
        explanation: 'ElectricCar introduces batteryLevel and regenerativeBraking while inheriting speed (from Vehicle) and fuel capabilities (from Car).'
      },
      constructor: {
        lines: [18, 19, 20, 21, 22, 23, 24, 25, 26, 27],
        explanation: 'Constructor Chain Execution Order: 1. Vehicle() runs first, 2. Car() runs second, 3. ElectricCar() body executes last!'
      },
      accelerate: {
        lines: [40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57],
        explanation: 'accelerate() accesses protected "speed" inherited 2 levels up from Vehicle, and burns 2.0% battery charge.'
      },
      brake: {
        lines: [59, 60, 61, 62, 63, 64, 65, 66],
        explanation: 'Overridden brake() invokes Car::brake(delta) and adds kinetic energy recovery (+0.5% battery recharge).'
      },
      charge: {
        lines: [33, 34, 35, 36, 37],
        explanation: 'chargeBattery() is a member method exclusive to ElectricCar to recharge the high-voltage pack.'
      },
      display_info: {
        lines: [68, 69, 70, 71, 72, 73, 74],
        explanation: 'displayInfo() demonstrates how ElectricCar aggregates state from Vehicle (speed), Car (drivetrain), and ElectricCar (battery).'
      }
    }
  }
};

export const COMPLETE_CPP_PROGRAM = `// ============================================================================
// VEHICLEVERSE — C++ Single & Multilevel Inheritance Educational Demonstration
// Project: Vehicle Hierarchy (Vehicle -> Car -> ElectricCar)
// Demonstrating: speed, fuel, and battery attributes with inheritance
// Standard: C++14 / C++17 / C++20 Compilable
// ============================================================================

#include <iostream>
#include <iomanip>
#include <string>
#include <memory>
#include <vector>

// ----------------------------------------------------------------------------
// 1. BASE CLASS: Vehicle
// ----------------------------------------------------------------------------
class Vehicle {
protected:
    double speed;        // Inherited by Car and ElectricCar
    bool isRunning;      // Drivetrain operational state
    double maxSpeed;     // Velocity boundary

public:
    Vehicle(double initialSpeed = 0.0, double maxSpd = 120.0)
        : speed(initialSpeed), isRunning(false), maxSpeed(maxSpd) {
        std::cout << "  [CONSTRUCTOR] 1. Vehicle base initialized (speed: " << speed << ")\\n";
    }

    virtual ~Vehicle() {
        std::cout << "  [DESTRUCTOR]  3. Vehicle base destroyed\\n";
    }

    virtual void startEngine() {
        isRunning = true;
        std::cout << "  -> Vehicle engine started.\\n";
    }

    virtual void stopEngine() {
        isRunning = false;
        speed = 0.0;
        std::cout << "  -> Vehicle engine stopped.\\n";
    }

    virtual void accelerate(double delta = 15.0) {
        if (!isRunning) {
            std::cout << "  [!] Cannot accelerate: Engine is OFF!\\n";
            return;
        }
        speed += delta;
        if (speed > maxSpeed) speed = maxSpeed;
        std::cout << "  -> Vehicle speed accelerated to: " << speed << " km/h\\n";
    }

    virtual void brake(double delta = 20.0) {
        speed -= delta;
        if (speed < 0.0) speed = 0.0;
        std::cout << "  -> Vehicle brake applied. Speed: " << speed << " km/h\\n";
    }

    virtual void displayInfo() const {
        std::cout << "  [Telemetry] Speed: " << speed << " / " << maxSpeed << " km/h | "
                  << "Engine: " << (isRunning ? "RUNNING" : "STOPPED") << "\\n";
    }

    double getSpeed() const { return speed; }
};

// ----------------------------------------------------------------------------
// 2. SINGLE INHERITANCE: Car : public Vehicle
// ----------------------------------------------------------------------------
class Car : public Vehicle {
protected:
    double fuelLevel; // Introduced in Car (internal combustion)

public:
    Car(double initialSpeed = 0.0, double initialFuel = 100.0)
        : Vehicle(initialSpeed, 180.0), fuelLevel(initialFuel) {
        std::cout << "  [CONSTRUCTOR] 2. Car derived initialized (fuel: " << fuelLevel << "%)\\n";
    }

    virtual ~Car() {
        std::cout << "  [DESTRUCTOR]  2. Car derived destroyed\\n";
    }

    void refuel(double amount = 30.0) {
        fuelLevel += amount;
        if (fuelLevel > 100.0) fuelLevel = 100.0;
        std::cout << "  -> Refueled +" << amount << "%. Tank now: " << fuelLevel << "%\\n";
    }

    void accelerate(double delta = 18.0) override {
        if (!isRunning) {
            std::cout << "  [!] Car engine is OFF! Turn ignition first.\\n";
            return;
        }
        if (fuelLevel <= 0.0) {
            std::cout << "  [!] Out of fuel! Engine stalled.\\n";
            stopEngine();
            return;
        }
        Vehicle::accelerate(delta); // Re-use base class speed acceleration logic
        fuelLevel -= 2.5;           // Burn combustion fuel
        if (fuelLevel < 0.0) fuelLevel = 0.0;
        std::cout << "  -> Fuel consumed. Remaining fuel: " << fuelLevel << "%\\n";
    }

    void displayInfo() const override {
        Vehicle::displayInfo();
        std::cout << "  [Car Feature] Fuel Level: " << fuelLevel << "%\\n";
    }

    double getFuelLevel() const { return fuelLevel; }
};

// ----------------------------------------------------------------------------
// 3. MULTILEVEL INHERITANCE: ElectricCar : public Car
// ----------------------------------------------------------------------------
class ElectricCar : public Car {
protected:
    double batteryLevel; // Introduced in ElectricCar (EV battery)

public:
    ElectricCar(double initialSpeed = 0.0, double initialBattery = 100.0)
        : Car(initialSpeed, 0.0), batteryLevel(initialBattery) {
        maxSpeed = 220.0; // Accessing protected member inherited 2 levels up from Vehicle
        std::cout << "  [CONSTRUCTOR] 3. ElectricCar multilevel initialized (battery: " << batteryLevel << "%)\\n";
    }

    virtual ~ElectricCar() {
        std::cout << "  [DESTRUCTOR]  1. ElectricCar multilevel destroyed\\n";
    }

    void chargeBattery(double amount = 25.0) {
        batteryLevel += amount;
        if (batteryLevel > 100.0) batteryLevel = 100.0;
        std::cout << "  -> Fast-charged +" << amount << "%. Battery now: " << batteryLevel << "%\\n";
    }

    void accelerate(double delta = 22.0) override {
        if (!isRunning) {
            std::cout << "  [!] Electric motor is OFF! Press START.\\n";
            return;
        }
        if (batteryLevel <= 0.0) {
            std::cout << "  [!] Battery depleted! Electric drivetrain shut down.\\n";
            stopEngine();
            return;
        }
        speed += delta; // Accessing protected member 'speed' from Vehicle
        if (speed > maxSpeed) speed = maxSpeed;
        batteryLevel -= 2.0;
        if (batteryLevel < 0.0) batteryLevel = 0.0;
        std::cout << "  -> EV acceleration: " << speed << " km/h | Battery: " << batteryLevel << "%\\n";
    }

    void brake(double delta = 20.0) override {
        Car::brake(delta);
        if (batteryLevel < 100.0 && speed > 0.0) {
            batteryLevel += 0.5; // Regenerative KERS
            if (batteryLevel > 100.0) batteryLevel = 100.0;
            std::cout << "  -> Regenerative brake recovered +0.5% battery charge!\\n";
        }
    }

    void displayInfo() const override {
        std::cout << "  [ElectricCar Telemetry]\\n"
                  << "  - Speed (inherited from Vehicle): " << speed << " km/h\\n"
                  << "  - Drivetrain (inherited from Car): Active\\n"
                  << "  - Battery (ElectricCar member):   " << batteryLevel << "%\\n";
    }

    double getBatteryLevel() const { return batteryLevel; }
};

// ----------------------------------------------------------------------------
// MAIN FUNCTION: Demonstrates Hierarchy, Constructor/Destructor Chains & Polymorphism
// ----------------------------------------------------------------------------
int main() {
    std::cout << "=========================================================\\n";
    std::cout << " VEHICLEVERSE: C++ INHERITANCE HIERARCHY DEMO\\n";
    std::cout << "=========================================================\\n\\n";

    std::cout << ">>> DEMO 1: SINGLE INHERITANCE (Vehicle -> Car)\\n";
    {
        Car sedan(0.0, 75.0);
        sedan.startEngine();
        sedan.accelerate();
        sedan.brake();
        sedan.displayInfo();
    } // sedan goes out of scope here: destructor order Car -> Vehicle

    std::cout << "\\n>>> DEMO 2: MULTILEVEL INHERITANCE (Vehicle -> Car -> ElectricCar)\\n";
    {
        ElectricCar tesla(0.0, 90.0);
        tesla.startEngine();
        tesla.accelerate();
        tesla.brake();
        tesla.chargeBattery(10.0);
        tesla.displayInfo();
    } // tesla goes out of scope: destructor order ElectricCar -> Car -> Vehicle

    std::cout << "\\n>>> DEMO 3: RUNTIME POLYMORPHISM VIA BASE POINTER\\n";
    {
        std::vector<std::unique_ptr<Vehicle>> fleet;
        fleet.push_back(std::make_unique<Vehicle>(10.0));
        fleet.push_back(std::make_unique<Car>(0.0, 80.0));
        fleet.push_back(std::make_unique<ElectricCar>(0.0, 95.0));

        for (const auto& v : fleet) {
            v->startEngine();
            v->accelerate(20.0);
            v->displayInfo();
            std::cout << "-------------------------------------------\\n";
        }
    }

    std::cout << "\\nAll vehicles safely operated and memory deallocated.\\n";
    return 0;
}
`;
