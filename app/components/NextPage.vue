<template>
  <section class="about-section">
    <!-- Top label -->
    <div class="about-section__top">
      <p class="about-section__label">
        Keep Scrolling<br />To Learn More
      </p>
    </div>

    <!-- Middle: title + next page -->
    <div class="about-section__middle">
      <h2 class="about-section__title">ABOUT US</h2>
      <button class="about-section__next" @click="handleNextPage">
        <span>Next Page</span>
        <span class="about-section__next-line" />
        <span class="about-section__next-arrow">→</span>
      </button>
    </div>

    <!-- Bottom: plus markers -->
    <div class="about-section__bottom">
      <button
        v-for="i in 5"
        :key="i"
        class="about-section__plus"
        aria-label="expand section"
      >+</button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function handleNextPage() {
  router.push('/about')
}
</script>
