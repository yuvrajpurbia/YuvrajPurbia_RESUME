import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

/* ─── Planet presets ──────────────────────────────────────────────────────── */

const PRESETS = {
  saturn: {
    colors: {
      c1: [0.85, 0.75, 0.45],
      c2: [0.72, 0.58, 0.28],
      c3: [0.50, 0.38, 0.15],
      c4: [0.30, 0.20, 0.06],
      c5: [0.80, 0.65, 0.25],
    },
    bandFreq: 24.0,
    noiseScale: 0.05,
    hasRing: true,
    starCount: 250,
    startPos: [1.5, 0.3, 0],
    scrollDrift: [1.5, 1.0, -2.0],
    startRot: [0.4, 0, -0.15],
    scrollRot: [-0.3, -0.8, 0.2],
    lightColor: '#ffe8aa',
    rimColor: '#aa8844',
    camScroll: [-1.0, 0.3, 2.0],
  },
  neptune: {
    colors: {
      c1: [0.12, 0.28, 0.60],
      c2: [0.22, 0.42, 0.75],
      c3: [0.08, 0.15, 0.38],
      c4: [0.30, 0.55, 0.85],
      c5: [0.15, 0.35, 0.55],
    },
    bandFreq: 14.0,
    noiseScale: 0.12,
    hasRing: false,
    starCount: 250,
    startPos: [2, 0.5, 0],
    scrollDrift: [1.5, -1.0, -2.0],
    startRot: [0.1, 0, 0.05],
    scrollRot: [-0.3, -0.6, 0.15],
    lightColor: '#aaccff',
    rimColor: '#4466aa',
    camScroll: [-0.8, 0.4, 2.5],
  },
  venus: {
    colors: {
      c1: [0.88, 0.80, 0.58],
      c2: [0.75, 0.65, 0.42],
      c3: [0.60, 0.50, 0.32],
      c4: [0.92, 0.85, 0.65],
      c5: [0.72, 0.62, 0.40],
    },
    bandFreq: 10.0,
    noiseScale: 0.18,
    hasRing: false,
    starCount: 200,
    startPos: [-1.5, 0, 0],
    scrollDrift: [-1.5, 1.0, -2.0],
    startRot: [-0.1, 0, 0.1],
    scrollRot: [0.3, 0.8, -0.2],
    lightColor: '#fff0cc',
    rimColor: '#998855',
    camScroll: [1.0, 0.3, 2.0],
  },
  purple: {
    colors: {
      c1: [0.48, 0.32, 0.68],
      c2: [0.58, 0.42, 0.78],
      c3: [0.28, 0.14, 0.48],
      c4: [0.68, 0.52, 0.88],
      c5: [0.38, 0.22, 0.58],
    },
    bandFreq: 18.0,
    noiseScale: 0.10,
    hasRing: false,
    starCount: 200,
    startPos: [2, 0, 0],
    scrollDrift: [1.5, -0.5, -1.5],
    startRot: [0.15, 0, -0.1],
    scrollRot: [-0.4, -1.0, 0.25],
    lightColor: '#ccaaff',
    rimColor: '#7744bb',
    camScroll: [-1.2, 0.5, 2.5],
  },
  violet: {
    colors: {
      c1: [0.55, 0.30, 0.72],
      c2: [0.65, 0.40, 0.85],
      c3: [0.35, 0.18, 0.55],
      c4: [0.75, 0.55, 0.95],
      c5: [0.45, 0.25, 0.65],
    },
    bandFreq: 12.0,
    noiseScale: 0.14,
    hasRing: false,
    starCount: 300,
    startPos: [0, 0.3, 0],
    scrollDrift: [0, -0.4, -1.0],
    startRot: [0.1, 0, 0.05],
    scrollRot: [-0.15, -0.4, 0.1],
    lightColor: '#d4aaff',
    rimColor: '#9955dd',
    camScroll: [0, 0.2, 1.5],
  },
  mercury: {
    colors: {
      c1: [0.52, 0.48, 0.46],
      c2: [0.40, 0.36, 0.34],
      c3: [0.28, 0.25, 0.24],
      c4: [0.62, 0.58, 0.55],
      c5: [0.35, 0.32, 0.30],
    },
    bandFreq: 6.0,
    noiseScale: 0.30,
    hasRing: false,
    starCount: 300,
    startPos: [0, 0.3, 0],
    scrollDrift: [0, -0.4, -1.0],
    startRot: [0.15, 0, 0.05],
    scrollRot: [-0.15, -0.4, 0.1],
    lightColor: '#e8e0d8',
    rimColor: '#887870',
    camScroll: [0, 0.2, 1.5],
  },
}

/* ─── Simplex noise GLSL (shared) ─────────────────────────────────────────── */

const NOISE_GLSL = /* glsl */ `
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
`

/* ────────────────────────── Starfield ──────────────────────────────────────── */

function Stars({ scrollRef, count }) {
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
      ref.current.rotation.y = scrollRef.current.progress * 0.2
      ref.current.rotation.x = scrollRef.current.progress * 0.1
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
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

/* ────────────────────── Scroll Camera ──────────────────────────────────────── */

function ScrollCamera({ scrollRef, camScroll }) {
  const { camera } = useThree()

  useFrame((_, delta) => {
    const p = scrollRef.current.progress
    const targetX = camScroll[0] * p
    const targetY = camScroll[1] * p
    const targetZ = 5.5 + camScroll[2] * p

    camera.position.x += (targetX - camera.position.x) * 3 * delta
    camera.position.y += (targetY - camera.position.y) * 3 * delta
    camera.position.z += (targetZ - camera.position.z) * 3 * delta
  })

  return null
}

/* ────────────────────── Saturn Ring ────────────────────────────────────────── */

function SaturnRing() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
        vertexShader: /* glsl */ `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          varying vec2 vUv;
          void main() {
            float r = length(vUv - 0.5) * 2.0;
            float alpha = smoothstep(0.55, 0.65, r) * smoothstep(1.0, 0.92, r);
            vec3 col = mix(vec3(0.85, 0.75, 0.45), vec3(0.55, 0.42, 0.25), clamp((r - 0.6) * 2.5, 0.0, 1.0));
            float bands = sin(r * 120.0) * 0.5 + 0.5;
            alpha *= 0.3 + bands * 0.35;
            gl_FragColor = vec4(col, alpha * 0.5);
          }
        `,
      }),
    []
  )

  return (
    <mesh rotation={[Math.PI / 2.2, 0, 0]} material={material}>
      <ringGeometry args={[2.4, 4.2, 64]} />
    </mesh>
  )
}

/* ────────────────────── Procedural Planet ──────────────────────────────────── */

function ProceduralPlanet({ scrollRef, config }) {
  const meshRef = useRef()
  const groupRef = useRef()
  const targetPos = useRef(new THREE.Vector3(...config.startPos))
  const targetRot = useRef(new THREE.Euler(...config.startRot))
  const targetScale = useRef(1)

  const material = useMemo(() => {
    const { colors } = config
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uC1: { value: new THREE.Vector3(...colors.c1) },
        uC2: { value: new THREE.Vector3(...colors.c2) },
        uC3: { value: new THREE.Vector3(...colors.c3) },
        uC4: { value: new THREE.Vector3(...colors.c4) },
        uC5: { value: new THREE.Vector3(...colors.c5) },
        uBandFreq: { value: config.bandFreq },
        uNoiseScale: { value: config.noiseScale },
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
        uniform vec3 uC1, uC2, uC3, uC4, uC5;
        uniform float uBandFreq;
        uniform float uNoiseScale;
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;

        ${NOISE_GLSL}

        void main() {
          float t = uTime * 0.06;
          float lat = vUv.y;
          float bandPattern = sin(lat * uBandFreq) * 0.5 + 0.5;
          float distort = snoise(vec3(vUv.x * 6.0 + t * 0.3, lat * 12.0, t * 0.1)) * uNoiseScale;
          bandPattern = clamp(bandPattern + distort, 0.0, 1.0);

          vec3 col = mix(uC4, uC1, bandPattern);
          col = mix(col, uC2, smoothstep(0.3, 0.7, bandPattern));

          float swirl = snoise(vec3(vUv.x * 8.0 + t * 0.4, lat * 15.0, t * 0.12));
          col = mix(col, uC5, smoothstep(0.2, 0.6, swirl) * 0.25);

          vec3 viewDir = normalize(-vPosition);
          float facing = max(dot(viewDir, vNormal), 0.0);
          col *= 0.7 + 0.3 * facing;

          gl_FragColor = vec4(col, 1.0);
        }
      `,
    })
  }, [config])

  useFrame((state, delta) => {
    if (!meshRef.current || !groupRef.current) return

    material.uniforms.uTime.value = state.clock.elapsedTime
    meshRef.current.rotation.y += delta * 0.04

    const p = scrollRef.current.progress

    targetPos.current.set(
      config.startPos[0] + config.scrollDrift[0] * p,
      config.startPos[1] + config.scrollDrift[1] * p,
      config.startPos[2] + config.scrollDrift[2] * p
    )
    targetRot.current.set(
      config.startRot[0] + config.scrollRot[0] * p,
      config.startRot[1] + config.scrollRot[1] * p,
      config.startRot[2] + config.scrollRot[2] * p
    )
    targetScale.current = 1 - p * 0.3

    const ls = 3.5 * delta
    groupRef.current.position.lerp(targetPos.current, ls)

    groupRef.current.rotation.x += (targetRot.current.x - groupRef.current.rotation.x) * ls
    groupRef.current.rotation.y += (targetRot.current.y - groupRef.current.rotation.y) * ls
    groupRef.current.rotation.z += (targetRot.current.z - groupRef.current.rotation.z) * ls

    const s = groupRef.current.scale.x + (targetScale.current - groupRef.current.scale.x) * ls
    groupRef.current.scale.setScalar(s)
  })

  return (
    <group ref={groupRef} position={config.startPos} rotation={config.startRot}>
      <mesh ref={meshRef} material={material}>
        <sphereGeometry args={[2, 32, 32]} />
      </mesh>
      {config.hasRing && <SaturnRing />}
    </group>
  )
}

/* ───────────────────────────── Main Scene Export ───────────────────────────── */

export default function GenericPlanetScene({ sectionRef, preset = 'saturn' }) {
  const scrollRef = useRef({ progress: 0 })
  const config = PRESETS[preset]

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef?.current) return
      const rect = sectionRef.current.getBoundingClientRect()
      const viewH = window.innerHeight
      const raw = 1 - (rect.bottom / (viewH + rect.height))
      scrollRef.current.progress = Math.max(0, Math.min(raw, 1))
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

      <ambientLight intensity={0.45} color="#2a2030" />
      <directionalLight position={[-2, 2, 6]} intensity={2.2} color={config.lightColor} />
      <pointLight position={[-4, 1, 4]} intensity={1.4} color={config.lightColor} />
      <pointLight position={[-3, 1, -4]} intensity={1.2} color={config.rimColor} />
      <pointLight position={[2, 2, -3]} intensity={0.8} color={config.rimColor} />

      <ScrollCamera scrollRef={scrollRef} camScroll={config.camScroll} />
      <Stars scrollRef={scrollRef} count={config.starCount} />
      <ProceduralPlanet scrollRef={scrollRef} config={config} />
    </Canvas>
  )
}
