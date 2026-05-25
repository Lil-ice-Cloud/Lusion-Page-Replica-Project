<script setup lang="ts">
import { ref } from 'vue'
import { TresCanvas } from '@tresjs/core'
import { OrbitControls } from '@tresjs/cientos'

// Camera type toggle
const cameraType = ref<'perspective' | 'orthographic'>('perspective')
const zoom = ref(50)
const fov = ref(50)

function toggleCamera() {
  cameraType.value = cameraType.value === 'perspective' ? 'orthographic' : 'perspective'
}
</script>

<template>
  <div style="height: 631px; width: 1826px; position: absolute; top: 0; left: 0">
    <!-- Controls overlay -->
    <div style="position: absolute; z-index: 50; top: 20px; left: 60px">
      <button @click="toggleCamera">
        {{ cameraType }}
      </button>

      <div v-if="cameraType === 'perspective'">
        <label for="fov">FOV</label>
        <input
          id="fov"
          v-model.number="fov"
          type="range"
          min="20"
          max="120"
        />
      </div>

      <div v-if="cameraType === 'orthographic'">
        <label for="zoom">Zoom</label>
        <input
          id="zoom"
          v-model.number="zoom"
          type="range"
          min="20"
          max="120"
        />
      </div>
    </div>

    <!-- TresJS Canvas -->
    <TresCanvas clear-color="gold">
      <!-- Perspective Camera -->
      <TresPerspectiveCamera
        v-if="cameraType === 'perspective'"
        :position="[3, 4, 4]"
        :fov="fov"
        :make-default="true"
      />

      <!-- Orthographic Camera -->
      <TresOrthographicCamera
        v-if="cameraType === 'orthographic'"
        :position="[3, 4, 4]"
        :zoom="zoom"
        :make-default="true"
      />

      <!-- Sphere (center) -->
      <TresMesh :position="[0, 0, 0]">
        <TresSphereGeometry :args="[1, 64, 64]" />
        <TresMeshStandardMaterial color="royalblue" :roughness="0.3" :metalness="0.3" />
      </TresMesh>

      <!-- Box: right (+X) -->
      <TresMesh :position="[3, 0, 0]">
        <TresBoxGeometry :args="[1, 1, 1]" />
        <TresMeshStandardMaterial color="hotpink" :roughness="0.3" :metalness="0.3" />
      </TresMesh>

      <!-- Box: left (-X) -->
      <TresMesh :position="[-3, 0, 0]">
        <TresBoxGeometry :args="[1, 1, 1]" />
        <TresMeshStandardMaterial color="limegreen" :roughness="0.3" :metalness="0.3" />
      </TresMesh>

      <!-- Box: top (+Y) -->
      <TresMesh :position="[0, 3, 0]">
        <TresBoxGeometry :args="[1, 1, 1]" />
        <TresMeshStandardMaterial color="green" :roughness="0.3" :metalness="0.3" />
      </TresMesh>

      <!-- Box: bottom (-Y) -->
      <TresMesh :position="[0, -3, 0]">
        <TresBoxGeometry :args="[1, 1, 1]" />
        <TresMeshStandardMaterial color="orange" :roughness="0.3" :metalness="0.3" />
      </TresMesh>

      <!-- Box: front (+Z) -->
      <TresMesh :position="[0, 0, 3]">
        <TresBoxGeometry :args="[1, 1, 1]" />
        <TresMeshStandardMaterial color="purple" :roughness="0.3" :metalness="0.3" />
      </TresMesh>

      <!-- Box: back (-Z) -->
      <TresMesh :position="[0, 0, -3]">
        <TresBoxGeometry :args="[1, 1, 1]" />
        <TresMeshStandardMaterial color="red" :roughness="0.3" :metalness="0.3" />
      </TresMesh>

      <!-- Controls & Lights -->
      <OrbitControls />
      <TresDirectionalLight />
      <TresAmbientLight />
      <TresPointLight />
    </TresCanvas>
  </div>
</template>
