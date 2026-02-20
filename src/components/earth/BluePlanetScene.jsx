import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

/* ─── Shared scroll state ──────────────────────────────────────────────────── */

const scrollState = { progress: 0 }

/* ────────────────────────── Starfield Background ──────────────────────────── */

function Stars({ count = 500 }) {
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
      ref.current.rotation.y = scrollState.progress * 0.2
      ref.current.rotation.x = scrollState.progress * 0.1
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
        size={0.3}
        color="#ffffff"
        transparent
        opacity={0.6}
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
    timer: 2 + Math.random() * 6,
    pos: new THREE.Vector3(0, 100, 0),
    vel: new THREE.Vector3(),
    life: 0,
  })

  useFrame((_, delta) => {
    const d = data.current
    d.timer -= delta

    if (!d.active && d.timer <= 0) {
      d.active = true
      d.life = 0.5 + Math.random() * 0.4
      d.pos.set(
        (Math.random() - 0.5) * 25,
        6 + Math.random() * 8,
        -8 - Math.random() * 20
      )
      d.vel.set(-7 - Math.random() * 5, -5 - Math.random() * 4, Math.random() * 2)
    }

    if (d.active) {
      d.pos.addScaledVector(d.vel, delta)
      d.life -= delta
      if (d.life <= 0) {
        d.active = false
        d.timer = 6 + Math.random() * 12
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
      <sphereGeometry args={[0.07, 6, 6]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0} />
    </mesh>
  )
}

/* ──────────────────────── Jupiter (Procedural) ──────────────────────────── */

function Jupiter() {
  const meshRef = useRef()
  const groupRef = useRef()
  const targetPos = useRef(new THREE.Vector3(-1.5, 0, 0))
  const targetRot = useRef(new THREE.Euler(0.15, 0, 0.05))
  const targetScale = useRef(1)

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
        },
        vertexShader: /* glsl */ `
          varying vec2 vUv;
          varying vec3 vNormal;
          varying vec3 vPosition;
          void main() {
            vUv = uv;
            vNormal = normalize(normalMatrix * normal);
            vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          uniform float uTime;
          varying vec2 vUv;
          varying vec3 vNormal;
          varying vec3 vPosition;

          vec3 mod289(vec3 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
          vec4 mod289(vec4 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
          vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
          vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

          float snoise(vec3 v) {
            const vec2 C = vec2(1.0/6.0, 1.0/3.0);
            const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
            vec3 i = floor(v + dot(v, C.yyy));
            vec3 x0 = v - i + dot(i, C.xxx);
            vec3 g = step(x0.yzx, x0.xyz);
            vec3 l = 1.0 - g;
            vec3 i1 = min(g.xyz, l.zxy);
            vec3 i2 = max(g.xyz, l.zxy);
            vec3 x1 = x0 - i1 + C.xxx;
            vec3 x2 = x0 - i2 + C.yyy;
            vec3 x3 = x0 - D.yyy;
            i = mod289(i);
            vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
              + i.y + vec4(0.0, i1.y, i2.y, 1.0))
              + i.x + vec4(0.0, i1.x, i2.x, 1.0));
            float n_ = 0.142857142857;
            vec3 ns = n_ * D.wyz - D.xzx;
            vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
            vec4 x_ = floor(j * ns.z);
            vec4 y_ = floor(j - 7.0 * x_);
            vec4 x = x_ * ns.x + ns.yyyy;
            vec4 y = y_ * ns.x + ns.yyyy;
            vec4 h = 1.0 - abs(x) - abs(y);
            vec4 b0 = vec4(x.xy, y.xy);
            vec4 b1 = vec4(x.zw, y.zw);
            vec4 s0 = floor(b0)*2.0 + 1.0;
            vec4 s1 = floor(b1)*2.0 + 1.0;
            vec4 sh = -step(h, vec4(0.0));
            vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
            vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
            vec3 p0 = vec3(a0.xy, h.x);
            vec3 p1 = vec3(a0.zw, h.y);
            vec3 p2 = vec3(a1.xy, h.z);
            vec3 p3 = vec3(a1.zw, h.w);
            vec4 norm = taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
            p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
            vec4 m = max(0.6 - vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)), 0.0);
            m = m * m;
            return 42.0 * dot(m*m, vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
          }

          void main() {
            float t = uTime * 0.06;

            // Jupiter band colors
            vec3 cream     = vec3(0.85, 0.78, 0.62);
            vec3 tan       = vec3(0.72, 0.58, 0.38);
            vec3 brown     = vec3(0.50, 0.32, 0.18);
            vec3 darkBrown = vec3(0.30, 0.18, 0.10);
            vec3 rust      = vec3(0.65, 0.35, 0.15);

            // Horizontal latitude bands driven by UV.y
            float lat = vUv.y;
            float bandPattern = sin(lat * 28.0) * 0.5 + 0.5;

            // Add noise to distort bands (turbulent flow)
            float distort = snoise(vec3(vUv.x * 6.0 + t * 0.3, lat * 12.0, t * 0.1)) * 0.08;
            bandPattern = clamp(bandPattern + distort, 0.0, 1.0);

            // Color the bands — alternating light and dark zones
            vec3 col = mix(darkBrown, cream, bandPattern);
            col = mix(col, tan, smoothstep(0.3, 0.7, bandPattern));

            // Swirling storm detail along bands
            float swirl = snoise(vec3(vUv.x * 10.0 + t * 0.5, lat * 20.0, t * 0.15));
            col = mix(col, rust, smoothstep(0.2, 0.6, swirl) * 0.35);

            // Great Red Spot — a persistent oval storm
            float spotLat = 0.38;
            float spotLon = 0.65;
            float dx = (vUv.x - spotLon) * 2.5;
            float dy = (vUv.y - spotLat) * 5.0;
            float spot = exp(-(dx * dx + dy * dy) * 8.0);
            vec3 spotColor = vec3(0.72, 0.25, 0.10);
            col = mix(col, spotColor, spot * 0.7);

            // Limb darkening
            vec3 viewDir = normalize(-vPosition);
            float facing = max(dot(viewDir, vNormal), 0.0);
            col *= 0.5 + 0.5 * facing;

            gl_FragColor = vec4(col, 1.0);
          }
        `,
      }),
    []
  )

  useFrame((state, delta) => {
    if (!meshRef.current || !groupRef.current) return

    material.uniforms.uTime.value = state.clock.elapsedTime
    meshRef.current.rotation.y += delta * 0.04

    const p = scrollState.progress

    targetPos.current.set(-1.5 - p * 2.5, p * 1.8, -p * 2.5)
    targetRot.current.set(0.15 - p * 0.6, -p * 1.2, 0.05 + p * 0.3)
    targetScale.current = 1 - p * 0.3

    const lerpSpeed = 3.5 * delta
    groupRef.current.position.lerp(targetPos.current, lerpSpeed)

    groupRef.current.rotation.x += (targetRot.current.x - groupRef.current.rotation.x) * lerpSpeed
    groupRef.current.rotation.y += (targetRot.current.y - groupRef.current.rotation.y) * lerpSpeed
    groupRef.current.rotation.z += (targetRot.current.z - groupRef.current.rotation.z) * lerpSpeed

    const s = groupRef.current.scale.x + (targetScale.current - groupRef.current.scale.x) * lerpSpeed
    groupRef.current.scale.setScalar(s)
  })

  return (
    <group ref={groupRef} position={[-1.5, 0, 0]} rotation={[0.15, 0, 0.05]}>
      <mesh ref={meshRef} material={material}>
        <sphereGeometry args={[2, 48, 48]} />
      </mesh>
    </group>
  )
}

/* ─────────────────── Camera that responds to scroll ───────────────────────── */

function ScrollCamera() {
  const { camera } = useThree()

  useFrame((_, delta) => {
    const p = scrollState.progress
    const targetX = -p * 1.2
    const targetY = p * 0.5
    const targetZ = 5.5 + p * 2.5

    camera.position.x += (targetX - camera.position.x) * 3 * delta
    camera.position.y += (targetY - camera.position.y) * 3 * delta
    camera.position.z += (targetZ - camera.position.z) * 3 * delta
  })

  return null
}

/* ───────────────────────────── Main Scene Export ───────────────────────────── */

export default function BluePlanetScene({ sectionRef }) {
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
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ width: '100%', height: '100%' }}
    >
      <color attach="background" args={['#0b080c']} />

      <ambientLight intensity={0.12} color="#1a1520" />
      <directionalLight position={[4, 3, 5]} intensity={1.4} color="#ffe8cc" />
      <pointLight position={[-4, 0, 3]} intensity={0.3} color="#99aacc" />
      <pointLight position={[3, 1, -4]} intensity={1.8} color="#aa8855" />
      <pointLight position={[-2, 2, -3]} intensity={1.0} color="#887755" />

      <ScrollCamera />
      <Stars />
      <Jupiter />
      <ShootingStar />
    </Canvas>
  )
}
