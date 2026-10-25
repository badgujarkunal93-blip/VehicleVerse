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
// Animated Track Environment with Moving Road, Dashes, & Speed Poles
// ----------------------------------------------------------------------------
function TrackEnvironment({ speed }: { speed: number }) {
  const roadDashesGroup = useRef<THREE.Group>(null);
  const roadPillarsGroup = useRef<THREE.Group>(null);

  // Moving road lines & trackside light posts rushing past backwards
  useFrame((_, delta) => {
    const moveZ = (speed * 0.5) * delta;

    if (roadDashesGroup.current) {
      roadDashesGroup.current.position.z += moveZ;
      if (roadDashesGroup.current.position.z > 6) {
        roadDashesGroup.current.position.z -= 6;
      }
    }

    if (roadPillarsGroup.current) {
      roadPillarsGroup.current.position.z += moveZ;
      if (roadPillarsGroup.current.position.z > 12) {
        roadPillarsGroup.current.position.z -= 12;
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

  const pillarPositions = useMemo(() => {
    const list: number[] = [];
    for (let z = -36; z <= 36; z += 12) {
      list.push(z);
    }
    return list;
  }, []);

  return (
    <group position={[0, -0.01, 0]}>
      {/* Asphalt Test Track with clean contrast */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 0]}>
        <planeGeometry args={[11, 80]} />
        <meshStandardMaterial color="#1a2232" roughness={0.7} metalness={0.2} />
      </mesh>

      {/* Road Shoulder / Curbs */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-5.3, 0.02, 0]}>
        <planeGeometry args={[0.4, 80]} />
        <meshStandardMaterial color="#00f2fe" emissive="#00f2fe" emissiveIntensity={0.6} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[5.3, 0.02, 0]}>
        <planeGeometry args={[0.4, 80]} />
        <meshStandardMaterial color="#00f2fe" emissive="#00f2fe" emissiveIntensity={0.6} />
      </mesh>

      {/* Inner White Lane Boundaries */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-3.6, 0.025, 0]}>
        <planeGeometry args={[0.12, 80]} />
        <meshBasicMaterial color="#94a3b8" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[3.6, 0.025, 0]}>
        <planeGeometry args={[0.12, 80]} />
        <meshBasicMaterial color="#94a3b8" />
      </mesh>

      {/* Moving Center Line Dashes (High Contrast Yellow & White) */}
      <group ref={roadDashesGroup}>
        {dashPositions.map((z, idx) => (
          <group key={idx} position={[0, 0.03, z]}>
            {/* Center dual dashes */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-0.15, 0, 0]}>
              <planeGeometry args={[0.15, 3.2]} />
              <meshBasicMaterial color="#facc15" />
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.15, 0, 0]}>
              <planeGeometry args={[0.15, 3.2]} />
              <meshBasicMaterial color="#facc15" />
            </mesh>
          </group>
        ))}
      </group>

      {/* Roadside Tech Light Beacons that rush past to give real velocity */}
      <group ref={roadPillarsGroup}>
        {pillarPositions.map((z, idx) => (
          <group key={idx}>
            {/* Left Beacon */}
            <mesh position={[-5.8, 0.9, z]}>
              <boxGeometry args={[0.15, 1.8, 0.15]} />
              <meshStandardMaterial color="#334155" />
            </mesh>
            <mesh position={[-5.8, 1.8, z]}>
              <sphereGeometry args={[0.16, 12, 12]} />
              <meshBasicMaterial color="#00f2fe" />
            </mesh>

            {/* Right Beacon */}
            <mesh position={[5.8, 0.9, z]}>
              <boxGeometry args={[0.15, 1.8, 0.15]} />
              <meshStandardMaterial color="#334155" />
            </mesh>
            <mesh position={[5.8, 1.8, z]}>
              <sphereGeometry args={[0.16, 12, 12]} />
              <meshBasicMaterial color="#a855f7" />
            </mesh>
          </group>
        ))}
      </group>

      {/* Engineering Ground Tech Grid */}
      <gridHelper args={[80, 40, '#00f2fe', '#1e293b']} position={[0, -0.02, 0]} />
    </group>
  );
}

// ----------------------------------------------------------------------------
// High-Contrast Wheel with Visible Rotating 5-Star Chrome Spokes & Red Calipers
// ----------------------------------------------------------------------------
function Wheel({ position, isRight, speed }: { position: [number, number, number]; isRight: boolean; speed: number }) {
  const wheelGroupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (wheelGroupRef.current) {
      // Rotate proportional to speed (spinning forward)
      wheelGroupRef.current.rotation.x += (speed * 0.16) * delta;
    }
  });

  return (
    <group position={position}>
      {/* Brake Caliper (Stationary relative to wheel rotation) */}
      <mesh position={[isRight ? 0.14 : -0.14, 0.18, 0]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.18, 0.14, 0.22]} />
        <meshStandardMaterial color="#ef4444" emissive="#b91c1c" emissiveIntensity={0.5} roughness={0.3} />
      </mesh>

      {/* Rotating Wheel Hub */}
      <group ref={wheelGroupRef}>
        {/* Rubber Tire with visible tread sidewall */}
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.42, 0.42, 0.32, 24]} />
          <meshStandardMaterial color="#1f242e" roughness={0.8} metalness={0.2} />
        </mesh>

        {/* Outer Wheel Rim Lip (Silver Chrome) */}
        <mesh rotation={[0, 0, Math.PI / 2]} position={[isRight ? 0.02 : -0.02, 0, 0]}>
          <cylinderGeometry args={[0.34, 0.34, 0.31, 24]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.15} />
        </mesh>

        {/* Wheel Disk Face (Dark Titanium) */}
        <mesh rotation={[0, 0, Math.PI / 2]} position={[isRight ? 0.14 : -0.14, 0, 0]}>
          <cylinderGeometry args={[0.31, 0.31, 0.05, 16]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.3} />
        </mesh>

        {/* High-Contrast 5-Star Chrome Spokes - CLEARLY VISIBLE WHEN ROTATING */}
        {[0, 1, 2, 3, 4].map((i) => {
          const angle = (i * Math.PI * 2) / 5;
          return (
            <group key={i} rotation={[angle, 0, 0]}>
              <mesh position={[isRight ? 0.15 : -0.15, 0.15, 0]}>
                <boxGeometry args={[0.04, 0.24, 0.06]} />
                <meshStandardMaterial color="#f8fafc" metalness={0.95} roughness={0.1} />
              </mesh>
            </group>
          );
        })}

        {/* Center Rim Cap Accent */}
        <mesh rotation={[0, 0, Math.PI / 2]} position={[isRight ? 0.17 : -0.17, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.04, 12]} />
          <meshStandardMaterial color="#00f2fe" emissive="#00f2fe" emissiveIntensity={0.8} />
        </mesh>
      </group>
    </group>
  );
}

// ----------------------------------------------------------------------------
// Procedural Speed Streaks (Wind Lines rushing past at speed > 15 km/h)
// ----------------------------------------------------------------------------
function SpeedStreaks({ speed }: { speed: number }) {
  const streaksGroup = useRef<THREE.Group>(null);

  const streakData = useMemo(() => {
    const list: { x: number; y: number; z: number; len: number }[] = [];
    for (let i = 0; i < 18; i++) {
      list.push({
        x: (Math.random() - 0.5) * 5,
        y: 0.3 + Math.random() * 2.2,
        z: (Math.random() - 0.5) * 30,
        len: 1.5 + Math.random() * 3
      });
    }
    return list;
  }, []);

  useFrame((_, delta) => {
    if (streaksGroup.current && speed > 10) {
      const moveZ = speed * 0.7 * delta;
      streaksGroup.current.position.z += moveZ;
      if (streaksGroup.current.position.z > 20) {
        streaksGroup.current.position.z -= 20;
      }
    }
  });

  if (speed <= 10) return null;

  return (
    <group ref={streaksGroup}>
      {streakData.map((s, idx) => (
        <mesh key={idx} position={[s.x, s.y, s.z]}>
          <boxGeometry args={[0.03, 0.03, s.len]} />
          <meshBasicMaterial color="#00f2fe" transparent opacity={Math.min(0.6, speed / 150)} />
        </mesh>
      ))}
    </group>
  );
}

// ----------------------------------------------------------------------------
// Procedural 3D Car Model with Dynamic Physics Suspension, Pitch, & Vivid Colors
// ----------------------------------------------------------------------------
function VehicleModel({ type, speed, engineState, isEngineOn }: Vehicle3DProps) {
  const carGroupRef = useRef<THREE.Group>(null);
  const exhaustEmitterRef = useRef<THREE.Group>(null);

  // Dynamic Vehicle Suspension Physics & Motion
  useFrame(({ clock }, delta) => {
    if (!carGroupRef.current) return;

    const time = clock.getElapsedTime();
    const isMoving = speed > 0;

    // 1. Suspension Road Texture Bounce (Active when moving, scales with velocity)
    const roadBumpFrequency = 8 + speed * 0.18;
    const roadBumpAmplitude = isMoving ? Math.min(0.04, 0.006 + speed * 0.00025) : (isEngineOn ? 0.003 : 0);
    const suspensionBounce = Math.sin(time * roadBumpFrequency) * roadBumpAmplitude;
    
    // 2. Realistic Highway Lane Micro-Drift (Subtle lateral weaving that shows real motion)
    const lateralSway = isMoving ? Math.sin(time * 0.9) * Math.min(0.22, 0.04 + speed * 0.001) : 0;

    // 3. Acceleration Pitch Up (Squat on throttle) vs Braking Dive (Nose down)
    let targetPitch = 0;
    if (engineState === 'ACCELERATING' && isMoving) {
      targetPitch = -0.04 - Math.min(0.05, speed * 0.0003); // Squat backward
    } else if (engineState === 'BRAKING') {
      targetPitch = 0.06; // Nose down
    } else if (isMoving) {
      targetPitch = -0.01;
    }

    // Smoothly apply physics transforms
    carGroupRef.current.position.y = 0.42 + suspensionBounce;
    carGroupRef.current.position.x = THREE.MathUtils.lerp(carGroupRef.current.position.x, lateralSway, delta * 4);
    carGroupRef.current.rotation.x = THREE.MathUtils.lerp(carGroupRef.current.rotation.x, targetPitch, delta * 6);
    carGroupRef.current.rotation.z = THREE.MathUtils.lerp(carGroupRef.current.rotation.z, -lateralSway * 0.15, delta * 4); // Bank slightly into sway
  });

  const isBraking = engineState === 'BRAKING';

  return (
    <group ref={carGroupRef} position={[0, 0.42, 0]}>
      {/* 4 Wheels (Placed symmetrically with high-contrast visible rotating rims) */}
      <Wheel position={[-0.92, 0, 1.3]} isRight={false} speed={speed} />
      <Wheel position={[0.92, 0, 1.3]} isRight={true} speed={speed} />
      <Wheel position={[-0.92, 0, -1.3]} isRight={false} speed={speed} />
      <Wheel position={[0.92, 0, -1.3]} isRight={true} speed={speed} />

      {/* ========================================================== */}
      {/* 1. BASE CLASS: VEHICLE (Hi-Vis Safety Yellow Buggy Prototype) */}
      {/* ========================================================== */}
      {type === 'Vehicle' && (
        <group>
          {/* Main Heavy Steel Ladder Chassis */}
          <mesh position={[0, 0.16, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.56, 0.24, 3.5]} />
            <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.3} />
          </mesh>

          {/* High-Visibility Engineering Prototype Safety Yellow Roll Cage */}
          <mesh position={[0, 0.8, -0.1]} castShadow>
            <boxGeometry args={[1.38, 1.05, 1.9]} />
            <meshStandardMaterial color="#eab308" metalness={0.4} roughness={0.3} wireframe={true} />
          </mesh>
          <mesh position={[0, 0.52, -0.1]} castShadow>
            <boxGeometry args={[1.3, 0.5, 1.8]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.5} roughness={0.3} />
          </mesh>

          {/* Prototype Front Steering & Telemetry Column */}
          <mesh position={[0, 0.48, 0.8]}>
            <boxGeometry args={[0.75, 0.38, 0.55]} />
            <meshStandardMaterial color="#00f2fe" emissive="#00f2fe" emissiveIntensity={0.5} wireframe />
          </mesh>

          {/* Exposed High-Performance Prototype Engine Block */}
          <mesh position={[0, 0.4, -1.15]} castShadow>
            <boxGeometry args={[0.95, 0.46, 0.85]} />
            <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.2} />
          </mesh>

          {/* Base Prototype Amber Status Beacon */}
          <mesh position={[0, 1.35, -0.1]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshBasicMaterial color={isEngineOn ? '#f59e0b' : '#64748b'} />
          </mesh>
        </group>
      )}

      {/* ========================================================== */}
      {/* 2. DERIVED CLASS: CAR (Fiery Crimson Racing Sports Coupe) */}
      {/* ========================================================== */}
      {type === 'Car' && (
        <group>
          {/* Radiant Racing Crimson Red Lower Body */}
          <mesh position={[0, 0.28, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.74, 0.46, 3.8]} />
            <meshStandardMaterial color="#e11d48" metalness={0.5} roughness={0.2} />
          </mesh>

          {/* Front Engine Hood with Aerodynamic Air Scoops */}
          <mesh position={[0, 0.48, 1.05]} castShadow>
            <boxGeometry args={[1.5, 0.16, 1.3]} />
            <meshStandardMaterial color="#be123c" metalness={0.6} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.58, 0.95]}>
            <boxGeometry args={[0.5, 0.08, 0.4]} />
            <meshStandardMaterial color="#0f172a" roughness={0.9} />
          </mesh>

          {/* Sleek Aerodynamic Cabin & Obsidian Roof */}
          <mesh position={[0, 0.74, -0.22]} castShadow>
            <boxGeometry args={[1.36, 0.52, 1.9]} />
            <meshStandardMaterial color="#0f172a" metalness={0.7} roughness={0.2} />
          </mesh>

          {/* Tinted Front Windshield */}
          <mesh position={[0, 0.72, 0.7]} rotation={[-0.45, 0, 0]}>
            <planeGeometry args={[1.28, 0.6]} />
            <meshPhysicalMaterial color="#38bdf8" roughness={0.1} transmission={0.7} transparent opacity={0.9} />
          </mesh>
          {/* Tinted Rear Window */}
          <mesh position={[0, 0.72, -1.15]} rotation={[0.45, 0, 0]}>
            <planeGeometry args={[1.28, 0.55]} />
            <meshPhysicalMaterial color="#38bdf8" roughness={0.1} transmission={0.7} transparent opacity={0.9} />
          </mesh>

          {/* Black Mesh Front Grille (Combustion Cooling) */}
          <mesh position={[0, 0.24, 1.91]}>
            <boxGeometry args={[1.3, 0.24, 0.05]} />
            <meshStandardMaterial color="#020617" roughness={0.95} />
          </mesh>

          {/* Fuel Cap Port (Specific to Car) - Bright Orange Accent */}
          <mesh position={[0.88, 0.42, -0.85]} rotation={[0, Math.PI / 2, 0]}>
            <cylinderGeometry args={[0.09, 0.09, 0.04, 16]} />
            <meshStandardMaterial color="#ff8a00" emissive="#ff8a00" emissiveIntensity={0.9} />
          </mesh>

          {/* Dual Chrome Exhaust Pipes with Glowing Combustion Flame */}
          <group ref={exhaustEmitterRef}>
            <mesh position={[-0.48, 0.14, -1.91]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.07, 0.07, 0.16, 12]} />
              <meshStandardMaterial color="#e2e8f0" metalness={0.95} roughness={0.1} />
            </mesh>
            <mesh position={[0.48, 0.14, -1.91]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.07, 0.07, 0.16, 12]} />
              <meshStandardMaterial color="#e2e8f0" metalness={0.95} roughness={0.1} />
            </mesh>
            {/* Glowing exhaust tips on throttle */}
            {isEngineOn && (
              <>
                <mesh position={[-0.48, 0.14, -1.99]}>
                  <sphereGeometry args={[0.06, 12, 12]} />
                  <meshBasicMaterial color={speed > 20 ? '#ff8a00' : '#ea580c'} />
                </mesh>
                <mesh position={[0.48, 0.14, -1.99]}>
                  <sphereGeometry args={[0.06, 12, 12]} />
                  <meshBasicMaterial color={speed > 20 ? '#ff8a00' : '#ea580c'} />
                </mesh>
              </>
            )}
          </group>
        </group>
      )}

      {/* ========================================================== */}
      {/* 3. MULTILEVEL DERIVED: ELECTRICCAR (Stunning Cyber-Pearl EV) */}
      {/* ========================================================== */}
      {type === 'ElectricCar' && (
        <group>
          {/* Pearlescent Cyber Silver / Electric Cyan Dual-Tone Aerodynamic Body */}
          <mesh position={[0, 0.28, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.78, 0.44, 3.9]} />
            <meshStandardMaterial color="#38bdf8" metalness={0.7} roughness={0.18} />
          </mesh>

          {/* Lower Aerodynamic Under-Chassis Skirt (Obsidian) */}
          <mesh position={[0, 0.14, 0]}>
            <boxGeometry args={[1.82, 0.12, 3.95]} />
            <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
          </mesh>

          {/* Panoramic Curved Glass Cyber Canopy (Glowing Cyan cockpit) */}
          <mesh position={[0, 0.72, -0.15]} castShadow>
            <boxGeometry args={[1.36, 0.48, 2.1]} />
            <meshPhysicalMaterial color="#00f2fe" metalness={0.2} roughness={0.05} transmission={0.75} transparent opacity={0.85} />
          </mesh>

          {/* High-Voltage Battery Floor Pack with Intense Cyan Glowing Energy Underglow */}
          <mesh position={[0, 0.08, 0]}>
            <boxGeometry args={[1.5, 0.1, 2.6]} />
            <meshStandardMaterial color="#00f2fe" emissive="#00f2fe" emissiveIntensity={isEngineOn ? 1.4 : 0.2} />
          </mesh>

          {/* Front Continuous Laser Lightbar (Ultra-Bright) */}
          <mesh position={[0, 0.36, 1.96]}>
            <boxGeometry args={[1.6, 0.08, 0.04]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>

          {/* Rear Continuous Neon Lightbar */}
          <mesh position={[0, 0.38, -1.96]}>
            <boxGeometry args={[1.6, 0.08, 0.04]} />
            <meshBasicMaterial color={isBraking ? '#ff0033' : '#00f2fe'} />
          </mesh>

          {/* Aero Rear Wing Spoiler */}
          <mesh position={[0, 0.72, -1.88]}>
            <boxGeometry args={[1.55, 0.06, 0.32]} />
            <meshStandardMaterial color="#0284c7" metalness={0.9} roughness={0.1} />
          </mesh>
          <mesh position={[-0.6, 0.58, -1.88]}>
            <boxGeometry args={[0.05, 0.26, 0.12]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          <mesh position={[0.6, 0.58, -1.88]}>
            <boxGeometry args={[0.05, 0.26, 0.12]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>

          {/* High-Voltage EV Charging Port (Glowing Green) */}
          <mesh position={[-0.9, 0.42, 0.85]} rotation={[0, Math.PI / 2, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.04, 16]} />
            <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={1.0} />
          </mesh>
        </group>
      )}

      {/* ========================================================== */}
      {/* Headlights & Taillights with High-Luminance Materials */}
      {/* ========================================================== */}
      {/* Front Headlights */}
      <mesh position={[-0.65, 0.32, 1.91]}>
        <boxGeometry args={[0.28, 0.14, 0.05]} />
        <meshBasicMaterial color={isEngineOn ? '#ffffff' : '#64748b'} />
      </mesh>
      <mesh position={[0.65, 0.32, 1.91]}>
        <boxGeometry args={[0.28, 0.14, 0.05]} />
        <meshBasicMaterial color={isEngineOn ? '#ffffff' : '#64748b'} />
      </mesh>

      {/* Rear Taillights / High-Intensity Brake Lights */}
      <mesh position={[-0.65, 0.36, -1.91]}>
        <boxGeometry args={[0.3, 0.12, 0.05]} />
        <meshBasicMaterial color={isBraking ? '#ff0033' : (isEngineOn ? '#dc2626' : '#475569')} />
      </mesh>
      <mesh position={[0.65, 0.36, -1.91]}>
        <boxGeometry args={[0.3, 0.12, 0.05]} />
        <meshBasicMaterial color={isBraking ? '#ff0033' : (isEngineOn ? '#dc2626' : '#475569')} />
      </mesh>

      {/* Forward Spotlights Casting Cones on the Track */}
      {isEngineOn && (
        <>
          <spotLight
            position={[-0.65, 0.35, 1.95]}
            target-position={[-0.65, 0, 15]}
            color="#ffffff"
            intensity={4.0}
            distance={25}
            angle={0.45}
            penumbra={0.5}
          />
          <spotLight
            position={[0.65, 0.35, 1.95]}
            target-position={[0.65, 0, 15]}
            color="#ffffff"
            intensity={4.0}
            distance={25}
            angle={0.45}
            penumbra={0.5}
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
// Main Exported VehicleScene3D Component with Premium Studio Color Grading
// ----------------------------------------------------------------------------
export const VehicleScene3D: React.FC<Vehicle3DProps> = ({
  type,
  speed,
  engineState,
  isEngineOn
}) => {
  return (
    <div className="relative w-full h-full min-h-[350px] bg-gradient-to-b from-[#0a0f1d] via-[#0d1527] to-[#080b14] overflow-hidden select-none">
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
          {/* Dynamic Perspective Camera that pulls back slightly as speed increases */}
          <PerspectiveCamera makeDefault position={[4.4, 2.3, 5.0]} fov={45} />
          
          {/* Orbit Controls with bounded angles */}
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            minDistance={3.5}
            maxDistance={9.5}
            minPolarAngle={Math.PI / 4.5}
            maxPolarAngle={Math.PI / 2.05}
            dampingFactor={0.06}
          />

          {/* ============================================================== */}
          {/* STUDIO COLOR GRADING & HIGH-LUMINANCE LIGHTING RIG             */}
          {/* ============================================================== */}
          {/* Hemisphere Ambient Light: Sky cyan, ground slate */}
          <hemisphereLight
            color="#7dd3fc"
            groundColor="#1e293b"
            intensity={1.2}
          />

          {/* Primary Studio Key Light (Sun / Stage Spotlight) */}
          <directionalLight
            position={[8, 14, 7]}
            intensity={3.2}
            castShadow
            shadow-mapSize={[1024, 1024]}
            shadow-bias={-0.0001}
          />

          {/* Opposite Fill Light (Soft Violet / Cyan) */}
          <directionalLight
            position={[-8, 8, -6]}
            intensity={1.6}
            color="#c084fc"
          />

          {/* Front Silhouette Edge / Rim Light */}
          <directionalLight
            position={[0, 4, -9]}
            intensity={2.8}
            color="#38bdf8"
          />

          {/* Cyan Glow Point light */}
          <pointLight position={[0, 2.5, 0]} intensity={1.5} color="#00f2fe" distance={10} />

          {/* 3D Test Track & Moving Environment */}
          <TrackEnvironment speed={speed} />

          {/* Wind Speed Streaks (Zoom past at speed) */}
          <SpeedStreaks speed={speed} />

          {/* The Dynamic 3D Vehicle with Suspension Physics */}
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
            opacity={0.8}
            scale={12}
            blur={1.8}
            far={3.8}
          />
        </Canvas>
      </WebGLErrorBoundary>

      {/* Scene HUD Overlays */}
      <div className="absolute top-3 left-3 pointer-events-none flex items-center space-x-2">
        <span className="px-2.5 py-1 text-xs font-mono font-semibold uppercase tracking-wider rounded bg-graphite-900/90 border border-cyan/40 text-cyan backdrop-blur-md shadow-lg">
          Stage: {type} {type === 'ElectricCar' ? '(Multilevel)' : (type === 'Car' ? '(Single)' : '(Base)')}
        </span>
        <span className="px-2 py-0.5 text-[11px] font-mono rounded bg-graphite-900/80 border border-slate-700 text-slate-300 backdrop-blur-sm">
          Interactive 3D • Drag to Orbit
        </span>
      </div>

      {/* Speed & Suspension HUD Badge */}
      <div className="absolute bottom-3 right-3 pointer-events-none flex flex-col items-end gap-1">
        <div className="px-3 py-1.5 rounded-lg bg-graphite-900/90 border border-cyan/40 backdrop-blur-md shadow-xl text-right">
          <div className="text-[10px] uppercase font-mono text-slate-400">Velocity</div>
          <div className="text-xl font-mono font-bold text-cyan">
            {speed.toFixed(0)} <span className="text-xs font-normal text-slate-400">km/h</span>
          </div>
          {speed > 0 && (
            <div className="text-[9px] font-mono text-emerald-400 flex items-center justify-end gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Dynamic Suspension Active
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
