import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import * as THREE from 'three'

/* ─── Shared scroll state (avoids re-renders) ──────────────────────────────── */

const scrollState = { progress: 0 }

/* ────────────────────────── Starfield Background ──────────────────────────── */

function Stars({ count = 600 }) {
  const ref = useRef()

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = 40 + Math.random() * 150
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      arr[i * 3 + 2] = r * Math.cos(phi)
    }
    return arr
  }, [count])

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y = scrollState.progress * 0.25
      ref.current.rotation.x = scrollState.progress * 0.12
    }
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.35}
        color="#ffffff"
        transparent
        opacity={0.65}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

/* ──────────────────── Shooting Star ───────────────────────────────────────── */

function ShootingStar() {
  const ref = useRef()
  const data = useRef({
    active: false,
    timer: 3 + Math.random() * 5,
    pos: new THREE.Vector3(0, 100, 0),
    vel: new THREE.Vector3(),
    life: 0,
  })

  useFrame((_, delta) => {
    const d = data.current
    d.timer -= delta

    if (!d.active && d.timer <= 0) {
      d.active = true
      d.life = 0.6 + Math.random() * 0.4
      d.pos.set(
        (Math.random() - 0.3) * 20,
        5 + Math.random() * 8,
        -10 - Math.random() * 20
      )
      d.vel.set(-8 - Math.random() * 6, -6 - Math.random() * 4, Math.random() * 2)
    }

    if (d.active) {
      d.pos.addScaledVector(d.vel, delta)
      d.life -= delta
      if (d.life <= 0) {
        d.active = false
        d.timer = 6 + Math.random() * 10
        d.pos.set(0, 100, 0)
      }
    }

    if (ref.current) {
      ref.current.position.copy(d.pos)
      ref.current.material.opacity = d.active ? Math.max(d.life * 2, 0) : 0
    }
  })

  return (
    <mesh ref={ref} position={[0, 100, 0]}>
      <sphereGeometry args={[0.08, 6, 6]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0} />
    </mesh>
  )
}

/* ────────────────────────────── Planet Globe ───────────────────────────────── */

function Planet() {
  const meshRef = useRef()
  const groupRef = useRef()
  const targetPos = useRef(new THREE.Vector3(-2.5, 0, 0))
  const targetRot = useRef(new THREE.Euler(-0.1, 0, -0.15))
  const targetScale = useRef(1)

  const texture = useLoader(THREE.TextureLoader, '/textures/mars.jpg')
  texture.colorSpace = THREE.SRGBColorSpace
  texture.minFilter = THREE.LinearMipmapLinearFilter
  texture.magFilter = THREE.LinearFilter
  texture.anisotropy = 8

  useFrame((_, delta) => {
    if (!meshRef.current || !groupRef.current) return

    meshRef.current.rotation.y -= delta * 0.06

    const p = scrollState.progress

    targetPos.current.set(-2.5 - p * 2.0, p * 2.0, -p * 3.0)
    targetRot.current.set(-0.1 + p * 0.8, p * 1.5, -0.15 - p * 0.4)
    targetScale.current = 1 - p * 0.35

    const lerpSpeed = 3.5 * delta
    groupRef.current.position.lerp(targetPos.current, lerpSpeed)

    groupRef.current.rotation.x += (targetRot.current.x - groupRef.current.rotation.x) * lerpSpeed
    groupRef.current.rotation.y += (targetRot.current.y - groupRef.current.rotation.y) * lerpSpeed
    groupRef.current.rotation.z += (targetRot.current.z - groupRef.current.rotation.z) * lerpSpeed

    const s = groupRef.current.scale.x + (targetScale.current - groupRef.current.scale.x) * lerpSpeed
    groupRef.current.scale.setScalar(s)
  })

  return (
    <group ref={groupRef} position={[-2.5, 0, 0]} rotation={[-0.1, 0, -0.15]}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.65}
          metalness={0.05}
          emissive="#331108"
          emissiveIntensity={0.4}
        />
      </mesh>
    </group>
  )
}

/* ─────────────────── Camera that responds to scroll ───────────────────────── */

function ScrollCamera() {
  const { camera } = useThree()

  useFrame((_, delta) => {
    const p = scrollState.progress
    const targetX = p * 1.5
    const targetY = p * 0.6
    const targetZ = 5.5 + p * 3.0

    camera.position.x += (targetX - camera.position.x) * 3 * delta
    camera.position.y += (targetY - camera.position.y) * 3 * delta
    camera.position.z += (targetZ - camera.position.z) * 3 * delta
  })

  return null
}

/* ──────────────── Dynamic lights ───────────────────────────────────────────── */

function DynamicLights() {
  const rimRef1 = useRef()
  const rimRef2 = useRef()

  useFrame((_, delta) => {
    const p = scrollState.progress
    if (rimRef1.current) {
      const t1 = 2 + p * 3
      rimRef1.current.intensity += (t1 - rimRef1.current.intensity) * 3 * delta
    }
    if (rimRef2.current) {
      const t2 = 1.2 + p * 2
      rimRef2.current.intensity += (t2 - rimRef2.current.intensity) * 3 * delta
    }
  })

  return (
    <>
      <ambientLight intensity={0.5} color="#3d2020" />
      <directionalLight position={[-2, 2, 6]} intensity={2.5} color="#ffeedd" />
      <pointLight position={[-4, 1, 4]} intensity={1.5} color="#ff9966" />
      <pointLight ref={rimRef1} position={[-3, 1, -4]} intensity={2} color="#8866cc" />
      <pointLight ref={rimRef2} position={[2, 2, -3]} intensity={1.2} color="#9977bb" />
    </>
  )
}

/* ───────────────────────────── Main Scene Export ───────────────────────────── */

export default function PlanetScene({ sectionRef }) {
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef?.current) return
      const rect = sectionRef.current.getBoundingClientRect()
      const viewH = window.innerHeight
      const raw = 1 - (rect.bottom / (viewH + rect.height))
      scrollState.progress = Math.max(0, Math.min(raw, 1))
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [sectionRef])

  return (
    <Canvas
      camera={{ position: [0, 0, 5.5], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ width: '100%', height: '100%' }}
    >
      <color attach="background" args={['#0b080c']} />

      <DynamicLights />
      <ScrollCamera />
      <Stars />
      <Planet />
      <ShootingStar />
    </Canvas>
  )
}
