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
let pieces = []           // { group, cubeCamera?, cubeRT?, material }
let mouse       = { x: 0, y: 0 }
let targetMouse = { x: 0, y: 0 }
let resizeObserver
let lastTime = 0
const mouseWorld = new THREE.Vector3()

// Shared high-res env map updated from a central cube camera each frame
// Individual pieces with their own cube cameras get per-object reflections
let sceneCubeRT      = null   // 256px shared fallback env
let sceneCubeCamera  = null

/* ─── palette ──────────────────────────────────────────────── */
// Reflective tiers:
//   MIRROR  – gets own CubeCamera (256px)
//   GLOSS   – gets own CubeCamera (128px)
//   MATTE   – uses shared env only
const PALETTE = [
  { color: 0x111111, roughness: 0.92, metalness: 0.05, clearcoat: 0.0, clearcoatRoughness: 1.00, tier: 'MATTE'  },
  { color: 0x1a1a1a, roughness: 0.95, metalness: 0.02, clearcoat: 0.0, clearcoatRoughness: 1.00, tier: 'MATTE'  },
  { color: 0xd8d8d8, roughness: 0.25, metalness: 0.10, clearcoat: 1.0, clearcoatRoughness: 0.05, tier: 'MIRROR' },
  { color: 0xb0b0b8, roughness: 0.55, metalness: 0.05, clearcoat: 0.5, clearcoatRoughness: 0.15, tier: 'GLOSS'  },
  { color: 0x1133ee, roughness: 0.15, metalness: 0.30, clearcoat: 0.8, clearcoatRoughness: 0.05, tier: 'GLOSS'  },
  { color: 0x3355ff, roughness: 0.40, metalness: 0.20, clearcoat: 0.6, clearcoatRoughness: 0.10, tier: 'GLOSS'  },
]

/* ─── material factory ─────────────────────────────────────── */
function makeMaterial({ color, roughness, metalness, clearcoat, clearcoatRoughness }) {
  return new THREE.MeshPhysicalMaterial({
    color,
    roughness,
    metalness,
    clearcoat,
    clearcoatRoughness,
    envMapIntensity: 2.2,
  })
}

function makeHoleMat() {
  return new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 1, metalness: 0 })
}

/* ─── cross-piece geometry ─────────────────────────────────── */
function createCrossPiece(palEntry) {
  const mat    = makeMaterial(palEntry)
  const group  = new THREE.Group()
  const cylGeo = new THREE.CylinderGeometry(0.38, 0.38, 1.6, 24)

  const h = new THREE.Mesh(cylGeo, mat); h.rotation.z = Math.PI / 2; group.add(h)
  const v = new THREE.Mesh(cylGeo, mat); group.add(v)
  const d = new THREE.Mesh(cylGeo, mat); d.rotation.x = Math.PI / 2; group.add(d)

  const capGeo  = new THREE.CylinderGeometry(0.38, 0.38, 0.18, 24)
  const holeGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.22, 16)
  const holeMat = makeHoleMat()

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

  return { group, mat }
}

/* ─── scene setup ──────────────────────────────────────────── */
function buildScene(w, h) {
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x0a0a0f)
  scene.fog = new THREE.FogExp2(0x0a0a0f, 0.018)

  camera = new THREE.PerspectiveCamera(70, w / h, 0.1, 100)
  camera.position.set(0, 0, 16)

  // 120px target size. Cross geometry spans 1.6 world units tip-to-tip.
  // worldPerPx = 2 * tan(FOV/2) * camZ / screenH
  const fov70rad    = (70 * Math.PI) / 180
  const worldPerPx  = (2 * Math.tan(fov70rad / 2) * 16) / h
  const PIECE_SCALE = 120 * worldPerPx / 1.6

  // ── Lighting: stronger so reflections have something to catch ──
  scene.add(new THREE.AmbientLight(0xffffff, 0.6))

  const key = new THREE.DirectionalLight(0xffffff, 6.0)
  key.position.set(8, 4, 14); scene.add(key)

  const fill = new THREE.DirectionalLight(0x3355ff, 3.0)
  fill.position.set(-10, -4, 4); scene.add(fill)

  const rim = new THREE.DirectionalLight(0x8899ff, 2.0)
  rim.position.set(0, -10, -8); scene.add(rim)

  // Extra back light to light up reflections from behind
  const back = new THREE.DirectionalLight(0xffffff, 1.5)
  back.position.set(0, 0, -20); scene.add(back)

  // Accent point lights so cube cameras can pick up coloured env
  const pl1 = new THREE.PointLight(0x3366ff, 40, 30); pl1.position.set(-8, 6, 0); scene.add(pl1)
  const pl2 = new THREE.PointLight(0xff8833, 30, 25); pl2.position.set( 8,-5, 2); scene.add(pl2)
  const pl3 = new THREE.PointLight(0xffffff, 20, 20); pl3.position.set( 0, 0, 10); scene.add(pl3)

  // ── Shared scene CubeRenderTarget (fallback env for matte pieces) ──
  sceneCubeRT     = new THREE.WebGLCubeRenderTarget(128, { generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter })
  sceneCubeCamera = new THREE.CubeCamera(0.5, 80, sceneCubeRT)
  scene.add(sceneCubeCamera)

  // ── Spawn pieces ──
  pieces = []
  const MIN_DIST  = 7.0
  const COLS = 7, ROWS = 4
  const totalSlots = COLS * ROWS
  const slotW = 36 / COLS
  const slotH = 18 / ROWS

  const slots = Array.from({ length: totalSlots }, (_, i) => i).sort(() => Math.random() - 0.5)

  const tryPosition = (i) => {
    const slot = slots[i % totalSlots]
    const col  = slot % COLS
    const row  = Math.floor(slot / COLS)
    const x = -18 + col * slotW + slotW * (0.25 + Math.random() * 0.5)
    const y = -9  + row * slotH + slotH * (0.25 + Math.random() * 0.5)
    const z = (Math.random() - 0.5) * 2
    return new THREE.Vector3(x, y, z)
  }

  for (let i = 0; i < 26; i++) {
    const palEntry = PALETTE[Math.floor(Math.random() * PALETTE.length)]
    const { group, mat } = createCrossPiece(palEntry)

    let pos, attempts = 0
    do {
      pos = tryPosition(i)
      attempts++
    } while (attempts < 50 && pieces.some(p => p.group.userData.basePos.distanceTo(pos) < MIN_DIST))

    group.position.copy(pos)
    group.rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
    )
    group.scale.setScalar(PIECE_SCALE)

    // ── Per-piece CubeCamera for MIRROR/GLOSS tiers ──
    let cubeCamera = null
    let cubeRT     = null
    if (palEntry.tier === 'MIRROR' || palEntry.tier === 'GLOSS') {
      const res = palEntry.tier === 'MIRROR' ? 256 : 128
      cubeRT     = new THREE.WebGLCubeRenderTarget(res, { generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter })
      cubeCamera = new THREE.CubeCamera(0.5, 80, cubeRT)
      group.add(cubeCamera)         // moves with piece automatically
      mat.envMap = cubeRT.texture   // piece sees its own dynamic env
    } else {
      mat.envMap = sceneCubeRT.texture  // matte: static shared env is fine
    }

    group.userData = {
      basePos:        pos.clone(),
      vel:            new THREE.Vector3(),
      rotSpeed:       new THREE.Vector3(
          (Math.random() - 0.5) * 0.006,
          (Math.random() - 0.5) * 0.006,
          (Math.random() - 0.5) * 0.003,
      ),
      floatSpeed:  0.4  + Math.random() * 0.6,
      floatAmp:    0.12 + Math.random() * 0.18,
      floatOffset: Math.random() * Math.PI * 2,
      repelBias:   new THREE.Vector3(
          (Math.random() - 0.5) * 1.2,
          (Math.random() - 0.5) * 1.2,
          (Math.random() - 0.5) * 0.6,
      ),
      tier: palEntry.tier,
    }

    scene.add(group)
    pieces.push({ group, mat, cubeCamera, cubeRT })
  }
}

/* ─── mouse ────────────────────────────────────────────────── */
function onMouseMove(e) {
  if (!sectionRef.value) return
  const rect = sectionRef.value.getBoundingClientRect()
  if (e.clientX < rect.left || e.clientX > rect.right ||
      e.clientY < rect.top  || e.clientY > rect.bottom) return
  targetMouse.x =  ((e.clientX - rect.left) / rect.width  - 0.5) * 2
  targetMouse.y = -((e.clientY - rect.top)  / rect.height - 0.5) * 2
}

/* ─── constants ────────────────────────────────────────────── */
const CURSOR_REPEL_RADIUS = 7.0
const CURSOR_REPEL_FORCE  = 8.0
const PIECE_RADIUS        = 2.8
const COLLISION_DIAMETER  = PIECE_RADIUS * 2
const BOUNDS              = { x: 17, y: 9 }
const DAMPING             = 0.96
const RETURN_FORCE        = 0.006

// Stagger cube cam updates so not all fire on the same frame
let cubeUpdateFrame = 0

/* ─── animate ──────────────────────────────────────────────── */
function animate(now = 0) {
  animationId = requestAnimationFrame(animate)

  const rawDt = Math.min(now - lastTime, 50)
  lastTime    = now
  const dt    = rawDt / (1000 / 60)
  const t     = now * 0.001

  const mouseLerp = 1 - Math.pow(1 - 0.03, dt)
  mouse.x += (targetMouse.x - mouse.x) * mouseLerp
  mouse.y += (targetMouse.y - mouse.y) * mouseLerp

  const fovRad = (camera.fov * Math.PI) / 180
  const halfH  = Math.tan(fovRad / 2) * camera.position.z
  const halfW  = halfH * camera.aspect
  mouseWorld.set(mouse.x * halfW, mouse.y * halfH, 0)

  // ── Physics ──
  pieces.forEach(({ group }) => {
    const d = group.userData
    const float = Math.sin(t * d.floatSpeed + d.floatOffset) * d.floatAmp

    group.rotation.x += d.rotSpeed.x * dt
    group.rotation.y += d.rotSpeed.y * dt
    group.rotation.z += d.rotSpeed.z * dt

    const dx = group.position.x - mouseWorld.x
    const dy = group.position.y - mouseWorld.y
    const cursorDist = Math.sqrt(dx * dx + dy * dy)

    if (cursorDist < CURSOR_REPEL_RADIUS && cursorDist > 0.01) {
      const strength = (1 - cursorDist / CURSOR_REPEL_RADIUS) * CURSOR_REPEL_FORCE
      const nx = dx / cursorDist, ny = dy / cursorDist
      d.vel.x += (nx + d.repelBias.x * 0.4) * strength * dt
      d.vel.y += (ny + d.repelBias.y * 0.4) * strength * dt
    }

    d.vel.x += (d.basePos.x - group.position.x) * RETURN_FORCE * dt
    d.vel.y += (d.basePos.y + float - group.position.y) * RETURN_FORCE * dt

    const damp = Math.pow(DAMPING, dt)
    d.vel.x *= damp; d.vel.y *= damp

    group.position.x += d.vel.x * dt
    group.position.y += d.vel.y * dt

    if (group.position.x >  BOUNDS.x + 5) group.position.x = -BOUNDS.x - 5
    else if (group.position.x < -BOUNDS.x - 5) group.position.x =  BOUNDS.x + 5
    if (group.position.y >  BOUNDS.y + 5) group.position.y = -BOUNDS.y - 5
    else if (group.position.y < -BOUNDS.y - 5) group.position.y =  BOUNDS.y + 5
  })

  // Collision
  for (let i = 0; i < pieces.length; i++) {
    for (let j = i + 1; j < pieces.length; j++) {
      const a = pieces[i].group, b = pieces[j].group
      const dx = a.position.x - b.position.x
      const dy = a.position.y - b.position.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < COLLISION_DIAMETER && dist > 0.001) {
        const overlap = (COLLISION_DIAMETER - dist) / dist
        const px = dx * overlap * 0.5, py = dy * overlap * 0.5
        a.position.x += px; a.position.y += py
        b.position.x -= px; b.position.y -= py
        const nx = dx / dist, ny = dy / dist
        const relVx = a.userData.vel.x - b.userData.vel.x
        const relVy = a.userData.vel.y - b.userData.vel.y
        const dot = relVx * nx + relVy * ny
        if (dot < 0) {
          const imp = dot * 0.7
          a.userData.vel.x -= imp * nx; a.userData.vel.y -= imp * ny
          b.userData.vel.x += imp * nx; b.userData.vel.y += imp * ny
        }
      }
    }
  }

  const camLerp = 1 - Math.pow(1 - 0.04, dt)
  camera.position.x += (mouse.x * 0.5 - camera.position.x) * camLerp
  camera.position.y += (mouse.y * 0.3 - camera.position.y) * camLerp
  camera.lookAt(0, 0, 0)

  // ── Cube camera updates ──
  // Shared scene env: update every 3 frames (matte pieces / fallback)
  if (cubeUpdateFrame % 3 === 0) {
    sceneCubeCamera.position.set(0, 0, 0)
    sceneCubeCamera.update(renderer, scene)
  }

  // Per-piece cube cams: stagger — update 2 per frame in round-robin
  // so at 26 pieces the cycle is ~13 frames (~8ms lag at 60fps, invisible)
  const reflectors = pieces.filter(p => p.cubeCamera)
  const updateA = cubeUpdateFrame % reflectors.length
  const updateB = (cubeUpdateFrame + 1) % reflectors.length

  ;[updateA, updateB].forEach(idx => {
    const { group, cubeCamera, mat, cubeRT } = reflectors[idx]
    // Temporarily hide self so it doesn't reflect its own inside
    group.visible = false
    cubeCamera.update(renderer, scene)
    group.visible = true
    mat.envMap = cubeRT.texture
    mat.needsUpdate = true
  })

  cubeUpdateFrame++

  renderer.render(scene, camera)
}

/* ─── init ─────────────────────────────────────────────────── */
function initRenderer() {
  const section = sectionRef.value
  const canvas  = canvasRef.value
  const w = section.offsetWidth
  const h = section.offsetHeight

  canvas.style.width  = w + 'px'
  canvas.style.height = h + 'px'

  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(w, h, false)
  renderer.outputColorSpace   = THREE.SRGBColorSpace
  renderer.toneMapping        = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.2

  buildScene(w, h)
  lastTime = performance.now()
  animate(lastTime)
}

/* ─── resize ───────────────────────────────────────────────── */
function handleResize() {
  if (!renderer || !sectionRef.value) return
  const w = sectionRef.value.offsetWidth
  const h = sectionRef.value.offsetHeight
  canvasRef.value.style.height = h + 'px'
  camera.aspect = w / h
  camera.updateProjectionMatrix()
  renderer.setSize(w, h, false)
}

/* ─── lifecycle ────────────────────────────────────────────── */
onMounted(async () => {
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
  pieces.forEach(({ cubeRT, mat }) => { cubeRT?.dispose(); mat?.dispose() })
  sceneCubeRT?.dispose()
  renderer?.dispose()
})
</script>

<style scoped>
.threejs-section {
  position: relative;
  width: 200vh;
  height: 65vh;
}
.threejs-canvas {
  position: absolute;
  top: 0;
  left: 0;
  display: block;
}
</style>