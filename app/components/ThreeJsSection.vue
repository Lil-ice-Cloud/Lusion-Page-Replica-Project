<template>
  <section ref="sectionRef" class="threejs-section">
    <canvas ref="canvasRef" class="threejs-canvas" />
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import * as THREE from 'three'

const sectionRef = ref(null)
const canvasRef  = ref(null)

let renderer, scene, camera, animationId
let pieces = []
let mouse       = { x: 0, y: 0 }
let targetMouse = { x: 0, y: 0 }
let resizeObserver

/* ─── cross-piece geometry ─────────────────────────────────── */
function createCrossPiece(color, roughness, metalness) {
  const mat   = new THREE.MeshStandardMaterial({ color, roughness, metalness })
  const group = new THREE.Group()
  const cylGeo = new THREE.CylinderGeometry(0.38, 0.38, 1.6, 20)

  const h = new THREE.Mesh(cylGeo, mat); h.rotation.z = Math.PI / 2; group.add(h)
  const v = new THREE.Mesh(cylGeo, mat); group.add(v)
  const d = new THREE.Mesh(cylGeo, mat); d.rotation.x = Math.PI / 2; group.add(d)

  const capGeo  = new THREE.CylinderGeometry(0.38, 0.38, 0.18, 20)
  const holeGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.22, 16)
  const holeMat = new THREE.MeshStandardMaterial({ color: 0x050505 })

  ;[
    { axis: 'y', sign:  1 }, { axis: 'y', sign: -1 },
    { axis: 'x', sign:  1 }, { axis: 'x', sign: -1 },
    { axis: 'z', sign:  1 }, { axis: 'z', sign: -1 },
  ].forEach(({ axis, sign }) => {
    const cap  = new THREE.Mesh(capGeo,  mat)
    const hole = new THREE.Mesh(holeGeo, holeMat)
    if (axis === 'x') {
      cap.rotation.z = hole.rotation.z = Math.PI / 2
      cap.position.x = hole.position.x = sign * 0.8
    } else if (axis === 'z') {
      cap.rotation.x = hole.rotation.x = Math.PI / 2
      cap.position.z = hole.position.z = sign * 0.8
    } else {
      cap.position.y = hole.position.y = sign * 0.8
    }
    group.add(cap, hole)
  })

  return group
}

/* ─── scene setup ──────────────────────────────────────────── */
function buildScene(w, h) {
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x0a0a0f)
  scene.fog = new THREE.FogExp2(0x0a0a0f, 0.045)

  camera = new THREE.PerspectiveCamera(55, w / h, 0.1, 100)
  camera.position.set(0, 0, 14)

  scene.add(new THREE.AmbientLight(0xffffff, 0.35))

  const key = new THREE.DirectionalLight(0xffffff, 1.8)
  key.position.set(6, 10, 8); scene.add(key)

  const fill = new THREE.DirectionalLight(0x3355ff, 0.9)
  fill.position.set(-8, -4, 4); scene.add(fill)

  const rim = new THREE.DirectionalLight(0x8899ff, 0.5)
  rim.position.set(0, -10, -6); scene.add(rim)

  const palette = [
    { color: 0x111111, roughness: 0.92, metalness: 0.05 },
    { color: 0x1a1a1a, roughness: 0.95, metalness: 0.02 },
    { color: 0xd8d8d8, roughness: 0.25, metalness: 0.10 },
    { color: 0xb0b0b8, roughness: 0.55, metalness: 0.05 },
    { color: 0x1133ee, roughness: 0.15, metalness: 0.30 },
    { color: 0x3355ff, roughness: 0.40, metalness: 0.20 },
  ]

  pieces = []
  for (let i = 0; i < 28; i++) {
    const p    = palette[Math.floor(Math.random() * palette.length)]
    const mesh = createCrossPiece(p.color, p.roughness, p.metalness)

    const r     = 2.5 + Math.random() * 4.5
    const theta = Math.random() * Math.PI * 2
    const phi   = (Math.random() - 0.5) * Math.PI

    mesh.position.set(
      r * Math.cos(theta) * Math.cos(phi),
      r * Math.sin(phi)   * 1.4,
      r * Math.sin(theta) * Math.cos(phi) - 2,
    )
    mesh.rotation.set(
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
    )
    mesh.scale.setScalar(0.55 + Math.random() * 0.6)

    mesh.userData = {
      basePos:        mesh.position.clone(),
      rotSpeed:       new THREE.Vector3(
        (Math.random() - 0.5) * 0.006,
        (Math.random() - 0.5) * 0.006,
        (Math.random() - 0.5) * 0.003,
      ),
      floatSpeed:     0.4  + Math.random() * 0.6,
      floatAmp:       0.12 + Math.random() * 0.18,
      floatOffset:    Math.random() * Math.PI * 2,
      mouseInfluence: 0.35 + Math.random() * 0.55,
    }

    scene.add(mesh)
    pieces.push(mesh)
  }
}

/* ─── mouse ────────────────────────────────────────────────── */
function onMouseMove(e) {
  if (!sectionRef.value) return
  const rect = sectionRef.value.getBoundingClientRect()
  if (
    e.clientX < rect.left || e.clientX > rect.right ||
    e.clientY < rect.top  || e.clientY > rect.bottom
  ) return
  targetMouse.x =  ((e.clientX - rect.left) / rect.width  - 0.5) * 2
  targetMouse.y = -((e.clientY - rect.top)  / rect.height - 0.5) * 2
}

/* ─── render loop ──────────────────────────────────────────── */
function animate() {
  animationId = requestAnimationFrame(animate)
  const t = performance.now() * 0.001

  mouse.x += (targetMouse.x - mouse.x) * 0.06
  mouse.y += (targetMouse.y - mouse.y) * 0.06

  pieces.forEach(mesh => {
    const d     = mesh.userData
    const float = Math.sin(t * d.floatSpeed + d.floatOffset) * d.floatAmp

    mesh.position.x = d.basePos.x + mouse.x * d.mouseInfluence * 1.1
    mesh.position.y = d.basePos.y + mouse.y * d.mouseInfluence * 0.9 + float
    mesh.position.z = d.basePos.z + mouse.x * d.mouseInfluence * 0.3

    mesh.rotation.x += d.rotSpeed.x
    mesh.rotation.y += d.rotSpeed.y
    mesh.rotation.z += d.rotSpeed.z
  })

  camera.position.x += (mouse.x * 0.8 - camera.position.x) * 0.04
  camera.position.y += (mouse.y * 0.5 - camera.position.y) * 0.04
  camera.lookAt(0, 0, 0)

  renderer.render(scene, camera)
}

/* ─── init — key fix: read actual pixel dimensions after tick ─ */
function initRenderer() {
  const section = sectionRef.value
  const canvas  = canvasRef.value

  // Use offsetWidth/offsetHeight which reflect the rendered CSS box
  const w = section.offsetWidth
  const h = section.offsetHeight

  // Explicitly stamp the canvas element size so Three.js and CSS agree
  canvas.style.width  = w + 'px'
  canvas.style.height = h + 'px'

  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(w, h, false)   // false = don't let Three.js touch canvas CSS size
  renderer.outputColorSpace  = THREE.SRGBColorSpace
  renderer.toneMapping       = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.1

  buildScene(w, h)
  animate()
}

/* ─── resize ───────────────────────────────────────────────── */
function handleResize() {
  if (!renderer || !sectionRef.value) return
  const section = sectionRef.value
  const w = section.offsetWidth
  const h = section.offsetHeight

  canvasRef.value.style.width  = w + 'px'
  canvasRef.value.style.height = h + 'px'

  camera.aspect = w / h
  camera.updateProjectionMatrix()
  renderer.setSize(w, h, false)
}

/* ─── lifecycle ────────────────────────────────────────────── */
onMounted(async () => {
  // Wait for Vue to finish painting, then wait one frame for CSS layout
  await nextTick()
  requestAnimationFrame(() => {
    initRenderer()

    resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(sectionRef.value)
  })

  window.addEventListener('mousemove', onMouseMove, { passive: true })
})

onBeforeUnmount(() => {
  cancelAnimationFrame(animationId)
  window.removeEventListener('mousemove', onMouseMove)
  resizeObserver?.disconnect()
  renderer?.dispose()
})
</script>

<style scoped>
.threejs-section {
  position: relative;
  width: 200vh;
  height: 65vh;      /* ← adjust to your desired section height */
}
.threejs-canvas {
  position: absolute;
  top: 0;
  left: 0;
  display: block;
}

</style>
