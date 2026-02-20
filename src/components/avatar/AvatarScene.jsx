import { Suspense, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'
import Avatar from './Avatar'

/* ────────────────────── Purple Glow Behind Character ─────────────────────── */

function PurpleGlow() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: {
          uColor: { value: new THREE.Color('#8040cc') },
          uIntensity: { value: 0.28 },
        },
        vertexShader: /* glsl */ `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          uniform vec3 uColor;
          uniform float uIntensity;
          varying vec2 vUv;
          void main() {
            float d = length(vUv - 0.5) * 2.0;
            float a = smoothstep(1.0, 0.0, d) * uIntensity;
            gl_FragColor = vec4(uColor, a);
          }
        `,
      }),
    []
  )

  return (
    <mesh position={[0, -0.2, -2.5]} material={material}>
      <planeGeometry args={[10, 10]} />
    </mesh>
  )
}

/* ───────────────────────── Soft Shadow Beneath ───────────────────────────── */

function SoftShadow() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: {},
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
            float d = length(vUv - 0.5) * 2.0;
            float a = smoothstep(1.0, 0.0, d) * 0.3;
            gl_FragColor = vec4(0.0, 0.0, 0.0, a);
          }
        `,
      }),
    []
  )

  return (
    <mesh
      position={[0, -2.5, 0.5]}
      rotation={[-Math.PI / 2, 0, 0]}
      material={material}
    >
      <planeGeometry args={[4, 4]} />
    </mesh>
  )
}

/* ─────────────────────────── Main Scene Export ────────────────────────────── */

export default function AvatarScene() {
  return (
    <Canvas
      camera={{ position: [0, 0.15, 3.8], fov: 30 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ width: '100%', height: '100%' }}
    >
      <color attach="background" args={['#0b080c']} />

      {/* ── Ambient — very dim base ── */}
      <ambientLight intensity={0.15} color="#1a1025" />

      {/* ── Key light — warm, upper right, strong ── */}
      <directionalLight
        position={[3, 2.5, 4]}
        intensity={2.0}
        color="#fff5e6"
      />

      {/* ── Fill light — cool, from left, moderate ── */}
      <pointLight position={[-3, 0.5, 3]} intensity={0.4} color="#99aadd" />

      {/* ── Rim light — STRONG purple/pink, behind right ── */}
      <pointLight position={[2.5, 1.0, -2.5]} intensity={5} color="#dd88ff" />

      {/* ── Rim light 2 — purple, behind left ── */}
      <pointLight position={[-2, 1.5, -2]} intensity={3.5} color="#c2a4ff" />

      {/* ── Top rim — purple highlight on hair ── */}
      <pointLight position={[0, 3, -1]} intensity={2} color="#bb77ff" />

      {/* ── Bottom fill — very subtle warm ── */}
      <pointLight position={[0, -3, 2]} intensity={0.15} color="#aa7766" />

      <Suspense fallback={null}>
        <Avatar />
        <PurpleGlow />
        <SoftShadow />
      </Suspense>

      <EffectComposer>
        <Bloom
          intensity={0.35}
          luminanceThreshold={0.55}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
        <Vignette offset={0.3} darkness={0.7} />
      </EffectComposer>
    </Canvas>
  )
}
