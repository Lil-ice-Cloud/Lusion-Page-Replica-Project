<template>
  <!--
    ┌─────────────────────────────────────────────────────────────────┐
    │  SpaceScroll.vue — self-contained section, Nuxt 4 / Three.js   │
    │  Canvas is sticky INSIDE this section only.                     │
    │  Your page content above & below is completely unaffected.      │
    └─────────────────────────────────────────────────────────────────┘

    Usage in any page or layout:

      <YourHeader />
      <SpaceScroll />        ← sits exactly here, like any other section
      <YourFooter />
  -->
  <section class="ss-section" ref="sectionRef">

    <!-- The canvas sticks to the viewport ONLY while this section is in view -->
    <div class="ss-sticky">
      <canvas ref="canvasRef" class="ss-canvas" />

      <!-- Chapter text overlays (fade in/out per chapter) -->
      <div class="ss-overlay">

        <transition name="fade">
          <div v-if="chapter === 0" class="ss-text ss-text--left" key="c0">
            <p class="ss-eyebrow">EST. 2025 · DEEP SPACE DIVISION</p>
            <h2 class="ss-headline">
              <span class="ss-line">BEYOND</span>
              <span class="ss-line ss-accent">THE</span>
              <span class="ss-line">HORIZON</span>
            </h2>
            <p class="ss-sub">Scroll to journey through the cosmos</p>
            <span class="ss-arrow">↓</span>
          </div>
        </transition>

        <transition name="fade">
          <div v-if="chapter === 1" class="ss-text ss-text--right" key="c1">
            <p class="ss-eyebrow">CHAPTER I</p>
            <h2 class="ss-chapter">The Nebula<br />Drift</h2>
            <p class="ss-body">
              Massive clouds of gas and dust collapse under gravity,
              igniting the furnaces that illuminate the dark.
            </p>
          </div>
        </transition>

        <transition name="fade">
          <div v-if="chapter === 2" class="ss-text ss-text--left" key="c2">
            <p class="ss-eyebrow">CHAPTER II</p>
            <h2 class="ss-chapter ss-chapter--blue">Warp<br />Speed</h2>
            <p class="ss-body">
              At 299,792 km/s light bends around us —
              the universe becomes a tunnel of streaking stars.
            </p>
          </div>
        </transition>

        <transition name="fade">
          <div v-if="chapter === 3" class="ss-text ss-text--right" key="c3">
            <p class="ss-eyebrow">CHAPTER III</p>
            <h2 class="ss-chapter ss-chapter--violet">The<br />Void</h2>
            <p class="ss-body">
              Between galaxies lies 10<sup>−29</sup> g/cm³ of nothingness —
              and yet, it hums with dark energy.
            </p>
          </div>
        </transition>

        <transition name="fade">
          <div v-if="chapter === 4" class="ss-text ss-text--center" key="c4">
            <p class="ss-eyebrow">END TRANSMISSION</p>
            <h2 class="ss-chapter">You've<br />Arrived.</h2>
            <p class="ss-body">
              The journey of a thousand light-years begins with a single scroll.
            </p>
          </div>
        </transition>

        <!-- Progress dots -->
        <div class="ss-dots">
          <span
            v-for="n in 5"
            :key="n"
            class="ss-dot"
            :class="{ 'ss-dot--active': chapter === n - 1 }"
          />
        </div>

      </div>
    </div>

    <!--
      Scroll spacer — this is what creates the scroll distance.
      Each chapter gets one viewport height of scroll room.
      Total = 5 chapters × 100vh = 500vh of scroll inside this section.
    -->
    <div class="ss-spacer" />

  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'

// ── Refs ─────────────────────────────────────────────────────────────────────
const sectionRef = ref(null)
const canvasRef  = ref(null)
const chapter    = ref(0)          // 0-4, drives the v-if text transitions

// ── Three.js state ───────────────────────────────────────────────────────────
let renderer, scene, camera, clock, animId
let starField, nebulaParticles, warpLines, voidOrb

// ── Scroll state ─────────────────────────────────────────────────────────────
let smoothProgress = 0   // 0 → 1 over the section's scroll range

// ── Helpers ──────────────────────────────────────────────────────────────────
const lerp      = (a, b, t) => a + (b - a) * t
const clamp01   = (v)       => Math.max(0, Math.min(1, v))
const easeInOut = (t)       => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t

/** Return progress 0→1 within a sub-range of the overall 0→1 progress */
const subProgress = (p, start, end) => clamp01((p - start) / (end - start))

// ── Three.js builders ────────────────────────────────────────────────────────
function buildStars() {
  const count = 8000
  const pos   = new Float32Array(count * 3)
  const col   = new Float32Array(count * 3)

  for (let i = 0; i < count; i++) {
    pos[i*3]   = (Math.random() - 0.5) * 600
    pos[i*3+1] = (Math.random() - 0.5) * 600
    pos[i*3+2] = (Math.random() - 0.5) * 600
    const warm = Math.random() > 0.5
    col[i*3]   = warm ? 1.0 : 0.6
    col[i*3+1] = warm ? 0.9 : 0.7
    col[i*3+2] = warm ? 0.7 : 1.0
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  geo.setAttribute('color',    new THREE.BufferAttribute(col, 3))

  return new THREE.Points(geo, new THREE.PointsMaterial({
    size: 0.8, sizeAttenuation: true, vertexColors: true,
    transparent: true, opacity: 0.9,
    blending: THREE.AdditiveBlending, depthWrite: false,
  }))
}

function buildNebula() {
  const group  = new THREE.Group()
  const colors = [0xff3377, 0x3366ff, 0xaa44ff, 0x00ccff].map(c => new THREE.Color(c))

  colors.forEach((color, ci) => {
    const count = 1200
    const pos   = new Float32Array(count * 3)
    const col   = new Float32Array(count * 3)
    const cx = (Math.random() - 0.5) * 40
    const cy = (Math.random() - 0.5) * 20
    const cz = -60 - ci * 20

    for (let i = 0; i < count; i++) {
      const r     = Math.pow(Math.random(), 2) * 25
      const theta = Math.random() * Math.PI * 2
      const phi   = Math.random() * Math.PI
      pos[i*3]   = cx + r * Math.sin(phi) * Math.cos(theta)
      pos[i*3+1] = cy + r * Math.sin(phi) * Math.sin(theta) * 0.5
      pos[i*3+2] = cz + r * Math.cos(phi) * 0.3
      col[i*3]   = color.r + (Math.random() - 0.5) * 0.3
      col[i*3+1] = color.g + (Math.random() - 0.5) * 0.3
      col[i*3+2] = color.b + (Math.random() - 0.5) * 0.3
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geo.setAttribute('color',    new THREE.BufferAttribute(col, 3))

    group.add(new THREE.Points(geo, new THREE.PointsMaterial({
      size: 1.5, vertexColors: true, transparent: true, opacity: 0,
      blending: THREE.AdditiveBlending, depthWrite: false,
    })))
  })
  return group
}

function buildWarpLines() {
  const group = new THREE.Group()
  for (let i = 0; i < 300; i++) {
    const theta  = Math.random() * Math.PI * 2
    const radius = Math.random() * 30 + 2
    const x = Math.cos(theta) * radius
    const y = Math.sin(theta) * radius
    const len = Math.random() * 8 + 2

    const geo = new THREE.BufferGeometry()
    geo.setFromPoints([
      new THREE.Vector3(x, y, 0),
      new THREE.Vector3(x * 1.02, y * 1.02, -len),
    ])

    group.add(new THREE.Line(geo, new THREE.LineBasicMaterial({
      color: new THREE.Color().setHSL(0.55 + Math.random() * 0.15, 1, 0.8),
      transparent: true, opacity: 0,
      blending: THREE.AdditiveBlending,
    })))
  }
  return group
}

function buildVoidOrb() {
  const group = new THREE.Group()
  group.add(new THREE.Mesh(
    new THREE.SphereGeometry(5, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0 })
  ))
  for (let r = 0; r < 5; r++) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(6 + r * 1.5, 0.08, 8, 80),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(0.65 + r * 0.04, 1, 0.7),
        transparent: true, opacity: 0,
        blending: THREE.AdditiveBlending,
      })
    )
    ring.rotation.x = Math.random() * Math.PI
    ring.rotation.y = Math.random() * Math.PI
    group.add(ring)
  }
  group.position.set(10, 0, -40)
  return group
}

// ── Init ─────────────────────────────────────────────────────────────────────
function initThree() {
  const canvas = canvasRef.value
  const W = canvas.parentElement.clientWidth
  const H = window.innerHeight

  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false })
  renderer.setSize(W, H)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setClearColor(0x00000a, 1)

  scene  = new THREE.Scene()
  scene.fog = new THREE.FogExp2(0x00000a, 0.003)

  camera = new THREE.PerspectiveCamera(75, W / H, 0.1, 1000)
  camera.position.set(0, 0, 30)

  clock = new THREE.Clock()

  starField      = buildStars();      scene.add(starField)
  nebulaParticles = buildNebula();    scene.add(nebulaParticles)
  warpLines      = buildWarpLines();  warpLines.position.z = -60; scene.add(warpLines)
  voidOrb        = buildVoidOrb();    scene.add(voidOrb)
}

// ── Animate loop ─────────────────────────────────────────────────────────────
function animate() {
  animId = requestAnimationFrame(animate)
  const t = clock.getElapsedTime()

  // ── Section-relative scroll progress ──
  const section = sectionRef.value
  if (!section) return

  const rect     = section.getBoundingClientRect()
  const scrolled = -rect.top                          // px scrolled INTO section
  const total    = section.clientHeight - window.innerHeight  // total scrollable px
  const rawProgress = total > 0 ? clamp01(scrolled / total) : 0

  smoothProgress = lerp(smoothProgress, rawProgress, 0.07)
  const p = smoothProgress

  // ── Chapter detection (5 equal bands) ──
  chapter.value = Math.min(4, Math.floor(p * 5))

  // ── Camera journey ──
  camera.position.z = 30 - p * 100
  camera.position.x = Math.sin(p * Math.PI * 2) * 3
  camera.position.y = Math.sin(p * Math.PI) * 5
  camera.rotation.z = p * 0.3

  // ── Stars (always on) ──
  starField.rotation.y = t * 0.02
  starField.rotation.x = t * 0.005

  // ── Nebula (p 0.20 → 0.45) ──
  const nebulaP = easeInOut(subProgress(p, 0.20, 0.45))
  nebulaParticles.children.forEach(c => { c.material.opacity = nebulaP * 0.7 })
  nebulaParticles.rotation.y = t * 0.03
  nebulaParticles.rotation.z = t * 0.01

  // ── Warp (p 0.45 → 0.70) ──
  const warpP = easeInOut(subProgress(p, 0.45, 0.70))
  warpLines.children.forEach(l => { l.material.opacity = warpP * 0.9 })
  warpLines.position.z = -60 + warpP * 40
  camera.fov = 75 + warpP * 30
  camera.updateProjectionMatrix()

  // ── Void orb (p 0.72 → 1.0) ──
  const voidP = easeInOut(subProgress(p, 0.72, 1.0))
  voidOrb.children.forEach((child, i) => {
    child.material.opacity = i === 0 ? voidP * 0.98 : voidP * 0.5
  })
  voidOrb.rotation.y = t * 0.1
  voidOrb.rotation.x = t * 0.07

  renderer.render(scene, camera)
}

// ── Resize ────────────────────────────────────────────────────────────────────
function onResize() {
  if (!renderer || !camera) return
  const W = canvasRef.value.parentElement.clientWidth
  const H = window.innerHeight
  renderer.setSize(W, H)
  camera.aspect = W / H
  camera.updateProjectionMatrix()
}

// ── Lifecycle ────────────────────────────────────────────────────────────────
onMounted(() => {
  initThree()
  animate()
  window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(animId)
  renderer?.dispose()
  window.removeEventListener('resize', onResize)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400&display=swap');

/* ── Section shell ───────────────────────────────────────────────────────── */
/*
   position:relative + a tall spacer = the section owns its own scroll budget.
   Nothing outside this section is touched.
*/
.ss-section {
  position: relative;
  width: 100%;
  /* background matches the canvas clear colour so edges blend seamlessly */
  background: #00000a;
}

/* ── Spacer — 5 chapters × 100vh ────────────────────────────────────────── */
.ss-spacer {
  height: 500vh;
}

/* ── Sticky viewport frame ───────────────────────────────────────────────── */
/*
   sticky + height:100vh means the canvas viewport "locks" while you scroll
   through the spacer, then releases when you leave the section.
*/
.ss-sticky {
  position: sticky;
  top: 0;
  height: 100vh;
  width: 100%;
  overflow: hidden;
}

/* ── Three.js canvas ─────────────────────────────────────────────────────── */
.ss-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
}

/* ── Text overlay ────────────────────────────────────────────────────────── */
.ss-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  padding: 0 8vw;
  pointer-events: none;
}

.ss-text {
  max-width: 520px;
}
.ss-text--left   { margin-right: auto; }
.ss-text--right  { margin-left: auto; }
.ss-text--center { margin: 0 auto; text-align: center; }

/* ── Vue transition ──────────────────────────────────────────────────────── */
.fade-enter-active,
.fade-leave-active { transition: opacity 0.5s ease, transform 0.5s ease; }
.fade-enter-from   { opacity: 0; transform: translateY(18px); }
.fade-leave-to     { opacity: 0; transform: translateY(-12px); }

/* ── Typography ──────────────────────────────────────────────────────────── */
.ss-eyebrow {
  font-family: 'DM Mono', monospace;
  font-size: 0.62rem;
  letter-spacing: 0.28em;
  color: rgba(120, 180, 255, 0.6);
  text-transform: uppercase;
  margin: 0 0 1.2rem;
}

.ss-headline {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(4.5rem, 13vw, 10rem);
  line-height: 0.88;
  color: #fff;
  margin: 0 0 1.8rem;
  letter-spacing: 0.02em;
}
.ss-line   { display: block; }
.ss-accent {
  -webkit-text-stroke: 1px rgba(100, 180, 255, 0.5);
  color: transparent;
}

.ss-chapter {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(3.2rem, 7.5vw, 6.5rem);
  line-height: 0.9;
  color: #fff;
  margin: 0 0 1.6rem;
  letter-spacing: 0.03em;
  background: linear-gradient(135deg, #ff3377, #aa44ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.ss-chapter--blue {
  background: linear-gradient(135deg, #00ccff, #3366ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.ss-chapter--violet {
  background: linear-gradient(135deg, #7744ff, #3300cc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.ss-sub {
  font-family: 'DM Mono', monospace;
  font-size: 0.78rem;
  color: rgba(255,255,255,0.3);
  letter-spacing: 0.1em;
  margin: 0 0 2.4rem;
}

.ss-body {
  font-family: 'DM Mono', monospace;
  font-size: clamp(0.72rem, 1.1vw, 0.9rem);
  line-height: 1.85;
  color: rgba(200, 220, 255, 0.5);
  max-width: 360px;
}

/* ── Scroll arrow ────────────────────────────────────────────────────────── */
.ss-arrow {
  display: block;
  font-size: 1.1rem;
  color: rgba(100, 180, 255, 0.45);
  animation: ss-bob 2s ease-in-out infinite;
}
@keyframes ss-bob {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(8px); }
}

/* ── Progress dots ───────────────────────────────────────────────────────── */
.ss-dots {
  position: absolute;
  right: 2.5rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}
.ss-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: rgba(255,255,255,0.18);
  transition: background 0.4s, transform 0.4s;
}
.ss-dot--active {
  background: rgba(120, 180, 255, 0.85);
  transform: scale(1.6);
}
</style>
