<template>
  <div class="svgart-wrapper">
    <div class="squiggle-wrapper" v-html="scrollLineSvg" ref="svgWrapper"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
// @ts-ignore: Vite ?raw import
import scrollLineSvg from "../assets/scroll_line.svg?raw";

const svgWrapper = ref<HTMLElement | null>(null);
let squiggleSvg: SVGSVGElement | null = null;
let squigglePath: SVGPathElement | null = null;

onMounted(() => {
  if (svgWrapper.value) {
    squiggleSvg = svgWrapper.value.querySelector("svg");
    squigglePath = svgWrapper.value.querySelector("path");

    if (squiggleSvg) {
      squiggleSvg.classList.add("squiggle");
      squiggleSvg.setAttribute("preserveAspectRatio", "none");
    }

    if (squigglePath) {
      squigglePath.setAttribute("stroke-linecap", "round");
      squigglePath.setAttribute("stroke-linejoin", "round");
    }
  }

  let pathLength = 0;

  const setupPath = () => {
    if (!squigglePath) return;
    pathLength = squigglePath.getTotalLength();
    squigglePath.style.strokeDasharray = `${pathLength}`;
    squigglePath.style.strokeDashoffset = `${pathLength}`;
    squigglePath.style.transition =
        "stroke-dashoffset 0.1s ease-out, opacity 0.1s ease-out";
    squigglePath.style.opacity = "0";
  };

  const handleScroll = () => {
    if (!squiggleSvg || !squigglePath) return;
    const rect = squiggleSvg.getBoundingClientRect();
    const viewportH = window.innerHeight;
    const startPoint = viewportH * 0.5;
    const totalDistance = rect.height;
    const distance = startPoint - rect.top;

    let percentage = distance / totalDistance;
    percentage = Math.max(0, Math.min(1, percentage));

    const easedPercentage = Math.pow(percentage, 1.8);
    squigglePath.style.strokeDashoffset = `${pathLength * (1 - easedPercentage)}`;

    if (easedPercentage <= 0.001) {
      squigglePath.style.opacity = "0";
    } else {
      squigglePath.style.opacity = "1";
    }
  };

  setupPath();
  handleScroll();
  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("resize", () => {
    setupPath();
    handleScroll();
  });

  onUnmounted(() => {
    window.removeEventListener("scroll", handleScroll);
  });
});
</script>

<style scoped>
.svgart-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: none;
}

</style>