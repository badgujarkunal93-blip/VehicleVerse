import React, { useRef, useMemo, Suspense, Component, ErrorInfo, ReactNode } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { VehicleType, EngineState } from '../../types/vehicle';

interface Vehicle3DProps {
  type: VehicleType;
  speed: number;
  engineState: EngineState;
  isEngineOn: boolean;
}

// ----------------------------------------------------------------------------
// Procedural Animated Road with moving markers & grid lines
// ----------------------------------------------------------------------------
function TrackEnvironment({ speed }: { speed: number }) {
  const roadMarkersRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (roadMarkersRef.current) {
      const moveDistance = (speed * 0.4) * delta;
      roadMarkersRef.current.position.z += moveDistance;
      // Loop the road markers smoothly
      if (roadMarkersRef.current.position.z > 8) {
        roadMarkersRef.current.position.z -= 8;
      }
    }
  });

  const markerPositions = useMemo(() => {
    const list: number[] = [];
    for (let z = -28; z <= 28; z += 4) {
      list.push(z);
    }
    return list;
  }, []);

  return (
    <group position={[0, -0.01, 0]}>
      {/* Asphalt Test Track */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 0]}>
        <planeGeometry args={[12, 60]} />
        <meshStandardMaterial color="#0d1117" roughness={0.85} metalness={0.15} />
      </mesh>

      {/* Track Side Curbs with tech glow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-6.05, 0.02, 0]}>
        <planeGeometry args={[0.2, 60]} />
        <meshBasicMaterial color="#00f2fe" transparent opacity={0.4} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[6.05, 0.02, 0]}>
        <planeGeometry args={[0.2, 60]} />
        <meshBasicMaterial color="#00f2fe" transparent opacity={0.4} />
      </mesh>

      {/* Moving Center Line Dashes */}
      <group ref={roadMarkersRef}>
        {markerPositions.map((z, idx) => (
          <mesh key={idx} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, z]}>
            <planeGeometry args={[0.22, 2.2]} />
            <meshBasicMaterial color="#38bdf8" transparent opacity={0.7} />
          </mesh>
        ))}
      </group>

      {/* Engineering Floor Grid */}
      <gridHelper args={[60, 40, '#00f2fe', '#162235']} position={[0, -0.02, 0]} />
    </group>
  );
}

// ----------------------------------------------------------------------------
// Procedural Wheel Component with Alloy Rims and Calipers
// ----------------------------------------------------------------------------
function Wheel({ position, isRight, speed }: { position: [number, number, number]; isRight: boolean; speed: number }) {
  const wheelGroupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (wheelGroupRef.current) {
      // Rotate proportional to speed
      const rotSpeed = (speed * 0.12) * delta;
      wheelGroupRef.current.rotation.x += rotSpeed;
    }
  });

  return (
    <group position={position}>
      <group ref={wheelGroupRef}>
        {/* Rubber Tire */}
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.38, 0.38, 0.28, 24]} />
          <meshStandardMaterial color="#11151c" roughness={0.9} metalness={0.1} />
        </mesh>
        {/* Alloy Rim */}
        <mesh rotation={[0, 0, Math.PI / 2]} position={[isRight ? 0.02 : -0.02, 0, 0]}>
          <cylinderGeometry args={[0.26, 0.26, 0.26, 16]} />
          <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Rim Center Cap Accent */}
        <mesh rotation={[0, 0, Math.PI / 2]} position={[isRight ? 0.15 : -0.15, 0, 0]}>
          <cylinderGeometry args={[0.09, 0.09, 0.04, 12]} />
          <meshStandardMaterial color="#00f2fe" emissive="#00f2fe" emissiveIntensity={0.6} />
        </mesh>
      </group>
    </group>
  );
}

// ----------------------------------------------------------------------------
// Procedural 3D Car Model with Dynamic Polymorphic Rendering
// ----------------------------------------------------------------------------
function VehicleModel({ type, speed, engineState, isEngineOn }: Vehicle3DProps) {
  const carGroupRef = useRef<THREE.Group>(null);

  // Subtle chassis vibration when engine is on / accelerating
  useFrame(({ clock }) => {
    if (carGroupRef.current && isEngineOn) {
      const vibrationFreq = speed > 0 ? 30 : 15;
      const vibrationAmp = speed > 0 ? 0.004 : 0.002;
      carGroupRef.current.position.y = Math.sin(clock.getElapsedTime() * vibrationFreq) * vibrationAmp;
    }
  });

  const isBraking = engineState === 'BRAKING';

  return (
    <group ref={carGroupRef} position={[0, 0.38, 0]}>
      {/* 4 Wheels */}
      <Wheel position={[-0.88, 0, 1.25]} isRight={false} speed={speed} />
      <Wheel position={[0.88, 0, 1.25]} isRight={true} speed={speed} />
      <Wheel position={[-0.88, 0, -1.25]} isRight={false} speed={speed} />
      <Wheel position={[0.88, 0, -1.25]} isRight={true} speed={speed} />

      {/* ========================================================== */}
      {/* 1. BASE CLASS: VEHICLE (Prototype Chassis / Buggy Frame) */}
      {/* ========================================================== */}
      {type === 'Vehicle' && (
        <group>
          {/* Main Chassis Bed */}
          <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.5, 0.22, 3.4]} />
            <meshStandardMaterial color="#2d3748" metalness={0.7} roughness={0.3} />
          </mesh>

          {/* Exposed Roll Cage (Tubular Bars) */}
          <mesh position={[0, 0.75, -0.1]} castShadow>
            <boxGeometry args={[1.3, 0.95, 1.8]} />
            <meshStandardMaterial color="#00f2fe" metalness={0.5} roughness={0.4} wireframe={true} />
          </mesh>
          <mesh position={[0, 0.5, -0.1]}>
            <boxGeometry args={[1.25, 0.5, 1.7]} />
            <meshStandardMaterial color="#1a202c" metalness={0.8} roughness={0.2} />
          </mesh>

          {/* Prototype Front Steering & Telemetry Column */}
          <mesh position={[0, 0.45, 0.7]}>
            <boxGeometry args={[0.7, 0.35, 0.5]} />
            <meshStandardMaterial color="#00f2fe" emissive="#00f2fe" emissiveIntensity={0.3} wireframe />
          </mesh>

          {/* Exposed Rear Engine/Drivetrain Prototype Module */}
          <mesh position={[0, 0.35, -1.1]} castShadow>
            <boxGeometry args={[0.9, 0.4, 0.8]} />
            <meshStandardMaterial color="#4a5568" metalness={0.9} roughness={0.2} />
          </mesh>

          {/* Base Prototype Status Indicator */}
          <mesh position={[0, 0.85, 0.7]}>
            <sphereGeometry args={[0.07, 16, 16]} />
            <meshBasicMaterial color={isEngineOn ? '#00f2fe' : '#64748b'} />
          </mesh>
        </group>
      )}

      {/* ========================================================== */}
      {/* 2. DERIVED CLASS: CAR (Combustion Grand Tourer / Sedan)   */}
      {/* ========================================================== */}
      {type === 'Car' && (
        <group>
          {/* Lower Aerodynamic Body */}
          <mesh position={[0, 0.26, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.68, 0.42, 3.7]} />
            <meshStandardMaterial color="#1e293b" metalness={0.65} roughness={0.25} />
          </mesh>

          {/* Cabin & Roof */}
          <mesh position={[0, 0.68, -0.22]} castShadow>
            <boxGeometry args={[1.34, 0.48, 1.85]} />
            <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
          </mesh>

          {/* Tinted Windshield & Windows */}
          <mesh position={[0, 0.67, 0.65]} rotation={[-0.45, 0, 0]}>
            <planeGeometry args={[1.26, 0.55]} />
            <meshPhysicalMaterial color="#38bdf8" roughness={0.1} transmission={0.6} thickness={0.5} transparent opacity={0.85} />
          </mesh>
          <mesh position={[0, 0.67, -1.1]} rotation={[0.45, 0, 0]}>
            <planeGeometry args={[1.26, 0.5]} />
            <meshPhysicalMaterial color="#38bdf8" roughness={0.1} transmission={0.6} thickness={0.5} transparent opacity={0.85} />
          </mesh>

          {/* Front Grille & Intake (Combustion radiator) */}
          <mesh position={[0, 0.22, 1.86]}>
            <boxGeometry args={[1.2, 0.22, 0.05]} />
            <meshStandardMaterial color="#0f172a" roughness={0.9} />
          </mesh>

          {/* Fuel Cap Port (Specific to Car) */}
          <mesh position={[0.85, 0.38, -0.85]} rotation={[0, Math.PI / 2, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.04, 16]} />
            <meshStandardMaterial color="#ff8a00" emissive="#ff8a00" emissiveIntensity={0.8} />
          </mesh>

          {/* Dual Exhaust Pipes with Combustion Heat Glow */}
          <mesh position={[-0.45, 0.12, -1.86]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.15, 12]} />
            <meshStandardMaterial color="#ff8a00" emissive="#ff8a00" emissiveIntensity={speed > 20 ? 1.0 : 0.2} />
          </mesh>
          <mesh position={[0.45, 0.12, -1.86]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.15, 12]} />
            <meshStandardMaterial color="#ff8a00" emissive="#ff8a00" emissiveIntensity={speed > 20 ? 1.0 : 0.2} />
          </mesh>
        </group>
      )}

      {/* ========================================================== */}
      {/* 3. MULTILEVEL DERIVED: ELECTRICCAR (Aerodynamic Cyber-EV) */}
      {/* ========================================================== */}
      {type === 'ElectricCar' && (
        <group>
          {/* Futuristic Aerodynamic Unibody */}
          <mesh position={[0, 0.26, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.72, 0.38, 3.8]} />
            <meshStandardMaterial color="#090d16" metalness={0.85} roughness={0.18} />
          </mesh>

          {/* Curved Glass Cyber Canopy */}
          <mesh position={[0, 0.65, -0.15]} castShadow>
            <boxGeometry args={[1.32, 0.44, 2.0]} />
            <meshPhysicalMaterial color="#00f2fe" metalness={0.2} roughness={0.08} transmission={0.7} transparent opacity={0.8} />
          </mesh>

          {/* High-Voltage Battery Floor Pack with Cyan Underglow Cells */}
          <mesh position={[0, 0.06, 0]}>
            <boxGeometry args={[1.45, 0.1, 2.5]} />
            <meshStandardMaterial color="#00f2fe" emissive="#00f2fe" emissiveIntensity={isEngineOn ? 0.9 : 0.15} />
          </mesh>

          {/* Front Continuous Laser Lightbar */}
          <mesh position={[0, 0.34, 1.91]}>
            <boxGeometry args={[1.5, 0.06, 0.03]} />
            <meshBasicMaterial color="#00f2fe" />
          </mesh>

          {/* Aero Rear Wing Spoiler */}
          <mesh position={[0, 0.65, -1.8]}>
            <boxGeometry args={[1.45, 0.05, 0.3]} />
            <meshStandardMaterial color="#00f2fe" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[-0.55, 0.52, -1.8]}>
            <boxGeometry args={[0.04, 0.22, 0.1]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
          <mesh position={[0.55, 0.52, -1.8]}>
            <boxGeometry args={[0.04, 0.22, 0.1]} />
            <meshStandardMaterial color="#334155" />
          </mesh>

          {/* EV Charging Port Indicator */}
          <mesh position={[-0.87, 0.38, 0.85]} rotation={[0, Math.PI / 2, 0]}>
            <cylinderGeometry args={[0.07, 0.07, 0.04, 16]} />
            <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.9} />
          </mesh>
        </group>
      )}

      {/* ========================================================== */}
      {/* Common Lighting: Headlights & Taillights */}
      {/* ========================================================== */}
      {/* Front Headlights */}
      <mesh position={[-0.62, 0.28, 1.86]}>
        <boxGeometry args={[0.26, 0.12, 0.05]} />
        <meshBasicMaterial color={isEngineOn ? '#e0f2fe' : '#475569'} />
      </mesh>
      <mesh position={[0.62, 0.28, 1.86]}>
        <boxGeometry args={[0.26, 0.12, 0.05]} />
        <meshBasicMaterial color={isEngineOn ? '#e0f2fe' : '#475569'} />
      </mesh>

      {/* Rear Taillights / Brake Lights */}
      <mesh position={[-0.6, 0.32, -1.86]}>
        <boxGeometry args={[0.28, 0.1, 0.05]} />
        <meshBasicMaterial color={isBraking ? '#ff0033' : (isEngineOn ? '#991b1b' : '#334155')} />
      </mesh>
      <mesh position={[0.6, 0.32, -1.86]}>
        <boxGeometry args={[0.28, 0.1, 0.05]} />
        <meshBasicMaterial color={isBraking ? '#ff0033' : (isEngineOn ? '#991b1b' : '#334155')} />
      </mesh>

      {/* Forward Headlight Cones when active */}
      {isEngineOn && (
        <>
          <spotLight
            position={[-0.6, 0.3, 1.9]}
            target-position={[-0.6, 0, 10]}
            color="#e0f2fe"
            intensity={2.5}
            distance={18}
            angle={0.4}
            penumbra={0.6}
          />
          <spotLight
            position={[0.6, 0.3, 1.9]}
            target-position={[0.6, 0, 10]}
            color="#e0f2fe"
            intensity={2.5}
            distance={18}
            angle={0.4}
            penumbra={0.6}
          />
        </>
      )}
    </group>
  );
}

// ----------------------------------------------------------------------------
// WebGL Error Boundary Fallback Component
// ----------------------------------------------------------------------------
interface ErrorBoundaryState {
  hasError: boolean;
}

class WebGLErrorBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn("WebGL Scene initialization notice:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// ----------------------------------------------------------------------------
// Main Exported VehicleScene3D Component
// ----------------------------------------------------------------------------
export const VehicleScene3D: React.FC<Vehicle3DProps> = ({
  type,
  speed,
  engineState,
  isEngineOn
}) => {
  return (
    <div className="relative w-full h-full min-h-[340px] bg-gradient-to-b from-graphite-900 to-graphite-950 overflow-hidden select-none">
      <WebGLErrorBoundary
        fallback={
          <div className="flex flex-col items-center justify-center h-full p-6 text-center text-slate-300">
            <div className="w-16 h-16 mb-4 rounded-full bg-cyan/10 border border-cyan/40 flex items-center justify-center text-cyan">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <p className="font-semibold text-slate-100">3D Simulation Stage (Fallback Active)</p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              Hardware accelerated WebGL context unavailable. All physics, C++ telemetry, and code synchronization are fully operational!
            </p>
          </div>
        }
      >
        <Canvas
          shadows
          gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
          className="w-full h-full"
        >
          {/* Cinematic Perspective Camera */}
          <PerspectiveCamera makeDefault position={[4.6, 2.5, 5.2]} fov={45} />
          
          {/* Orbit Controls with bounded angles */}
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            minDistance={3.8}
            maxDistance={9.5}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2.05}
            dampingFactor={0.06}
          />

          {/* Ambient & Studio Lighting */}
          <ambientLight intensity={0.65} />
          <directionalLight
            position={[8, 12, 6]}
            intensity={1.8}
            castShadow
            shadow-mapSize={[1024, 1024]}
            shadow-camera-near={0.5}
            shadow-camera-far={25}
            shadow-camera-left={-6}
            shadow-camera-right={6}
            shadow-camera-top={6}
            shadow-camera-bottom={-6}
          />
          <pointLight position={[-6, 4, -4]} intensity={0.8} color="#00f2fe" />
          <pointLight position={[6, 3, -6]} intensity={0.6} color="#a855f7" />

          {/* 3D Test Track & Moving Environment */}
          <TrackEnvironment speed={speed} />

          {/* The Polymorphic 3D Vehicle */}
          <Suspense fallback={null}>
            <VehicleModel
              type={type}
              speed={speed}
              engineState={engineState}
              isEngineOn={isEngineOn}
            />
          </Suspense>

          {/* Soft Ground Contact Shadow */}
          <ContactShadows
            position={[0, 0, 0]}
            opacity={0.7}
            scale={10}
            blur={1.5}
            far={3.5}
          />
        </Canvas>
      </WebGLErrorBoundary>

      {/* Scene HUD Overlays */}
      <div className="absolute top-3 left-3 pointer-events-none flex items-center space-x-2">
        <span className="px-2.5 py-1 text-xs font-mono font-semibold uppercase tracking-wider rounded bg-graphite-900/80 border border-slate-700 text-slate-300 backdrop-blur-sm shadow-md">
          Stage: {type} {type === 'ElectricCar' ? '(Multilevel)' : (type === 'Car' ? '(Single)' : '(Base)')}
        </span>
        <span className="px-2 py-0.5 text-[11px] font-mono rounded bg-cyan/10 border border-cyan/30 text-cyan backdrop-blur-sm">
          Interactive 3D • Drag to Orbit
        </span>
      </div>

      {/* Speed & Drivetrain Badge */}
      <div className="absolute bottom-3 right-3 pointer-events-none flex flex-col items-end">
        <div className="px-3 py-1.5 rounded-lg bg-graphite-900/85 border border-slate-700/80 backdrop-blur-md shadow-xl text-right">
          <div className="text-[10px] uppercase font-mono text-slate-400">Velocity</div>
          <div className="text-xl font-mono font-bold text-cyan">
            {speed.toFixed(0)} <span className="text-xs font-normal text-slate-400">km/h</span>
          </div>
        </div>
      </div>
    </div>
  );
};
