import React, { useRef, useMemo, Suspense, Component, ErrorInfo, ReactNode, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, ContactShadows } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { VehicleType, EngineState } from '../../types/vehicle';
import { Gauge, Navigation, Compass, RotateCcw, Maximize2 } from 'lucide-react';

interface Vehicle3DProps {
  type: VehicleType;
  speed: number;
  distance?: number;
  engineState: EngineState;
  isEngineOn: boolean;
}

// ----------------------------------------------------------------------------
// Animated Track Environment with Moving Road & Dashes
// ----------------------------------------------------------------------------
function TrackEnvironment({ speed }: { speed: number }) {
  const roadDashesGroup = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const moveZ = (speed * 0.45) * delta;
    if (roadDashesGroup.current) {
      roadDashesGroup.current.position.z += moveZ;
      if (roadDashesGroup.current.position.z > 6) {
        roadDashesGroup.current.position.z -= 6;
      }
    }
  });

  const dashPositions = useMemo(() => {
    const list: number[] = [];
    for (let z = -36; z <= 36; z += 6) {
      list.push(z);
    }
    return list;
  }, []);

  return (
    <group position={[0, -0.01, 0]}>
      {/* Asphalt Test Track */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 0]}>
        <planeGeometry args={[12, 80]} />
        <meshStandardMaterial color="#161e2e" roughness={0.7} metalness={0.2} />
      </mesh>

      {/* Road Shoulder / Curbs */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-5.8, 0.02, 0]}>
        <planeGeometry args={[0.3, 80]} />
        <meshStandardMaterial color="#0284c7" emissive="#0284c7" emissiveIntensity={0.5} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[5.8, 0.02, 0]}>
        <planeGeometry args={[0.3, 80]} />
        <meshStandardMaterial color="#0284c7" emissive="#0284c7" emissiveIntensity={0.5} />
      </mesh>

      {/* Moving Center Line Dashes */}
      <group ref={roadDashesGroup}>
        {dashPositions.map((z, idx) => (
          <mesh key={idx} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, z]}>
            <planeGeometry args={[0.22, 3.0]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        ))}
      </group>

      {/* Subtle Studio Floor Grid */}
      <gridHelper args={[80, 40, '#38bdf8', '#1e293b']} position={[0, -0.02, 0]} />
    </group>
  );
}

// ----------------------------------------------------------------------------
// Wheel Component with Rotating Spokes & Calipers
// ----------------------------------------------------------------------------
function Wheel({ position, isRight, speed }: { position: [number, number, number]; isRight: boolean; speed: number }) {
  const wheelGroupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (wheelGroupRef.current) {
      wheelGroupRef.current.rotation.x += (speed * 0.16) * delta;
    }
  });

  return (
    <group position={position}>
      {/* Brake Caliper */}
      <mesh position={[isRight ? 0.14 : -0.14, 0.16, 0]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.16, 0.12, 0.2]} />
        <meshStandardMaterial color="#0284c7" emissive="#0284c7" emissiveIntensity={0.4} />
      </mesh>

      {/* Rotating Wheel Hub */}
      <group ref={wheelGroupRef}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.42, 0.42, 0.32, 24]} />
          <meshStandardMaterial color="#1e293b" roughness={0.8} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]} position={[isRight ? 0.02 : -0.02, 0, 0]}>
          <cylinderGeometry args={[0.34, 0.34, 0.31, 24]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.15} />
        </mesh>
        {[0, 1, 2, 3, 4].map((i) => {
          const angle = (i * Math.PI * 2) / 5;
          return (
            <group key={i} rotation={[angle, 0, 0]}>
              <mesh position={[isRight ? 0.15 : -0.15, 0.14, 0]}>
                <boxGeometry args={[0.04, 0.24, 0.06]} />
                <meshStandardMaterial color="#ffffff" metalness={0.95} roughness={0.1} />
              </mesh>
            </group>
          );
        })}
      </group>
    </group>
  );
}

// ----------------------------------------------------------------------------
// Procedural 3D Car Model (Polished Metallic Finish matching reference image)
// ----------------------------------------------------------------------------
function VehicleModel({ type, speed, engineState, isEngineOn }: Vehicle3DProps) {
  const carGroupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }, delta) => {
    if (!carGroupRef.current) return;
    const time = clock.getElapsedTime();
    const isMoving = speed > 0;

    // Suspension road oscillation
    const bumpFreq = 8 + speed * 0.15;
    const bumpAmp = isMoving ? Math.min(0.035, 0.005 + speed * 0.0002) : (isEngineOn ? 0.002 : 0);
    const bounce = Math.sin(time * bumpFreq) * bumpAmp;

    // Acceleration pitch
    let pitch = 0;
    if (engineState === 'ACCELERATING' && isMoving) {
      pitch = -0.04;
    } else if (engineState === 'BRAKING') {
      pitch = 0.05;
    }

    carGroupRef.current.position.y = 0.42 + bounce;
    carGroupRef.current.rotation.x = THREE.MathUtils.lerp(carGroupRef.current.rotation.x, pitch, delta * 6);
  });

  const isBraking = engineState === 'BRAKING';

  return (
    <group ref={carGroupRef} position={[0, 0.42, 0]}>
      {/* 4 Wheels */}
      <Wheel position={[-0.92, 0, 1.3]} isRight={false} speed={speed} />
      <Wheel position={[0.92, 0, 1.3]} isRight={true} speed={speed} />
      <Wheel position={[-0.92, 0, -1.3]} isRight={false} speed={speed} />
      <Wheel position={[0.92, 0, -1.3]} isRight={true} speed={speed} />

      {/* ========================================================== */}
      {/* 1. BASE CLASS: VEHICLE (Prototype Chassis) */}
      {/* ========================================================== */}
      {type === 'Vehicle' && (
        <group>
          <mesh position={[0, 0.16, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.56, 0.24, 3.5]} />
            <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.78, -0.1]} castShadow>
            <boxGeometry args={[1.36, 1.0, 1.9]} />
            <meshStandardMaterial color="#eab308" metalness={0.5} roughness={0.3} wireframe />
          </mesh>
          <mesh position={[0, 0.48, 0.75]}>
            <boxGeometry args={[0.75, 0.38, 0.55]} />
            <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.5} wireframe />
          </mesh>
          <mesh position={[0, 0.4, -1.15]} castShadow>
            <boxGeometry args={[0.95, 0.46, 0.85]} />
            <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>
      )}

      {/* ========================================================== */}
      {/* 2. DERIVED CLASS: CAR (Combustion Sports Coupe) */}
      {/* ========================================================== */}
      {type === 'Car' && (
        <group>
          <mesh position={[0, 0.28, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.74, 0.46, 3.8]} />
            <meshStandardMaterial color="#e11d48" metalness={0.5} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.74, -0.22]} castShadow>
            <boxGeometry args={[1.36, 0.52, 1.9]} />
            <meshStandardMaterial color="#0f172a" metalness={0.7} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.72, 0.7]} rotation={[-0.45, 0, 0]}>
            <planeGeometry args={[1.28, 0.6]} />
            <meshPhysicalMaterial color="#38bdf8" roughness={0.1} transmission={0.7} transparent opacity={0.9} />
          </mesh>
          <mesh position={[0.88, 0.42, -0.85]} rotation={[0, Math.PI / 2, 0]}>
            <cylinderGeometry args={[0.09, 0.09, 0.04, 16]} />
            <meshStandardMaterial color="#f97316" emissive="#f97316" emissiveIntensity={0.8} />
          </mesh>
          {/* Exhausts */}
          <mesh position={[-0.48, 0.14, -1.91]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.07, 0.07, 0.16, 12]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.9} />
          </mesh>
          <mesh position={[0.48, 0.14, -1.91]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.07, 0.07, 0.16, 12]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.9} />
          </mesh>
        </group>
      )}

      {/* ========================================================== */}
      {/* 3. MULTILEVEL DERIVED: ELECTRICCAR (Sleek Metallic Silver/Blue EV) */}
      {/* ========================================================== */}
      {type === 'ElectricCar' && (
        <group>
          {/* Main Silver / Platinum Aerodynamic Body */}
          <mesh position={[0, 0.28, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.78, 0.44, 3.9]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.15} />
          </mesh>

          {/* Lower Aerodynamic Diffuser / Skirt */}
          <mesh position={[0, 0.12, 0]}>
            <boxGeometry args={[1.82, 0.12, 3.95]} />
            <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
          </mesh>

          {/* Panoramic Tinted Glass Canopy */}
          <mesh position={[0, 0.72, -0.15]} castShadow>
            <boxGeometry args={[1.36, 0.48, 2.1]} />
            <meshPhysicalMaterial color="#38bdf8" metalness={0.2} roughness={0.05} transmission={0.7} transparent opacity={0.85} />
          </mesh>

          {/* High-Voltage Battery Pack Underglow */}
          <mesh position={[0, 0.08, 0]}>
            <boxGeometry args={[1.5, 0.1, 2.6]} />
            <meshStandardMaterial color="#0284c7" emissive="#0284c7" emissiveIntensity={isEngineOn ? 1.0 : 0.2} />
          </mesh>

          {/* Laser Headlight Lightbar */}
          <mesh position={[0, 0.36, 1.96]}>
            <boxGeometry args={[1.6, 0.06, 0.04]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>

          {/* Continuous Red LED Taillight Bar */}
          <mesh position={[0, 0.38, -1.96]}>
            <boxGeometry args={[1.6, 0.08, 0.04]} />
            <meshBasicMaterial color={isBraking ? '#ef4444' : '#dc2626'} />
          </mesh>

          {/* Aero Rear Lip Spoiler */}
          <mesh position={[0, 0.7, -1.88]}>
            <boxGeometry args={[1.5, 0.05, 0.3]} />
            <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
          </mesh>

          {/* EV Charging Port Indicator */}
          <mesh position={[-0.9, 0.42, 0.85]} rotation={[0, Math.PI / 2, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.04, 16]} />
            <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={1.0} />
          </mesh>
        </group>
      )}

      {/* Headlights */}
      <mesh position={[-0.65, 0.32, 1.91]}>
        <boxGeometry args={[0.28, 0.14, 0.05]} />
        <meshBasicMaterial color={isEngineOn ? '#ffffff' : '#64748b'} />
      </mesh>
      <mesh position={[0.65, 0.32, 1.91]}>
        <boxGeometry args={[0.28, 0.14, 0.05]} />
        <meshBasicMaterial color={isEngineOn ? '#ffffff' : '#64748b'} />
      </mesh>

      {/* Taillights */}
      <mesh position={[-0.65, 0.36, -1.91]}>
        <boxGeometry args={[0.3, 0.12, 0.05]} />
        <meshBasicMaterial color={isBraking ? '#ef4444' : (isEngineOn ? '#b91c1c' : '#475569')} />
      </mesh>
      <mesh position={[0.65, 0.36, -1.91]}>
        <boxGeometry args={[0.3, 0.12, 0.05]} />
        <meshBasicMaterial color={isBraking ? '#ef4444' : (isEngineOn ? '#b91c1c' : '#475569')} />
      </mesh>

      {/* Forward Spotlights */}
      {isEngineOn && (
        <>
          <spotLight position={[-0.65, 0.35, 1.95]} target-position={[-0.65, 0, 15]} color="#ffffff" intensity={3.5} distance={20} angle={0.4} />
          <spotLight position={[0.65, 0.35, 1.95]} target-position={[0.65, 0, 15]} color="#ffffff" intensity={3.5} distance={20} angle={0.4} />
        </>
      )}
    </group>
  );
}

// ----------------------------------------------------------------------------
// WebGL Error Boundary Fallback
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
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

// ----------------------------------------------------------------------------
// Main Exported VehicleScene3D Component
// ----------------------------------------------------------------------------
export const VehicleScene3D: React.FC<Vehicle3DProps> = ({
  type,
  speed,
  distance = 0,
  engineState,
  isEngineOn
}) => {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleResetView = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[380px] bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0b1120] rounded-2xl overflow-hidden select-none"
    >
      <WebGLErrorBoundary
        fallback={
          <div className="flex flex-col items-center justify-center h-full p-6 text-center text-slate-300">
            <p className="font-semibold text-slate-100">3D Simulation Stage (Fallback Active)</p>
          </div>
        }
      >
        <Canvas
          shadows
          gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
          className="w-full h-full"
        >
          {/* Cinematic 3/4 Perspective Camera */}
          <PerspectiveCamera makeDefault position={[3.8, 1.8, 4.2]} fov={45} />
          
          <OrbitControls
            ref={controlsRef}
            enablePan={false}
            enableZoom={true}
            minDistance={3.2}
            maxDistance={8.5}
            minPolarAngle={Math.PI / 4.5}
            maxPolarAngle={Math.PI / 2.05}
            dampingFactor={0.06}
          />

          {/* Studio Lighting */}
          <hemisphereLight color="#bae6fd" groundColor="#0f172a" intensity={1.1} />
          <directionalLight position={[6, 12, 6]} intensity={3.0} castShadow shadow-mapSize={[1024, 1024]} />
          <directionalLight position={[-6, 6, -6]} intensity={1.5} color="#93c5fd" />
          <directionalLight position={[0, 4, -8]} intensity={2.5} color="#60a5fa" />

          {/* Track */}
          <TrackEnvironment speed={speed} />

          {/* Dynamic 3D Vehicle */}
          <Suspense fallback={null}>
            <VehicleModel
              type={type}
              speed={speed}
              engineState={engineState}
              isEngineOn={isEngineOn}
            />
          </Suspense>

          <ContactShadows position={[0, 0, 0]} opacity={0.7} scale={10} blur={1.5} far={3.5} />
        </Canvas>
      </WebGLErrorBoundary>

      {/* TOP-LEFT OVERLAY: Speed & Distance Floating Cards */}
      <div className="absolute top-4 left-4 z-10 flex items-center space-x-2.5">
        {/* Speed Card */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/60 rounded-xl px-3.5 py-2 flex items-center space-x-2.5 shadow-lg text-white">
          <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400">
            <Gauge className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-medium text-slate-400">Speed</div>
            <div className="text-base font-bold font-mono leading-tight">
              {Math.round(speed)} <span className="text-xs font-normal text-slate-400">km/h</span>
            </div>
          </div>
        </div>

        {/* Distance Card */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/60 rounded-xl px-3.5 py-2 flex items-center space-x-2.5 shadow-lg text-white">
          <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
            <Navigation className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-medium text-slate-400">Distance</div>
            <div className="text-base font-bold font-mono leading-tight">
              {distance.toFixed(1)} <span className="text-xs font-normal text-slate-400">km</span>
            </div>
          </div>
        </div>
      </div>

      {/* TOP-RIGHT OVERLAY: Orbit, Reset View, Fullscreen Actions */}
      <div className="absolute top-4 right-4 z-10 flex items-center space-x-1.5 bg-slate-900/75 backdrop-blur-md border border-slate-700/60 rounded-xl p-1 shadow-lg text-xs font-medium text-slate-300">
        <div className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-800/80 text-white">
          <Compass className="w-3.5 h-3.5 text-blue-400" />
          <span>Orbit</span>
        </div>

        <button
          type="button"
          onClick={handleResetView}
          className="flex items-center space-x-1 px-2.5 py-1 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
          title="Reset Camera View"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset View</span>
        </button>

        <button
          type="button"
          onClick={handleToggleFullscreen}
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
          title={isFullscreen ? 'Exit Fullscreen' : 'Toggle Fullscreen'}
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
