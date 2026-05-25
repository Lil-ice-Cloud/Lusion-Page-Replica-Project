<template>
  <nav class="header">
    <div class="header__logo">LUSION</div>

    <div class="header__actions">
      <button class="circle-btn" aria-label="Minimize">
        <span style="font-size: 1.2rem; letter-spacing: -0.1em">−−</span>
      </button>

      <button class="talk-btn">
        <span class="btn-arrow">
          <svg width="24" height="12" viewBox="0 0 24 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 6H22M22 6L17 1M22 6L17 11" stroke="currentColor" stroke-width="1.5" />
          </svg>
        </span>
        <span class="btn-text">LET'S TALK</span>
        <span class="dot"></span>
      </button>

      <button class="menu-btn">
        MENU
        <div class="dots-container">
          <span class="menu-dot"></span>
          <span class="menu-dot"></span>
        </div>
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
// Navbar is purely presentational
</script>
