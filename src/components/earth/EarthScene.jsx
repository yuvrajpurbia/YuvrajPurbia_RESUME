import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import * as THREE from 'three'

/* ─── Shared scroll state (avoids re-renders) ──────────────────────────────── */

const scrollState = { progress: 0 }

/* ────────────────────────── Starfield Background ──────────────────────────── */

function Stars({ count = 800 }) {
  const ref = useRef()

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = 50 + Math.random() * 150
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
      ref.current.rotation.y = scrollState.progress * 0.3
      ref.current.rotation.x = scrollState.progress * 0.15
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
        size={0.4}
        color="#ffffff"
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

/* ────────────────────────────── Earth Globe ────────────────────────────────── */

function Earth() {
  const earthRef = useRef()
  const groupRef = useRef()
  const targetPos = useRef(new THREE.Vector3(0, 0, 0))
  const targetRot = useRef(new THREE.Euler(0.15, 0, 0.1))
  const targetScale = useRef(1)

  const texture = useLoader(THREE.TextureLoader, '/textures/earth.jpg')
  texture.colorSpace = THREE.SRGBColorSpace

  useFrame((_, delta) => {
    if (!earthRef.current || !groupRef.current) return

    earthRef.current.rotation.y += delta * 0.08

    const p = scrollState.progress

    targetPos.current.set(-p * 3.5, p * 1.2, -p * 2)
    targetRot.current.set(0.15 + p * 0.6, p * 1.2, 0.1 - p * 0.3)
    targetScale.current = 1 - p * 0.25

    const lerpSpeed = 3 * delta
    groupRef.current.position.lerp(targetPos.current, lerpSpeed)

    groupRef.current.rotation.x += (targetRot.current.x - groupRef.current.rotation.x) * lerpSpeed
    groupRef.current.rotation.y += (targetRot.current.y - groupRef.current.rotation.y) * lerpSpeed
    groupRef.current.rotation.z += (targetRot.current.z - groupRef.current.rotation.z) * lerpSpeed

    const s = groupRef.current.scale.x + (targetScale.current - groupRef.current.scale.x) * lerpSpeed
    groupRef.current.scale.setScalar(s)
  })

  return (
    <group ref={groupRef} rotation={[0.15, 0, 0.1]}>
      <mesh ref={earthRef}>
        <sphereGeometry args={[2.5, 48, 48]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.9}
          metalness={0.05}
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
    const targetX = p * 1.0
    const targetY = p * 0.8
    const targetZ = 6.5 + p * 3

    camera.position.x += (targetX - camera.position.x) * 3 * delta
    camera.position.y += (targetY - camera.position.y) * 3 * delta
    camera.position.z += (targetZ - camera.position.z) * 3 * delta
  })

  return null
}

/* ───────────────────────────── Main Scene Export ───────────────────────────── */

export default function EarthScene() {
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset
      const viewH = window.innerHeight
      scrollState.progress = Math.min(scrollY / viewH, 1)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <Canvas
      camera={{ position: [0, 0, 6.5], fov: 45 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ width: '100%', height: '100%' }}
    >
      <color attach="background" args={['#0b080c']} />

      <ambientLight intensity={0.15} color="#1a1025" />
      <directionalLight position={[5, 3, 5]} intensity={1.5} color="#fff5e6" />
      <pointLight position={[-4, 1, 3]} intensity={0.3} color="#99aadd" />
      <pointLight position={[3, 1, -4]} intensity={2.5} color="#6699ff" />
      <pointLight position={[-2, 2, -3]} intensity={1.5} color="#88aaff" />

      <ScrollCamera />
      <Stars />
      <Earth />
    </Canvas>
  )
}
