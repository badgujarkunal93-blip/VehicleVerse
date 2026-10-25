# VEHICLEVERSE — Interactive C++ Vehicle Inheritance Simulator

> **"Understand Inheritance. Experience the Drive."**  
> An interactive educational web application and automotive digital-twin laboratory demonstrating **C++ Single and Multilevel Inheritance** through a real-time 3D simulation.

---

## 🏎️ Core Architectural Overview

VEHICLEVERSE implements the classic OOP **Vehicle Hierarchy** designed for college computer science classrooms:

```
Vehicle (Base Class)
  └── Car : public Vehicle (Single Inheritance)
        └── ElectricCar : public Car (Multilevel Inheritance)
```

### 1. Class Hierarchy Specifications

| Class | Inheritance Type | Attributes Introduced | Attributes Inherited | Specialized Operations |
| :--- | :--- | :--- | :--- | :--- |
| **`Vehicle`** | Root Base Class | `speed`, `isRunning`, `maxSpeed` | *None (Root)* | `startEngine()`, `stopEngine()`, `accelerate()`, `brake()`, `displayInfo()` |
| **`Car`** | Single Inheritance (`: public Vehicle`) | `fuelLevel` | `speed`, `isRunning`, `maxSpeed` | `refuel()`, overridden `accelerate()` (burns fuel), `displayInfo()` |
| **`ElectricCar`** | Multilevel Inheritance (`: public Car`) | `batteryLevel`, `regenerativeBraking` | `speed`, `isRunning`, `fuelLevel` | `chargeBattery()`, overridden `accelerate()` (dual EV torque), `brake()` (KERS kinetic energy recovery) |

---

## 🌟 Key Application Features

1. **Genuine 3D WebGL Simulation Stage**:
   - Built with **Three.js**, **React Three Fiber (`@react-three/fiber`)**, and **`@react-three/drei`**.
   - Procedural 3D vehicle geometries matching each hierarchy level:
     - **`Vehicle`**: Prototype tubular chassis & roll-cage frame with exposed engineering drivetrain.
     - **`Car`**: Combustion sports sedan with dual exhaust heat glow and fuel port.
     - **`ElectricCar`**: Aerodynamic cyber-EV with high-voltage battery underglow, laser lightbar, and charging port.
   - Interactive mouse OrbitControls with bounded cinematic angles.
   - 4 rotating wheels synchronized with current speed, moving road test track, dynamic headlights, and brake lights.

2. **Persistent C++ Code Explorer (Fixed Right-Hand Column)**:
   - Always visible on desktop alongside the 3D simulation workspace (63% / 37% layout).
   - Real, authentic C++17 source code with PrismJS syntax highlighting.
   - Tabs for `Vehicle.h`, `Car.h`, `ElectricCar.h`, and `Complete_main.cpp`.
   - **Dynamic Code Focus**: Clicking simulation controls (Accelerate, Brake, Start Engine, Refuel, Switch Vehicle) auto-scrolls and highlights the exact C++ methods and member variables executed.
   - **Copy Code** & **Download .cpp** file export functionality.

3. **Interactive UML Inheritance Map**:
   - 3-box UML class diagrams with 3 standard compartments: Class Name, Data Members, and Member Functions.
   - Proper UML hollow triangle arrowheads pointing up to base classes.
   - Visual tags distinguishing *Newly Introduced Members* vs *Inherited Members*.
   - Clickable nodes to switch the active vehicle in the 3D lab.

4. **Runtime Execution Flow Visualizer**:
   - Animated flowchart tracing object lifecycle from `main()` to destruction.
   - Explains **Constructor Execution Order** (`Vehicle()` runs 1st → `Car()` runs 2nd → `ElectricCar()` runs 3rd).
   - Explains **Destructor Execution Order** in strict reverse order (`~ElectricCar()` → `~Car()` → `~Vehicle()`).

5. **OOP Concepts Reference & Interactive Quiz**:
   - Deep dive on base classes, derived classes, `protected` access specifiers, and member initializer lists.
   - 6-question multiple choice quiz with immediate answer feedback, explanations, and confetti score celebration.

6. **Automotive Telemetry & Spark-Charts**:
   - Digital gauges for Velocity (km/h), Odometer (km), Fuel/Battery capacity, and Drivetrain state.
   - Real-time Recharts area chart capturing velocity telemetry over time.
   - Terminal event log with C++ equivalent statements.

---

## 🛠️ Technology Stack

- **Framework**: React 18 + Vite 5
- **Language**: TypeScript
- **Styling**: Tailwind CSS (Custom Dark Graphite & Cyan Automotive Theme)
- **3D Graphics**: Three.js + React Three Fiber (`@react-three/fiber`) + `@react-three/drei`
- **Charts & UI Icons**: Recharts + Lucide React + Canvas Confetti
- **Syntax Highlighting**: PrismJS

---

## 🚀 Local Development Setup

To run VEHICLEVERSE locally on your computer:

```bash
# 1. Clone repository or navigate to project directory
cd "Vehicle Heirarchy"

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev

# 4. Open in browser
# Visit http://localhost:5173
```

To create and preview a production build:
```bash
npm run build
npm run preview
```

---

## 🌐 Vercel Deployment Instructions

VEHICLEVERSE is pre-configured for one-click deployment on **Vercel**:

### Option 1: Deploy with Vercel CLI
```bash
# Install Vercel CLI (if not already installed)
npm install -g vercel

# Run vercel deploy in the project directory
vercel
```

### Option 2: Deploy via Vercel Web Dashboard
1. Push your repository to GitHub, GitLab, or Bitbucket.
2. Go to [vercel.com/new](https://vercel.com/new) and import your repository.
3. Configure settings (auto-detected by Vite):
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
4. Click **Deploy**.

> Note: The included `vercel.json` already includes the SPA rewrite rule (`/(.*) -> /index.html`) so routing works out of the box with zero additional configuration or environment variables.
