import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/* ───────────────────────────────── Constants ─────────────────────────────── */

// Reference: very pale/light skin — almost white with subtle warmth
const SKIN = '#e0d5cf'
const SKIN_SHADOW = '#c9b8b0'
const HAIR = '#111115'
const LIP = '#c9a09a'
const LIP_LINE = '#7a5555'
const IRIS_COLOR = '#3d2a50'
const IRIS_RING = '#2a1a3a'
const BROW = '#151518'
const NOSTRIL = '#b09a92'

const SKIN_MAT = {
  roughness: 0.82,
  metalness: 0,
  clearcoat: 0.04,
  clearcoatRoughness: 0.95,
}
const HAIR_MAT = { roughness: 0.35, metalness: 0.08 }
const EYE_MAT = {
  roughness: 0.08,
  metalness: 0,
  clearcoat: 1.0,
  clearcoatRoughness: 0.1,
}

// Larger eyes to match reference
const EYE_R = 0.19
const IRIS_R = 0.10
const PUPIL_R = 0.05

// Eyes positioned wider and slightly lower for Pixar proportions
const L_EYE = [-0.34, 0.08, 0.76]
const R_EYE = [0.34, 0.08, 0.76]

const HEAD_ROT_LIMIT = 0.08
const HEAD_LERP = 0.03
const EYE_ROT_LIMIT = 0.25
const EYE_LERP = 0.06
const FLOAT_SPEED = 0.8
const FLOAT_AMP = 0.015
const BLINK_SPEED = 8
const LID_REST_Y = 0.10
const LID_BLINK_TRAVEL = 0.16

/* ─────────────────────────── Head Geometry Builder ────────────────────────── */

function createHeadGeometry() {
  const geo = new THREE.SphereGeometry(1, 64, 64)
  const pos = geo.attributes.position

  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i)
    let y = pos.getY(i)
    let z = pos.getZ(i)

    // Slightly oversized head — vertical elongation
    y *= 1.1

    // Narrow the chin
    if (y < -0.25) {
      const f = Math.min(1, (-y - 0.25) / 0.85)
      x *= 1 - f * 0.32
      z *= 1 - f * 0.1
    }

    // Wider cheeks for character appeal
    if (y > -0.15 && y < 0.2) {
      const f = 1 - Math.abs(y - 0.02) / 0.17
      x *= 1 + Math.max(0, f) * 0.04
    }

    // Flatten the back of head
    if (z < -0.4) z *= 0.91

    // Subtle brow ridge — more prominent
    if (y > 0.18 && y < 0.38 && z > 0.5) {
      z += 0.04 * Math.max(0, 1 - Math.abs(y - 0.28) / 0.1)
    }

    // Slight jaw definition
    if (y < -0.4 && y > -0.7 && Math.abs(x) > 0.3) {
      x *= 1 + 0.02 * Math.max(0, 1 - Math.abs(y + 0.55) / 0.15)
    }

    pos.setXYZ(i, x, y, z)
  }

  geo.computeVertexNormals()
  return geo
}

/* ──────────────────────────── Eye Sub-component ──────────────────────────── */

function Eye({ position, irisRef, eyelidRef }) {
  return (
    <group position={position}>
      {/* Eyeball */}
      <mesh>
        <sphereGeometry args={[EYE_R, 32, 32]} />
        <meshPhysicalMaterial color="#f5f2ee" {...EYE_MAT} />
      </mesh>

      {/* Iris + Pupil pivot — rotates around eyeball center to track cursor */}
      <group ref={irisRef}>
        {/* Iris base */}
        <mesh position={[0, 0, EYE_R * 0.96]}>
          <circleGeometry args={[IRIS_R, 32]} />
          <meshStandardMaterial color={IRIS_COLOR} roughness={0.3} />
        </mesh>
        {/* Iris outer ring detail */}
        <mesh position={[0, 0, EYE_R * 0.963]}>
          <ringGeometry args={[IRIS_R * 0.8, IRIS_R, 32]} />
          <meshStandardMaterial color={IRIS_RING} roughness={0.35} />
        </mesh>
        {/* Pupil */}
        <mesh position={[0, 0, EYE_R * 0.97]}>
          <circleGeometry args={[PUPIL_R, 32]} />
          <meshBasicMaterial color="#050505" />
        </mesh>
      </group>

      {/* Specular highlight — fixed, gives "alive" look */}
      <mesh position={[0.04, 0.045, EYE_R + 0.006]}>
        <circleGeometry args={[0.025, 16]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.9} depthWrite={false} />
      </mesh>
      {/* Secondary highlight */}
      <mesh position={[-0.025, -0.02, EYE_R + 0.005]}>
        <circleGeometry args={[0.012, 12]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.35} depthWrite={false} />
      </mesh>

      {/* Upper eyelid — skin-colored dome, moves down for blink */}
      <group ref={eyelidRef} position={[0, LID_REST_Y, 0]}>
        <mesh rotation={[Math.PI, 0, 0]}>
          <sphereGeometry args={[EYE_R * 1.18, 32, 14, 0, Math.PI * 2, 0, Math.PI * 0.48]} />
          <meshPhysicalMaterial color={SKIN} {...SKIN_MAT} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Lower eyelid — static, subtle */}
      <mesh position={[0, -0.1, 0.035]} scale={[1.08, 0.4, 1]}>
        <sphereGeometry args={[EYE_R * 1.08, 24, 6, 0, Math.PI * 2, Math.PI * 0.55, Math.PI * 0.22]} />
        <meshPhysicalMaterial color={SKIN} {...SKIN_MAT} side={THREE.DoubleSide} />
      </mesh>

      {/* Eye socket shadow — darkened ring around eye for depth */}
      <mesh position={[0, 0, -0.01]} scale={[1.12, 1.15, 1]}>
        <ringGeometry args={[EYE_R * 0.98, EYE_R * 1.2, 32]} />
        <meshBasicMaterial color={SKIN_SHADOW} transparent opacity={0.4} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
    </group>
  )
}

/* ────────────────────────────── Main Avatar ──────────────────────────────── */

export default function Avatar() {
  const groupRef = useRef()
  const headRef = useRef()
  const lIrisRef = useRef()
  const rIrisRef = useRef()
  const lLidRef = useRef()
  const rLidRef = useRef()

  const headGeo = useMemo(createHeadGeometry, [])

  // Mutable animation state — no re-renders
  const a = useRef({
    hRot: { x: 0, y: 0 },
    eRot: { x: 0, y: 0 },
    mx: 0,
    my: 0,
    blinkTimer: 3 + Math.random() * 3,
    blinkPhase: 0,
    isBlinking: false,
  })

  // Global mouse tracking
  useEffect(() => {
    const onMove = (e) => {
      a.current.mx = (e.clientX / window.innerWidth) * 2 - 1
      a.current.my = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  useFrame((state, delta) => {
    const s = a.current
    const t = state.clock.elapsedTime

    /* ── Head rotation — very subtle, toward cursor ── */
    const tHY = s.mx * HEAD_ROT_LIMIT
    const tHX = -s.my * HEAD_ROT_LIMIT * 0.6
    s.hRot.x += (tHX - s.hRot.x) * HEAD_LERP
    s.hRot.y += (tHY - s.hRot.y) * HEAD_LERP

    // Micro-adjustments for organic feel
    const microX = Math.sin(t * 0.7) * 0.003 + Math.sin(t * 1.3) * 0.002
    const microY = Math.cos(t * 0.5) * 0.002 + Math.cos(t * 1.1) * 0.001

    if (headRef.current) {
      headRef.current.rotation.x = s.hRot.x + microX
      headRef.current.rotation.y = s.hRot.y + microY
      headRef.current.rotation.z = Math.sin(t * 0.3) * 0.003
    }

    /* ── Eye tracking — pupils follow cursor on eyeball surface ── */
    const maxR = EYE_ROT_LIMIT
    const tEY = THREE.MathUtils.clamp(s.mx * maxR, -maxR, maxR)
    const tEX = THREE.MathUtils.clamp(-s.my * maxR * 0.7, -maxR * 0.7, maxR * 0.7)
    s.eRot.x += (tEX - s.eRot.x) * EYE_LERP
    s.eRot.y += (tEY - s.eRot.y) * EYE_LERP

    if (lIrisRef.current) {
      lIrisRef.current.rotation.x = s.eRot.x
      lIrisRef.current.rotation.y = s.eRot.y
    }
    if (rIrisRef.current) {
      rIrisRef.current.rotation.x = s.eRot.x
      rIrisRef.current.rotation.y = s.eRot.y
    }

    /* ── Floating / breathing ── */
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * FLOAT_SPEED) * FLOAT_AMP
      groupRef.current.rotation.z = Math.sin(t * 0.4) * 0.003
    }

    /* ── Blink — natural random intervals ── */
    s.blinkTimer -= delta
    if (s.blinkTimer <= 0 && !s.isBlinking) {
      s.isBlinking = true
      s.blinkPhase = 0
    }
    if (s.isBlinking) {
      s.blinkPhase += delta * BLINK_SPEED
      const amt = Math.sin(Math.min(s.blinkPhase, 1) * Math.PI)
      const y = LID_REST_Y - amt * LID_BLINK_TRAVEL

      if (lLidRef.current) lLidRef.current.position.y = y
      if (rLidRef.current) rLidRef.current.position.y = y

      if (s.blinkPhase >= 1) {
        s.isBlinking = false
        s.blinkTimer = 3 + Math.random() * 3
        if (lLidRef.current) lLidRef.current.position.y = LID_REST_Y
        if (rLidRef.current) rLidRef.current.position.y = LID_REST_Y
      }
    }
  })

  return (
    <group ref={groupRef} position={[0, -0.15, 0]}>
      <group ref={headRef}>

        {/* ── Head ── */}
        <mesh geometry={headGeo}>
          <meshPhysicalMaterial color={SKIN} {...SKIN_MAT} />
        </mesh>

        {/* ── Hair ── */}
        {/* Main top cap — large volume */}
        <mesh position={[0, 0.62, -0.08]} scale={[1.08, 0.45, 1.05]}>
          <sphereGeometry args={[1, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.58]} />
          <meshPhysicalMaterial color={HAIR} {...HAIR_MAT} />
        </mesh>
        {/* Front fringe — swooping to the right */}
        <mesh position={[0.15, 0.76, 0.32]} scale={[0.7, 0.22, 0.38]}>
          <sphereGeometry args={[1, 24, 24]} />
          <meshPhysicalMaterial color={HAIR} {...HAIR_MAT} />
        </mesh>
        {/* Front fringe left piece */}
        <mesh position={[-0.2, 0.72, 0.28]} scale={[0.55, 0.18, 0.32]}>
          <sphereGeometry args={[1, 24, 24]} />
          <meshPhysicalMaterial color={HAIR} {...HAIR_MAT} />
        </mesh>
        {/* Left side — wraps lower */}
        <mesh position={[-0.75, 0.25, -0.1]} scale={[0.45, 0.6, 0.88]}>
          <sphereGeometry args={[1, 24, 24]} />
          <meshPhysicalMaterial color={HAIR} {...HAIR_MAT} />
        </mesh>
        {/* Right side — wraps lower */}
        <mesh position={[0.75, 0.25, -0.1]} scale={[0.45, 0.6, 0.88]}>
          <sphereGeometry args={[1, 24, 24]} />
          <meshPhysicalMaterial color={HAIR} {...HAIR_MAT} />
        </mesh>
        {/* Back volume */}
        <mesh position={[0, 0.2, -0.7]} scale={[0.92, 0.7, 0.5]}>
          <sphereGeometry args={[1, 24, 24]} />
          <meshPhysicalMaterial color={HAIR} {...HAIR_MAT} />
        </mesh>
        {/* Top-back filler */}
        <mesh position={[0, 0.52, -0.38]} scale={[1.0, 0.38, 0.65]}>
          <sphereGeometry args={[1, 24, 24]} />
          <meshPhysicalMaterial color={HAIR} {...HAIR_MAT} />
        </mesh>
        {/* Top peak — adds height */}
        <mesh position={[0, 0.85, 0.05]} scale={[0.6, 0.18, 0.5]}>
          <sphereGeometry args={[1, 24, 24]} />
          <meshPhysicalMaterial color={HAIR} {...HAIR_MAT} />
        </mesh>

        {/* ── Eyes ── */}
        <Eye position={L_EYE} irisRef={lIrisRef} eyelidRef={lLidRef} />
        <Eye position={R_EYE} irisRef={rIrisRef} eyelidRef={rLidRef} />

        {/* ── Eyebrows — thick and prominent like reference ── */}
        {/* Left brow */}
        <mesh position={[-0.34, 0.30, 0.78]} scale={[0.20, 0.045, 0.05]} rotation={[0, 0, -0.08]}>
          <boxGeometry args={[1, 1, 1, 1, 1, 1]} />
          <meshPhysicalMaterial color={BROW} roughness={0.5} />
        </mesh>
        {/* Left brow roundness */}
        <mesh position={[-0.34, 0.30, 0.78]} scale={[0.21, 0.048, 0.04]} rotation={[0, 0, -0.08]}>
          <sphereGeometry args={[1, 12, 8]} />
          <meshPhysicalMaterial color={BROW} roughness={0.5} />
        </mesh>
        {/* Right brow */}
        <mesh position={[0.34, 0.30, 0.78]} scale={[0.20, 0.045, 0.05]} rotation={[0, 0, 0.08]}>
          <boxGeometry args={[1, 1, 1, 1, 1, 1]} />
          <meshPhysicalMaterial color={BROW} roughness={0.5} />
        </mesh>
        {/* Right brow roundness */}
        <mesh position={[0.34, 0.30, 0.78]} scale={[0.21, 0.048, 0.04]} rotation={[0, 0, 0.08]}>
          <sphereGeometry args={[1, 12, 8]} />
          <meshPhysicalMaterial color={BROW} roughness={0.5} />
        </mesh>

        {/* ── Nose ── */}
        {/* Nose tip — rounder, more visible */}
        <mesh position={[0, -0.1, 0.94]} scale={[0.12, 0.13, 0.11]}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshPhysicalMaterial color={SKIN} {...SKIN_MAT} roughness={0.72} />
        </mesh>
        {/* Nose bridge */}
        <mesh position={[0, 0.04, 0.91]} scale={[0.055, 0.2, 0.065]}>
          <sphereGeometry args={[1, 12, 12]} />
          <meshPhysicalMaterial color={SKIN} {...SKIN_MAT} />
        </mesh>
        {/* Left nostril */}
        <mesh position={[-0.045, -0.17, 0.91]} scale={[0.04, 0.028, 0.035]}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshPhysicalMaterial color={NOSTRIL} roughness={0.8} />
        </mesh>
        {/* Right nostril */}
        <mesh position={[0.045, -0.17, 0.91]} scale={[0.04, 0.028, 0.035]}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshPhysicalMaterial color={NOSTRIL} roughness={0.8} />
        </mesh>

        {/* ── Mouth / Lips — subtle, calm expression ── */}
        {/* Upper lip */}
        <mesh position={[0, -0.32, 0.87]} scale={[0.17, 0.032, 0.065]} rotation={[0.08, 0, 0]}>
          <sphereGeometry args={[1, 16, 12]} />
          <meshPhysicalMaterial color={LIP} roughness={0.55} />
        </mesh>
        {/* Lower lip */}
        <mesh position={[0, -0.37, 0.86]} scale={[0.14, 0.032, 0.065]} rotation={[-0.04, 0, 0]}>
          <sphereGeometry args={[1, 16, 12]} />
          <meshPhysicalMaterial color={LIP} roughness={0.5} />
        </mesh>
        {/* Lip seam — thin dark line */}
        <mesh position={[0, -0.345, 0.88]} scale={[0.15, 0.004, 0.025]}>
          <sphereGeometry args={[1, 12, 4]} />
          <meshBasicMaterial color={LIP_LINE} />
        </mesh>

        {/* ── Ears — more prominent, sticking out ── */}
        {/* Left ear */}
        <group position={[-1.0, 0.0, -0.05]} rotation={[0, -0.35, 0]}>
          <mesh scale={[0.12, 0.22, 0.11]}>
            <sphereGeometry args={[1, 14, 14]} />
            <meshPhysicalMaterial color={SKIN} {...SKIN_MAT} />
          </mesh>
          {/* Inner ear detail */}
          <mesh position={[0.04, 0, 0.03]} scale={[0.06, 0.14, 0.06]}>
            <sphereGeometry args={[1, 10, 10]} />
            <meshPhysicalMaterial color={SKIN_SHADOW} roughness={0.85} />
          </mesh>
        </group>
        {/* Right ear */}
        <group position={[1.0, 0.0, -0.05]} rotation={[0, 0.35, 0]}>
          <mesh scale={[0.12, 0.22, 0.11]}>
            <sphereGeometry args={[1, 14, 14]} />
            <meshPhysicalMaterial color={SKIN} {...SKIN_MAT} />
          </mesh>
          {/* Inner ear detail */}
          <mesh position={[-0.04, 0, 0.03]} scale={[0.06, 0.14, 0.06]}>
            <sphereGeometry args={[1, 10, 10]} />
            <meshPhysicalMaterial color={SKIN_SHADOW} roughness={0.85} />
          </mesh>
        </group>
      </group>

      {/* ── Neck ── */}
      <mesh position={[0, -0.88, -0.05]}>
        <cylinderGeometry args={[0.28, 0.34, 0.5, 32]} />
        <meshPhysicalMaterial color={SKIN} {...SKIN_MAT} />
      </mesh>

      {/* ── Shoulders / Upper Torso — bare skin, no shirt ── */}
      {/* Main shoulder mass */}
      <mesh position={[0, -1.4, -0.1]} scale={[1.8, 0.6, 0.8]}>
        <sphereGeometry args={[1, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
        <meshPhysicalMaterial color={SKIN} {...SKIN_MAT} />
      </mesh>
      {/* Collarbone area */}
      <mesh position={[0, -1.08, 0.08]} scale={[0.6, 0.12, 0.42]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshPhysicalMaterial color={SKIN} {...SKIN_MAT} />
      </mesh>
      {/* Left shoulder round */}
      <mesh position={[-1.2, -1.35, -0.1]} scale={[0.55, 0.45, 0.5]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshPhysicalMaterial color={SKIN} {...SKIN_MAT} />
      </mesh>
      {/* Right shoulder round */}
      <mesh position={[1.2, -1.35, -0.1]} scale={[0.55, 0.45, 0.5]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshPhysicalMaterial color={SKIN} {...SKIN_MAT} />
      </mesh>
      {/* Chest area */}
      <mesh position={[0, -1.5, 0.05]} scale={[1.2, 0.5, 0.6]}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshPhysicalMaterial color={SKIN} {...SKIN_MAT} />
      </mesh>
    </group>
  )
}
