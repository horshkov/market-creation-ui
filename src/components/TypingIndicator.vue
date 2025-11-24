<script setup>
</script>

<template>
  <div class="flex gap-3 px-4 py-3">
    <!-- Avatar -->
    <div class="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
      <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    </div>

    <!-- Typing bubble -->
    <div class="bg-gray-700 rounded-2xl px-4 py-3">
      <div class="flex items-center gap-2">
        <div class="flex gap-1">
          <span class="typing-dot w-2 h-2 bg-gray-400 rounded-full"></span>
          <span class="typing-dot w-2 h-2 bg-gray-400 rounded-full"></span>
          <span class="typing-dot w-2 h-2 bg-gray-400 rounded-full"></span>
        </div>
        <span class="text-gray-400 text-sm ml-2">Creating market...</span>
      </div>
      <p class="text-xs text-gray-500 mt-1">This may take 1-3 minutes</p>
    </div>
  </div>
</template>
