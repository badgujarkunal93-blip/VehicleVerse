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
// Rich Highway Test Track Scenario (Lampposts, Overhead Gantries, Barriers)
// ----------------------------------------------------------------------------
function TrackEnvironment({ speed }: { speed: number }) {
  const roadSceneryGroup = useRef<THREE.Group>(null);

  // Road elements move towards -Z (backward relative to car moving forward into +Z)
  useFrame((_, delta) => {
    if (roadSceneryGroup.current) {
      const moveZ = (speed * 0.45) * delta;
      roadSceneryGroup.current.position.z -= moveZ;
      // Smooth endless loop of 24 units
      if (roadSceneryGroup.current.position.z < -24) {
        roadSceneryGroup.current.position.z += 24;
      }
    }
  });

  const dashPositions = useMemo(() => {
    const list: number[] = [];
    for (let z = -48; z <= 48; z += 6) {
      list.push(z);
    }
    return list;
  }, []);

  const gantryPositions = useMemo(() => [-24, 0, 24, 48], []);
  const lamppostPositions = useMemo(() => [-36, -20, -4, 12, 28, 44], []);

  return (
    <group position={[0, -0.01, 0]}>
      {/* 1. Reflective Asphalt Highway Road */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 0]}>
        <planeGeometry args={[11, 100]} />
        <meshStandardMaterial color="#0f172a" roughness={0.35} metalness={0.4} />
      </mesh>

      {/* Outer Concrete Shoulders */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-5.8, 0.02, 0]}>
        <planeGeometry args={[0.6, 100]} />
        <meshStandardMaterial color="#334155" roughness={0.8} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[5.8, 0.02, 0]}>
        <planeGeometry args={[0.6, 100]} />
        <meshStandardMaterial color="#334155" roughness={0.8} />
      </mesh>

      {/* Highway Steel Guardrails (Left & Right) */}
      <group>
        {/* Left Guardrail Beam */}
        <mesh position={[-5.9, 0.45, 0]}>
          <boxGeometry args={[0.15, 0.35, 100]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[-5.9, 0.7, 0]}>
          <boxGeometry args={[0.08, 0.08, 100]} />
          <meshBasicMaterial color="#00f2fe" />
        </mesh>

        {/* Right Guardrail Beam */}
        <mesh position={[5.9, 0.45, 0]}>
          <boxGeometry args={[0.15, 0.35, 100]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[5.9, 0.7, 0]}>
          <boxGeometry args={[0.08, 0.08, 100]} />
          <meshBasicMaterial color="#00f2fe" />
        </mesh>
      </group>

      {/* 2. Moving Scenery Group (Dashes, Lampposts, Overhead Gantries) */}
      <group ref={roadSceneryGroup}>
        {/* Moving White Lane Markings */}
        {dashPositions.map((z, idx) => (
          <group key={`dash-${idx}`} position={[0, 0.025, z]}>
            {/* Center Dashes */}
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[0.22, 3.2]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
            {/* Embedded Cat-Eye Reflectors */}
            <mesh position={[0, 0.02, 2.0]}>
              <sphereGeometry args={[0.04, 8, 8]} />
              <meshBasicMaterial color="#facc15" />
            </mesh>
            {/* Left & Right Solid Lane Edge Lines */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-3.8, 0, 0]}>
              <planeGeometry args={[0.15, 3.2]} />
              <meshBasicMaterial color="#94a3b8" />
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[3.8, 0, 0]}>
              <planeGeometry args={[0.15, 3.2]} />
              <meshBasicMaterial color="#94a3b8" />
            </mesh>
          </group>
        ))}

        {/* Curved Highway Street Lampposts */}
        {lamppostPositions.map((z, idx) => (
          <group key={`lamp-${idx}`}>
            {/* Left Lamppost */}
            <group position={[-6.2, 0, z]}>
              {/* Vertical Pole */}
              <mesh position={[0, 2.4, 0]}>
                <cylinderGeometry args={[0.07, 0.1, 4.8, 12]} />
                <meshStandardMaterial color="#475569" metalness={0.8} />
              </mesh>
              {/* Overhanging Arm */}
              <mesh position={[0.7, 4.7, 0]} rotation={[0, 0, -0.4]}>
                <cylinderGeometry args={[0.05, 0.05, 1.8, 8]} />
                <meshStandardMaterial color="#475569" metalness={0.8} />
              </mesh>
              {/* Lamp Head & Light Source */}
              <mesh position={[1.4, 4.4, 0]}>
                <boxGeometry args={[0.4, 0.12, 0.25]} />
                <meshStandardMaterial color="#0284c7" emissive="#38bdf8" emissiveIntensity={1.2} />
              </mesh>
            </group>

            {/* Right Lamppost */}
            <group position={[6.2, 0, z]}>
              <mesh position={[0, 2.4, 0]}>
                <cylinderGeometry args={[0.07, 0.1, 4.8, 12]} />
                <meshStandardMaterial color="#475569" metalness={0.8} />
              </mesh>
              <mesh position={[-0.7, 4.7, 0]} rotation={[0, 0, 0.4]}>
                <cylinderGeometry args={[0.05, 0.05, 1.8, 8]} />
                <meshStandardMaterial color="#475569" metalness={0.8} />
              </mesh>
              <mesh position={[-1.4, 4.4, 0]}>
                <boxGeometry args={[0.4, 0.12, 0.25]} />
                <meshStandardMaterial color="#0284c7" emissive="#38bdf8" emissiveIntensity={1.2} />
              </mesh>
            </group>
          </group>
        ))}

        {/* Overhead Highway Tech Gantries with Speed Signs */}
        {gantryPositions.map((z, idx) => (
          <group key={`gantry-${idx}`} position={[0, 0, z]}>
            {/* Left & Right Support Pillars */}
            <mesh position={[-6.2, 3.0, 0]}>
              <boxGeometry args={[0.3, 6.0, 0.3]} />
              <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
            </mesh>
            <mesh position={[6.2, 3.0, 0]}>
              <boxGeometry args={[0.3, 6.0, 0.3]} />
              <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
            </mesh>

            {/* Overhead Crossbeam */}
            <mesh position={[0, 5.8, 0]}>
              <boxGeometry args={[12.7, 0.45, 0.6]} />
              <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
            </mesh>

            {/* Digital Highway Sign Display */}
            <mesh position={[0, 5.2, 0]}>
              <boxGeometry args={[6.4, 0.8, 0.1]} />
              <meshStandardMaterial color="#020617" roughness={0.9} />
            </mesh>
            <mesh position={[0, 5.2, 0.06]}>
              <planeGeometry args={[6.0, 0.6]} />
              <meshBasicMaterial color="#0284c7" />
            </mesh>
          </group>
        ))}
      </group>

      {/* Surrounding Studio Ground Floor */}
      <gridHelper args={[100, 50, '#38bdf8', '#1e293b']} position={[0, -0.02, 0]} />
    </group>
  );
}

// ----------------------------------------------------------------------------
// High-Detail Alloy Wheels (Visible multi-spoke rim, brake disc, and red caliper)
// ----------------------------------------------------------------------------
function Wheel({ position, isRight, speed }: { position: [number, number, number]; isRight: boolean; speed: number }) {
  const wheelGroupRef = useRef<THREE.Group>(null);

  // Wheels roll forward into +Z: top moves +Z, bottom moves -Z
  useFrame((_, delta) => {
    if (wheelGroupRef.current) {
      wheelGroupRef.current.rotation.x -= (speed * 0.16) * delta;
    }
  });

  return (
    <group position={position}>
      {/* Stationary Sport Brake Disc & Caliper */}
      <group position={[isRight ? 0.08 : -0.08, 0, 0]}>
        {/* Brake Disc Rotor (Perforated Silver) */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.32, 0.32, 0.04, 24]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.95} roughness={0.2} />
        </mesh>
        {/* Sport Caliper (Vibrant Red or Cyan) */}
        <mesh position={[0, 0.18, 0.05]} rotation={[0, 0, Math.PI / 2]}>
          <boxGeometry args={[0.18, 0.12, 0.18]} />
          <meshStandardMaterial color="#ef4444" emissive="#b91c1c" emissiveIntensity={0.5} />
        </mesh>
      </group>

      {/* Rotating Wheel Rim & Tire */}
      <group ref={wheelGroupRef}>
        {/* Wide Low-Profile Rubber Tire */}
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.42, 0.42, 0.34, 28]} />
          <meshStandardMaterial color="#111827" roughness={0.85} metalness={0.15} />
        </mesh>

        {/* Outer Wheel Rim Lip (High Polish Chrome) */}
        <mesh rotation={[0, 0, Math.PI / 2]} position={[isRight ? 0.02 : -0.02, 0, 0]}>
          <cylinderGeometry args={[0.35, 0.35, 0.33, 24]} />
          <meshStandardMaterial color="#f8fafc" metalness={0.95} roughness={0.1} />
        </mesh>

        {/* 5-Star Double Spoke Alloy Pattern */}
        {[0, 1, 2, 3, 4].map((i) => {
          const angle = (i * Math.PI * 2) / 5;
          return (
            <group key={i} rotation={[angle, 0, 0]}>
              <mesh position={[isRight ? 0.16 : -0.16, 0.15, 0]}>
                <boxGeometry args={[0.04, 0.25, 0.07]} />
                <meshStandardMaterial color="#f8fafc" metalness={0.95} roughness={0.08} />
              </mesh>
            </group>
          );
        })}

        {/* Center Rim Hub Cap */}
        <mesh rotation={[0, 0, Math.PI / 2]} position={[isRight ? 0.17 : -0.17, 0, 0]}>
          <cylinderGeometry args={[0.09, 0.09, 0.04, 16]} />
          <meshStandardMaterial color="#0284c7" emissive="#0284c7" emissiveIntensity={0.8} />
        </mesh>
      </group>
    </group>
  );
}

// ----------------------------------------------------------------------------
// Aerodynamic Wind Streaks at Speed > 15 km/h
// ----------------------------------------------------------------------------
function SpeedStreaks({ speed }: { speed: number }) {
  const streaksGroup = useRef<THREE.Group>(null);

  const streakData = useMemo(() => {
    const list: { x: number; y: number; z: number; len: number }[] = [];
    for (let i = 0; i < 20; i++) {
      list.push({
        x: (Math.random() - 0.5) * 6,
        y: 0.4 + Math.random() * 2.2,
        z: (Math.random() - 0.5) * 30,
        len: 1.5 + Math.random() * 3.5
      });
    }
    return list;
  }, []);

  useFrame((_, delta) => {
    if (streaksGroup.current && speed > 10) {
      const moveZ = speed * 0.7 * delta;
      streaksGroup.current.position.z -= moveZ;
      if (streaksGroup.current.position.z < -20) {
        streaksGroup.current.position.z += 20;
      }
    }
  });

  if (speed <= 10) return null;

  return (
    <group ref={streaksGroup}>
      {streakData.map((s, idx) => (
        <mesh key={idx} position={[s.x, s.y, s.z]}>
          <boxGeometry args={[0.02, 0.02, s.len]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={Math.min(0.65, speed / 160)} />
        </mesh>
      ))}
    </group>
  );
}

// ----------------------------------------------------------------------------
// Sculpted, Realistic 3D Sports Car / Cyber-EV with Aerodynamic Proportions
// Front is at +Z, Rear is at -Z (facing camera in rear 3/4 chase view)
// ----------------------------------------------------------------------------
function VehicleModel({ type, speed, engineState, isEngineOn }: Vehicle3DProps) {
  const carGroupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }, delta) => {
    if (!carGroupRef.current) return;
    const time = clock.getElapsedTime();
    const isMoving = speed > 0;

    // Road bump suspension oscillation
    const bumpFreq = 10 + speed * 0.16;
    const bumpAmp = isMoving ? Math.min(0.035, 0.005 + speed * 0.0002) : (isEngineOn ? 0.002 : 0);
    const bounce = Math.sin(time * bumpFreq) * bumpAmp;

    // Acceleration pitch (squat when accelerating forward into +Z)
    let pitch = 0;
    if (engineState === 'ACCELERATING' && isMoving) {
      pitch = -0.04 - Math.min(0.04, speed * 0.0002);
    } else if (engineState === 'BRAKING') {
      pitch = 0.05; // Nose dips down
    }

    carGroupRef.current.position.y = 0.42 + bounce;
    carGroupRef.current.rotation.x = THREE.MathUtils.lerp(carGroupRef.current.rotation.x, pitch, delta * 6);
  });

  const isBraking = engineState === 'BRAKING';

  return (
    <group ref={carGroupRef} position={[0, 0.42, 0]}>
      {/* 4 Wide Sport Wheels (Front at +1.3, Rear at -1.3) */}
      <Wheel position={[-0.94, 0, 1.3]} isRight={false} speed={speed} />
      <Wheel position={[0.94, 0, 1.3]} isRight={true} speed={speed} />
      <Wheel position={[-0.94, 0, -1.3]} isRight={false} speed={speed} />
      <Wheel position={[0.94, 0, -1.3]} isRight={true} speed={speed} />

      {/* ========================================================== */}
      {/* 1. BASE CLASS: VEHICLE (Prototype Titanium Engineering Buggy) */}
      {/* ========================================================== */}
      {type === 'Vehicle' && (
        <group>
          {/* Heavy Aerospace Titanium Chassis */}
          <mesh position={[0, 0.18, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.6, 0.24, 3.6]} />
            <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.25} />
          </mesh>

          {/* High-Vis Safety-Orange/Yellow Roll Cage Tubes */}
          <mesh position={[0, 0.82, -0.1]} castShadow>
            <boxGeometry args={[1.38, 1.05, 1.9]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.5} roughness={0.3} wireframe />
          </mesh>
          <mesh position={[0, 0.54, -0.1]} castShadow>
            <boxGeometry args={[1.32, 0.52, 1.85]} />
            <meshStandardMaterial color="#eab308" metalness={0.6} roughness={0.3} />
          </mesh>

          {/* Front Steering Rack & Electronics */}
          <mesh position={[0, 0.5, 0.8]}>
            <boxGeometry args={[0.8, 0.4, 0.6]} />
            <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.5} wireframe />
          </mesh>

          {/* Exposed Rear Prototype Engine Block */}
          <mesh position={[0, 0.42, -1.15]} castShadow>
            <boxGeometry args={[0.98, 0.48, 0.9]} />
            <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      )}

      {/* ========================================================== */}
      {/* 2. DERIVED CLASS: CAR (Combustion Gran Turismo Sports Coupe) */}
      {/* ========================================================== */}
      {type === 'Car' && (
        <group>
          {/* Main Sculpted Lower Body (Racing Crimson Red) */}
          <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.76, 0.46, 3.85]} />
            <meshStandardMaterial color="#e11d48" metalness={0.65} roughness={0.18} />
          </mesh>

          {/* Front Aerodynamic Sloping Hood */}
          <mesh position={[0, 0.48, 1.05]} castShadow>
            <boxGeometry args={[1.56, 0.18, 1.4]} />
            <meshStandardMaterial color="#be123c" metalness={0.7} roughness={0.18} />
          </mesh>
          {/* Carbon Front Splitter */}
          <mesh position={[0, 0.14, 1.95]}>
            <boxGeometry args={[1.7, 0.08, 0.25]} />
            <meshStandardMaterial color="#0f172a" roughness={0.9} />
          </mesh>

          {/* Cabin & Fastback Roofline (Obsidian Metallic) */}
          <mesh position={[0, 0.76, -0.2]} castShadow>
            <boxGeometry args={[1.36, 0.52, 1.95]} />
            <meshStandardMaterial color="#090d16" metalness={0.8} roughness={0.15} />
          </mesh>

          {/* Sloped Windshields (Front & Rear) */}
          <mesh position={[0, 0.74, 0.72]} rotation={[-0.45, 0, 0]}>
            <planeGeometry args={[1.28, 0.62]} />
            <meshPhysicalMaterial color="#38bdf8" roughness={0.1} transmission={0.7} transparent opacity={0.9} />
          </mesh>
          <mesh position={[0, 0.74, -1.18]} rotation={[0.45, 0, 0]}>
            <planeGeometry args={[1.28, 0.58]} />
            <meshPhysicalMaterial color="#38bdf8" roughness={0.1} transmission={0.7} transparent opacity={0.9} />
          </mesh>

          {/* Side Wing Mirrors */}
          <mesh position={[-0.96, 0.68, 0.45]}>
            <boxGeometry args={[0.18, 0.08, 0.12]} />
            <meshStandardMaterial color="#be123c" metalness={0.7} />
          </mesh>
          <mesh position={[0.96, 0.68, 0.45]}>
            <boxGeometry args={[0.18, 0.08, 0.12]} />
            <meshStandardMaterial color="#be123c" metalness={0.7} />
          </mesh>

          {/* Rear Ducktail Spoiler */}
          <mesh position={[0, 0.64, -1.88]}>
            <boxGeometry args={[1.5, 0.08, 0.22]} />
            <meshStandardMaterial color="#090d16" metalness={0.8} />
          </mesh>

          {/* Fuel Cap Port - Amber */}
          <mesh position={[0.9, 0.45, -0.85]} rotation={[0, Math.PI / 2, 0]}>
            <cylinderGeometry args={[0.09, 0.09, 0.04, 16]} />
            <meshStandardMaterial color="#f97316" emissive="#f97316" emissiveIntensity={0.8} />
          </mesh>

          {/* Dual Chrome Exhaust Tips with Heat Glow */}
          <mesh position={[-0.48, 0.16, -1.94]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.18, 16]} />
            <meshStandardMaterial color="#f8fafc" metalness={0.95} roughness={0.1} />
          </mesh>
          <mesh position={[0.48, 0.16, -1.94]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.18, 16]} />
            <meshStandardMaterial color="#f8fafc" metalness={0.95} roughness={0.1} />
          </mesh>
          {isEngineOn && (
            <>
              <mesh position={[-0.48, 0.16, -2.03]}>
                <sphereGeometry args={[0.06, 12, 12]} />
                <meshBasicMaterial color={speed > 20 ? '#ff8a00' : '#ea580c'} />
              </mesh>
              <mesh position={[0.48, 0.16, -2.03]}>
                <sphereGeometry args={[0.06, 12, 12]} />
                <meshBasicMaterial color={speed > 20 ? '#ff8a00' : '#ea580c'} />
              </mesh>
            </>
          )}
        </group>
      )}

      {/* ========================================================== */}
      {/* 3. MULTILEVEL DERIVED: ELECTRICCAR (Sleek Cyber-Silver EV)  */}
      {/* ========================================================== */}
      {type === 'ElectricCar' && (
        <group>
          {/* Main Sculpted Cyber-Silver / Titanium Unibody */}
          <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.8, 0.46, 3.9]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.88} roughness={0.15} />
          </mesh>

          {/* Lower Aerodynamic Ground-Effects Skirt & Diffuser */}
          <mesh position={[0, 0.14, 0]}>
            <boxGeometry args={[1.84, 0.12, 4.0]} />
            <meshStandardMaterial color="#0f172a" metalness={0.95} roughness={0.1} />
          </mesh>

          {/* Front Sloping Aero Nose with Grille-Less EV Facia */}
          <mesh position={[0, 0.46, 1.1]} castShadow>
            <boxGeometry args={[1.62, 0.18, 1.45]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.85} roughness={0.15} />
          </mesh>
          <mesh position={[0, 0.14, 2.0]}>
            <boxGeometry args={[1.74, 0.06, 0.25]} />
            <meshStandardMaterial color="#0284c7" emissive="#0284c7" emissiveIntensity={0.6} />
          </mesh>

          {/* Panoramic Curved Glass Cyber Canopy (Sleek Fastback) */}
          <mesh position={[0, 0.74, -0.16]} castShadow>
            <boxGeometry args={[1.38, 0.5, 2.15]} />
            <meshPhysicalMaterial color="#38bdf8" metalness={0.1} roughness={0.05} transmission={0.75} transparent opacity={0.85} />
          </mesh>

          {/* High-Voltage Battery Floor Pack with Intense Cyan Glowing Energy Underglow */}
          <mesh position={[0, 0.08, 0]}>
            <boxGeometry args={[1.56, 0.1, 2.7]} />
            <meshStandardMaterial color="#00f2fe" emissive="#00f2fe" emissiveIntensity={isEngineOn ? 1.5 : 0.2} />
          </mesh>

          {/* Side Aerodynamic Wing Mirrors */}
          <mesh position={[-0.98, 0.68, 0.45]}>
            <boxGeometry args={[0.18, 0.08, 0.12]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.85} />
          </mesh>
          <mesh position={[0.98, 0.68, 0.45]}>
            <boxGeometry args={[0.18, 0.08, 0.12]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.85} />
          </mesh>

          {/* Rear Active Aero Wing Lip */}
          <mesh position={[0, 0.66, -1.9]}>
            <boxGeometry args={[1.56, 0.06, 0.28]} />
            <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
          </mesh>

          {/* High-Voltage Green EV Charging Port */}
          <mesh position={[-0.92, 0.46, 0.85]} rotation={[0, Math.PI / 2, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.04, 16]} />
            <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={1.0} />
          </mesh>
        </group>
      )}

      {/* ========================================================== */}
      {/* Rear Bumper Details (Facing the Camera in Rear 3/4 Chase View) */}
      {/* ========================================================== */}
      {/* VEHICLEVERSE Rear License Plate Frame */}
      <mesh position={[0, 0.32, -1.95]}>
        <boxGeometry args={[0.7, 0.18, 0.04]} />
        <meshStandardMaterial color="#020617" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.32, -1.97]}>
        <planeGeometry args={[0.64, 0.14]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Rear Full-Width High-Intensity LED Lightstrip */}
      <mesh position={[0, 0.46, -1.94]}>
        <boxGeometry args={[1.68, 0.08, 0.04]} />
        <meshBasicMaterial color={isBraking ? '#ff0033' : '#e11d48'} />
      </mesh>
      {/* Dual Outer Taillight Clusters */}
      <mesh position={[-0.68, 0.46, -1.94]}>
        <boxGeometry args={[0.3, 0.14, 0.05]} />
        <meshBasicMaterial color={isBraking ? '#ff0033' : '#dc2626'} />
      </mesh>
      <mesh position={[0.68, 0.46, -1.94]}>
        <boxGeometry args={[0.3, 0.14, 0.05]} />
        <meshBasicMaterial color={isBraking ? '#ff0033' : '#dc2626'} />
      </mesh>

      {/* Front Headlights & Laser Projector Lights (+Z) */}
      <mesh position={[-0.66, 0.38, 1.94]}>
        <boxGeometry args={[0.28, 0.12, 0.05]} />
        <meshBasicMaterial color={isEngineOn ? '#ffffff' : '#64748b'} />
      </mesh>
      <mesh position={[0.66, 0.38, 1.94]}>
        <boxGeometry args={[0.28, 0.12, 0.05]} />
        <meshBasicMaterial color={isEngineOn ? '#ffffff' : '#64748b'} />
      </mesh>
      {isEngineOn && (
        <>
          <spotLight position={[-0.66, 0.4, 2.0]} target-position={[-0.66, 0, 16]} color="#ffffff" intensity={3.5} distance={25} angle={0.45} />
          <spotLight position={[0.66, 0.4, 2.0]} target-position={[0.66, 0, 16]} color="#ffffff" intensity={3.5} distance={25} angle={0.45} />
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
      className="relative w-full h-full min-h-[380px] bg-gradient-to-b from-[#090d1a] via-[#10172a] to-[#0b1020] rounded-2xl overflow-hidden select-none"
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
          {/* Iconic Rear 3/4 Cinematic Camera Angle (facing rear of car down the highway) */}
          <PerspectiveCamera makeDefault position={[3.6, 2.1, -4.5]} fov={45} />
          
          <OrbitControls
            ref={controlsRef}
            enablePan={false}
            enableZoom={true}
            minDistance={3.2}
            maxDistance={8.5}
            minPolarAngle={Math.PI / 4.8}
            maxPolarAngle={Math.PI / 2.05}
            dampingFactor={0.06}
          />

          {/* High-Luminance Studio Lighting */}
          <hemisphereLight color="#bae6fd" groundColor="#0f172a" intensity={1.2} />
          <directionalLight position={[6, 12, 6]} intensity={3.2} castShadow shadow-mapSize={[1024, 1024]} />
          <directionalLight position={[-6, 6, -6]} intensity={2.0} color="#93c5fd" />
          <directionalLight position={[0, 4, -8]} intensity={3.0} color="#38bdf8" />
          <pointLight position={[0, 3, 0]} intensity={1.2} color="#00f2fe" distance={12} />

          {/* Rich Highway Track Environment */}
          <TrackEnvironment speed={speed} />

          {/* Wind Speed Streaks */}
          <SpeedStreaks speed={speed} />

          {/* Sculpted 3D Sports Vehicle */}
          <Suspense fallback={null}>
            <VehicleModel
              type={type}
              speed={speed}
              engineState={engineState}
              isEngineOn={isEngineOn}
            />
          </Suspense>

          <ContactShadows position={[0, 0, 0]} opacity={0.75} scale={11} blur={1.6} far={3.6} />
        </Canvas>
      </WebGLErrorBoundary>

      {/* TOP-LEFT OVERLAY: Floating Speed & Distance Cards */}
      <div className="absolute top-4 left-4 z-10 flex items-center space-x-2.5">
        <div className="bg-slate-900/85 backdrop-blur-md border border-slate-700/60 rounded-xl px-3.5 py-2 flex items-center space-x-2.5 shadow-lg text-white">
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

        <div className="bg-slate-900/85 backdrop-blur-md border border-slate-700/60 rounded-xl px-3.5 py-2 flex items-center space-x-2.5 shadow-lg text-white">
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
      <div className="absolute top-4 right-4 z-10 flex items-center space-x-1.5 bg-slate-900/80 backdrop-blur-md border border-slate-700/60 rounded-xl p-1 shadow-lg text-xs font-medium text-slate-300">
        <div className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-800/90 text-white">
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
