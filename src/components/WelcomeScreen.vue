<script setup>
const suggestions = [
  'Create a market about Bitcoin reaching $100k by end of 2025',
  'Create a market about the next US presidential election',
  'Create a market about ETH flipping BTC in market cap',
  'Create a market about AI passing the Turing test by 2026'
]

defineEmits(['select'])
</script>

<template>
  <div class="flex-1 flex flex-col items-center justify-center p-8 text-center">
    <!-- Logo/Icon -->
    <div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/25">
      <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    </div>

    <!-- Title -->
    <h1 class="text-3xl font-bold text-white mb-2">Market Creator</h1>
    <p class="text-gray-400 mb-8 max-w-md">
      Describe a prediction market in natural language, and I'll help you create it with proper criteria and evaluation.
    </p>

    <!-- Suggestions -->
    <div class="w-full max-w-2xl">
      <p class="text-sm text-gray-500 mb-3">Try one of these:</p>
      <div class="grid gap-3 sm:grid-cols-2">
        <button
          v-for="suggestion in suggestions"
          :key="suggestion"
          @click="$emit('select', suggestion)"
          class="p-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 rounded-xl text-left text-sm text-gray-300 transition-colors"
        >
          <span class="text-indigo-400 mr-2">→</span>
          {{ suggestion }}
        </button>
      </div>
    </div>

    <!-- Tips -->
    <div class="mt-8 p-4 bg-gray-800/50 rounded-xl border border-gray-700 max-w-md">
      <h3 class="text-sm font-semibold text-gray-300 mb-2">Tips for good markets:</h3>
      <ul class="text-xs text-gray-400 text-left space-y-1">
        <li>• Be specific about resolution criteria</li>
        <li>• Include a clear timeframe</li>
        <li>• Specify data sources when applicable</li>
        <li>• Avoid subjective outcomes</li>
      </ul>
    </div>
  </div>
</template>
