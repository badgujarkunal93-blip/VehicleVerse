import { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';

interface ConceptTopic {
  id: string;
  question: string;
  summary: string;
  detailedText: string[];
  cppSnippet: string;
}

export const LearningPanel: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string>('c1');

  const topics: ConceptTopic[] = [
    {
      id: 'c1',
      question: 'What is a Base Class?',
      summary: 'The existing class whose properties and member functions are inherited by other classes.',
      detailedText: [
        'In our hierarchy, Vehicle is the base class (root).',
        'It encapsulates generic state that all vehicles share: speed, isRunning, and maxSpeed.',
        'Using protected access specifiers allows derived classes direct access while encapsulating state from external code.'
      ],
      cppSnippet: `class Vehicle {
protected:
    double speed;
    bool isRunning;
public:
    Vehicle() : speed(0.0), isRunning(false) {}
    virtual void accelerate(double delta);
};`
    },
    {
      id: 'c2',
      question: 'What is a Derived Class?',
      summary: 'A new class created from an existing base class that inherits its capabilities and adds new features.',
      detailedText: [
        'Car and ElectricCar are derived classes.',
        'Car inherits foundational vehicle attributes and introduces fuelLevel.',
        'ElectricCar derives from Car and introduces batteryLevel.'
      ],
      cppSnippet: `// Car is derived from base class Vehicle
class Car : public Vehicle {
protected:
    double fuelLevel; // Newly added attribute
public:
    void refuel(double amount);
};`
    },
    {
      id: 'c3',
      question: 'What is Single Inheritance?',
      summary: 'When a class inherits from exactly one direct base class (Vehicle → Car).',
      detailedText: [
        'Single inheritance models a straightforward "is-a" relationship.',
        'A Car is-a Vehicle. It has all characteristics of Vehicle plus specialized combustion fuel behavior.',
        'Syntax: class Derived : access-specifier Base'
      ],
      cppSnippet: `// SINGLE INHERITANCE
class Car : public Vehicle {
    // Inherits: speed, isRunning, maxSpeed, brake()
    // Introduces: fuelLevel, refuel()
};`
    },
    {
      id: 'c4',
      question: 'What is Multilevel Inheritance?',
      summary: 'When a derived class inherits from another derived class (Vehicle → Car → ElectricCar).',
      detailedText: [
        'Multilevel inheritance forms a grandfather-father-child inheritance chain.',
        'ElectricCar inherits directly from Car, and indirectly from Vehicle.',
        'ElectricCar has access to speed (from Vehicle), fuel properties (from Car), and adds batteryLevel.'
      ],
      cppSnippet: `// MULTILEVEL INHERITANCE: Vehicle -> Car -> ElectricCar
class ElectricCar : public Car {
    // Inherited from Vehicle: speed, isRunning
    // Inherited from Car: fuelLevel
    // Introduced in ElectricCar: batteryLevel, chargeBattery()
};`
    },
    {
      id: 'c5',
      question: 'What is Inherited by Car from Vehicle?',
      summary: 'All public and protected members of Vehicle are inherited by Car.',
      detailedText: [
        'Protected data members: speed, isRunning, maxSpeed.',
        'Public member functions: startEngine(), stopEngine(), brake(), accelerate(), displayInfo().',
        'Car overrides accelerate() to burn fuel, but calls Vehicle::accelerate() internally to update speed.'
      ],
      cppSnippet: `void Car::accelerate(double delta) {
    Vehicle::accelerate(delta); // Re-use base class speed logic
    fuelLevel -= 2.5;           // Add derived fuel consumption
}`
    },
    {
      id: 'c6',
      question: 'What Additional Members does ElectricCar Introduce?',
      summary: 'High-voltage EV state: batteryLevel, chargeBattery(), and regenerative braking.',
      detailedText: [
        'Introduces protected double batteryLevel (0.0 to 100.0%).',
        'Introduces public void chargeBattery(double amount).',
        'Introduces regenerative braking logic in brake() that restores kinetic energy to batteryLevel.'
      ],
      cppSnippet: `void ElectricCar::brake(double delta) {
    Car::brake(delta);
    if (speed > 0) batteryLevel += 0.5; // KERS regenerative charge
}`
    },
    {
      id: 'c7',
      question: 'Why Use Public Inheritance Here?',
      summary: 'Public inheritance represents an "is-a" relationship preserving access levels.',
      detailedText: [
        'Public inheritance means public members of the base remain public in the derived class.',
        'Protected members remain protected in the derived class.',
        'This allows client code to treat a Car or ElectricCar as a Vehicle (Liskov Substitution Principle).'
      ],
      cppSnippet: `// Public inheritance preserves interface
Vehicle* v = new ElectricCar(0.0, 100.0);
v->startEngine();
v->accelerate(); // Polymorphic invocation`
    }
  ];

  return (
    <div className="bg-graphite-900 border border-slate-800 rounded-lg p-4 shadow-xl flex flex-col gap-4">
      {/* Header */}
      <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-cyan" />
            C++ OOP Inheritance Concepts Reference
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Core theoretical principles required for the Vehicle Hierarchy college assignment.
          </p>
        </div>
        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan/10 border border-cyan/30 text-cyan">
          {topics.length} Key Topics
        </span>
      </div>

      {/* Accordion List */}
      <div className="space-y-2.5">
        {topics.map((t) => {
          const isExpanded = expandedId === t.id;
          return (
            <div
              key={t.id}
              className="rounded-lg border border-slate-800 bg-graphite-950/60 overflow-hidden transition-all duration-200"
            >
              <button
                type="button"
                onClick={() => setExpandedId(isExpanded ? '' : t.id)}
                className="w-full p-3 text-left flex items-center justify-between hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-center space-x-2.5">
                  <span className="w-5 h-5 rounded-full bg-cyan/10 text-cyan border border-cyan/30 text-xs font-mono font-bold flex items-center justify-center">
                    {t.id.replace('c', '')}
                  </span>
                  <span className="font-semibold text-sm text-slate-200">
                    {t.question}
                  </span>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-cyan" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                )}
              </button>

              {isExpanded && (
                <div className="p-3.5 pt-0 border-t border-slate-800/60 text-xs text-slate-300 space-y-3">
                  <p className="font-medium text-cyan leading-relaxed">
                    {t.summary}
                  </p>

                  <ul className="space-y-1.5 pl-1">
                    {t.detailedText.map((dt, idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-slate-400">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{dt}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="p-2.5 rounded bg-graphite-900 border border-slate-800 font-mono text-[11px] text-cyan overflow-x-auto">
                    <pre>{t.cppSnippet}</pre>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
