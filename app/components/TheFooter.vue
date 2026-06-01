<template>
  <footer class="lusion-footer">
    <div class="lusion-footer-grid">

      <!-- Column 1 – Address -->
      <address class="lusion-address" style="font-style: normal">
        Suite 2<br />
        9 Marsh Street<br />
        Bristol, BS1 4AA<br />
        United Kingdom
      </address>

      <!-- Column 2 – Socials & Contacts -->
      <div class="lusion-col2">
        <nav class="lusion-links">
          <a href="https://twitter.com/lusion" target="_blank" rel="noopener noreferrer">Twitter / X</a>
          <a href="https://instagram.com/lusion" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href="https://linkedin.com/company/lusion" target="_blank" rel="noopener noreferrer">Linkedin</a>
        </nav>

        <div class="lusion-contact-group">
          <span class="lusion-contact-label">General enquires</span>
          <a class="lusion-contact-email" href="mailto:hello@lusion.co">hello@lusion.co</a>
        </div>

        <div class="lusion-contact-group">
          <span class="lusion-contact-label">New business</span>
          <a class="lusion-contact-email" href="mailto:business@lusion.co">business@lusion.co</a>
        </div>
      </div>

      <!-- Column 3 – Newsletter -->
      <div class="lusion-newsletter">
        <h2 class="lusion-newsletter-heading">
          Subscribe to<br />our newsletter
        </h2>
        <div class="lusion-input-wrap">
          <input
            v-model="email"
            class="lusion-input"
            type="email"
            placeholder="Your email"
            @keydown.enter="handleSubscribe"
          />
          <button class="lusion-submit-btn" @click="handleSubscribe" aria-label="Subscribe">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Bottom bar -->
    <div class="lusion-bottom">
      <span>©2026 LUSION Creative Studio</span>
      <span>
        R&D: <a href="https://labs.lusion.co" target="_blank" rel="noopener noreferrer">labs.lusion.co</a>
      </span>
      <div class="lusion-built">
        <span>Built by Lusion with</span>
        <span class="lusion-heart">♥</span>
      </div>
    </div>

    <!-- Scroll to top -->
    <button class="lusion-scroll-top" @click="scrollToTop" aria-label="Scroll to top">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="19" x2="12" y2="5" />
        <polyline points="5 12 12 5 19 12" />
      </svg>
    </button>
  </footer>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')

function handleSubscribe() {
  if (email.value) {
    console.log('Subscribed:', email.value)
    email.value = ''
  }
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>
