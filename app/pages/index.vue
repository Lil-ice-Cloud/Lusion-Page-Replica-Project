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
        <div class="hero__visual-frame">
          <!-- Replace with your actual hero visual / Three.js canvas -->
          <div style="width:100%;height:100%;background:linear-gradient(135deg,#1a1a2e,#16213e,#0f3460);display:flex;align-items:center;justify-content:center;">
            <span style="color:rgba(255,255,255,0.15);font-size:12px;letter-spacing:0.3em;text-transform:uppercase;">Hero Visual</span>
          </div>
        </div>
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

  <!-- Featured Work header -->
  <section class="featured-work">
    <h2 class="featured-work__title reveal-on-scroll">Featured Work</h2>
    <p class="featured-work__description reveal-on-scroll">
      A selection of immersive digital experiences created for ambitious brands and forward thinking teams.
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
          <svg class="featured-work__item-arrow" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
          {{ item.title }}
        </h3>
      </div>
    </div>
  </section>

  <NextPage />
  <TheFooter />
</template>

<script setup lang="ts">
const works = [
  { bg: '#ccc', tags: 'CONCEPT • WEB • DESIGN • DEVELOPMENT • 3D • ANIMATION', title: 'Oryzo AI' },
  { bg: '#222', tags: 'WEB • DESIGN • DEVELOPMENT • 3D • ANIMATION', title: 'Of The Oak' },
  { bg: '#ccc', tags: 'VR • EXPERIENCE • DESIGN', title: 'Virtual Space' },
  { bg: '#222', tags: 'WEB • DESIGN • 3D', title: 'Digital Product' },
  { bg: '#ccc', tags: 'INNOVATION • WEBGL', title: 'Future Experiences' },
  { bg: '#222', tags: 'BRANDING • DESIGN', title: 'Creative Lab' },
]

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
        } else {
          entry.target.classList.remove('is-visible')
        }
      })
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  )

  const els = document.querySelectorAll('.reveal-on-scroll')
  els.forEach((el) => observer.observe(el))

  onUnmounted(() => els.forEach((el) => observer.unobserve(el)))
})
</script>
