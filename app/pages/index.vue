<template>
  <!-- Hero -->
  <section class="hero">
    <div class="hero__tagline">
      We create 3D visual storytelling<br />
      and interactive web experiences<br />
      that help brands stand out
    </div>

    <div class="hero__container">
      <div class="hero__visual">
        <ClientOnly>
          <ThreeJsSection />
        </ClientOnly>
      </div>
    </div>

    <div class="hero__footer">
      <div class="hero__footer-left">
        <span>+</span>
        <span>+</span>
      </div>
      <div class="hero__footer-center">SCROLL TO EXPLORE</div>
      <div class="hero__footer-right">
        <span>+</span>
        <span>+</span>
      </div>
    </div>
  </section>

  <!-- SVG Line Animation -->
  <div class="squiggle-wrapper" v-html="scrollLineSvg" ref="svgWrapper"></div>

  <section class="hero-container">
    <div class="text-container">
      <p>Bold Ideas,</p>
      <p>Brought to Life</p>
    </div>
  </section>

    <section class="description-section">
      <div class="description-image-wrapper reveal-on-scroll">
        <div class="description-image-placeholder"></div>
      </div>
      <div class="SVG-description reveal-on-scroll">
        <p class="SVG-description-title">
          We combine design, motion, 3D, and development to create digital
          experiences that feel visually striking and technically seamless. From
          campaign launches to immersive brand worlds, we build work that
          captures attention and invites interaction.
        </p>
        <br />
        <button class="OURAPPROACH-btn">
          <span class="OURAPPROACH-dot"></span>
          <span class="OURAPPROACH-text"> OUR APPROACH </span>
          <span class="btn-arrow">
            <svg
              width="24"
              height="12"
              viewBox="0 0 24 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 6H22M22 6L17 1M22 6L17 11"
                stroke="currentColor"
                stroke-width="1.5"
              />
            </svg>
          </span>
        </button>
      </div>
    </section>

    <!-- Featured Work header -->
    <section class="featured-work">
      <h2 class="featured-work__title reveal-on-scroll">Featured Work</h2>
      <p class="featured-work__description reveal-on-scroll">
        A selection of immersive digital experiences created for ambitious
        brands and forward thinking teams.
      </p>
    </section>

    <!-- Featured Work grid -->
    <section class="featured-work__grid">
      <div
        v-for="(item, index) in works"
        :key="index"
        class="featured-work__item reveal-on-scroll"
      >
        <div class="featured-work__image-wrapper">
          <div
            class="featured-work__image-placeholder"
            :style="{ backgroundColor: item.bg }"
          ></div>
        </div>
        <div class="featured-work__item-info">
          <p class="featured-work__item-tags">{{ item.tags }}</p>
          <h3 class="featured-work__item-title">
            <svg
              class="featured-work__item-arrow"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
            {{ item.title }}
          </h3>
        </div>
      </div>
    </section>

  <section class="PROJECTS-PLACEMENT">
    <button class="PROJECTS-btn">
      <span class="PROJECTS-dot"></span>
      <span class="PROJECTS-text"> SEE ALL PROJECTS </span>
      <span class="btn-arrow">
    <svg
        width="24"
        height="12"
        viewBox="0 0 24 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
      <path
          d="M0 6H22M22 6L17 1M22 6L17 11"
          stroke="currentColor"
          stroke-width="1.5"
      />
    </svg>
  </span>
    </button>

  </section>

  <section class="where-creative">
    <h2 class="where-creative__title reveal-on-scroll">Where Creative ideas Become Immersive Experiences</h2>
    <div class="where-creative__content">
      <div class="where-creative__image-wrapper reveal-on-scroll">
        <div class="where-creative__image-placeholder"></div>
      </div>
      <div class="where-creative__description reveal-on-scroll">
        <p>
          We do not chase trends or produce work that looks like everyone else. We focus on creating visually distinctive digital experiences that reflect your brand, engage your audience, and make people remember what they saw.
          Our process blends creative direction, 3D craft, and interactive development to build tailored digital journeys that feel original, polished, and built for impact.
        </p>
      </div>
    </div>
  </section>

  <section>
    <SpaceScroll />
  </section>

  <NextPage />
  <TheFooter />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
// @ts-ignore: Vite ?raw import
import scrollLineSvg from "../assets/scroll_line.svg?raw";
import TheFooter from "../components/TheFooter.vue";
import NextPage from "../components/NextPage.vue";
import SpaceScroll from "../components/SpaceScroll.vue";
import ThreeJsSection from "../components/ThreeJsSection.vue";

const svgWrapper = ref<HTMLElement | null>(null);
let squiggleSvg: SVGSVGElement | null = null;
let squigglePath: SVGPathElement | null = null;

const works = [
  {
    bg: "#ccc",
    tags: "CONCEPT • WEB • DESIGN • DEVELOPMENT • 3D • ANIMATION",
    title: "Orzo AI",
  },
  {
    bg: "#222",
    tags: "WEB • DESIGN • DEVELOPMENT • 3D • ANIMATION",
    title: "Of The Oak",
  },
  { bg: "#ccc", tags: "VR • EXPERIENCE • DESIGN", title: "Virtual Space" },
  { bg: "#222", tags: "WEB • DESIGN • 3D", title: "Digital Product" },
  { bg: "#ccc", tags: "INNOVATION • WEBGL", title: "Future Experiences" },
  { bg: "#222", tags: "BRANDING • DESIGN", title: "Creative Lab" },
];

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        } else {
          entry.target.classList.remove("is-visible");
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
  );

  const els = document.querySelectorAll(".reveal-on-scroll");
  els.forEach((el) => observer.observe(el));

  // Setup injected SVG
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

  // Squiggle line scroll animation
  let pathLength = 0;

  const setupPath = () => {
    if (!squigglePath) return;
    pathLength = squigglePath.getTotalLength();
    squigglePath.style.strokeDasharray = `${pathLength}`;
    squigglePath.style.strokeDashoffset = `${pathLength}`;
    squigglePath.style.transition = 'stroke-dashoffset 0.1s ease-out, opacity 0.1s ease-out';
    squigglePath.style.opacity = '1';
  };

  const handleScroll = () => {
    if (!squiggleSvg || !squigglePath) return;
    
    const heroEl = document.querySelector('.hero') as HTMLElement | null;
    const startOffset = heroEl ? heroEl.offsetHeight : window.innerHeight;
    
    const distance = Math.max(0, window.scrollY - startOffset);
    const totalDistance = squiggleSvg.clientHeight - window.innerHeight;
    
    let percentage = distance / totalDistance;
    percentage = Math.max(0, Math.min(1, percentage));
    
    squigglePath.style.strokeDashoffset = `${pathLength * (1 - percentage)}`;
  };

  setupPath();
  handleScroll();
  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("resize", () => {
    setupPath();
    handleScroll();
  });

  onUnmounted(() => {
    els.forEach((el) => observer.unobserve(el));
    window.removeEventListener("scroll", handleScroll);
  });
});
</script>
