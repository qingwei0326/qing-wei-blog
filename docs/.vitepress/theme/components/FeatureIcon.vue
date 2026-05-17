<script setup lang="ts">
defineProps<{
  name: string
}>()
</script>

<template>
  <svg
    class="feature-icon"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <g
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <g v-if="name === 'spark'">
        <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" />
        <path d="M4 20l2.4-2.4" />
        <path d="M20 20l-2.4-2.4" />
      </g>
      <g v-else-if="name === 'clock'">
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 8v4l3 2" />
      </g>
      <g v-else-if="name === 'archive'">
        <path d="M4 7h16" />
        <path d="M6 7v12h12V7" />
        <path d="M9 11h6" />
      </g>
      <g v-else-if="name === 'tag'">
        <path d="M4 12l8-8h6l2 2v6l-8 8-8-8z" />
        <circle cx="15.5" cy="8.5" r="1" />
      </g>
      <g v-else-if="name === 'user'">
        <circle cx="12" cy="8" r="3.2" />
        <path d="M6 19c1.8-3 4.3-4.5 6-4.5s4.2 1.5 6 4.5" />
      </g>
      <g v-else-if="name === 'book'">
        <path d="M6 5h8a3 3 0 0 1 3 3v11a2 2 0 0 0-2-2H6z" />
        <path d="M6 5a2 2 0 0 0-2 2v10a2 2 0 0 1 2-2h9" />
        <path d="M9 9h4" />
      </g>
      <g v-else-if="name === 'arrow-right'">
        <path d="M5 12h12" />
        <path d="m13 6 6 6-6 6" />
      </g>
      <g v-else>
        <path d="M12 3a6 6 0 0 0-3 11v2h6v-2a6 6 0 0 0-3-11z" />
        <path d="M10.5 21h3" />
      </g>
    </g>
  </svg>
</template>

<style scoped>
.feature-icon {
  width: 100%;
  height: 100%;
  color: currentColor;
}
</style>
