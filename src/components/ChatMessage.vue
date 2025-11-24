<script setup>
defineProps({
  message: {
    type: Object,
    required: true
  }
})

defineEmits(['submit-market'])

function formatTime(date) {
  return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
</script>

<template>
  <div
    class="flex gap-3 px-4 py-3"
    :class="{
      'justify-end': message.role === 'user',
      'justify-start': message.role !== 'user'
    }"
  >
    <!-- Avatar for assistant/system -->
    <div
      v-if="message.role !== 'user'"
      class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
      :class="{
        'bg-indigo-600': message.role === 'assistant',
        'bg-green-600': message.role === 'system'
      }"
    >
      <svg v-if="message.role === 'assistant'" class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
      <svg v-else class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
    </div>

    <!-- Message bubble -->
    <div
      class="max-w-[80%] rounded-2xl px-4 py-2.5"
      :class="{
        'bg-indigo-600 text-white': message.role === 'user',
        'bg-gray-700 text-gray-100': message.role === 'assistant',
        'bg-green-700 text-white': message.role === 'system'
      }"
    >
      <!-- Message content -->
      <div class="markdown-content whitespace-pre-wrap break-words">
        {{ message.content }}
      </div>

      <!-- Market evaluation card -->
      <div
        v-if="message.hasMarket && message.evalSummary"
        class="mt-3 p-3 bg-black/20 rounded-xl border border-white/10"
      >
        <div class="flex items-center gap-2 mb-2">
          <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span class="font-semibold text-green-400">Market Generated</span>
        </div>
        <div class="text-sm text-gray-300 whitespace-pre-wrap">
          {{ message.evalSummary }}
        </div>
        <button
          @click="$emit('submit-market', message.marketId)"
          class="mt-3 w-full py-2 px-4 bg-green-600 hover:bg-green-500 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Submit Market
        </button>
      </div>

      <!-- Notion URL for submitted markets -->
      <a
        v-if="message.notionUrl"
        :href="message.notionUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="mt-2 inline-flex items-center gap-1 text-sm text-indigo-300 hover:text-indigo-200"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
        Open in Notion
      </a>

      <!-- Timestamp -->
      <div
        class="mt-1 text-xs opacity-60"
        :class="{
          'text-right': message.role === 'user'
        }"
      >
        {{ formatTime(message.timestamp) }}
      </div>
    </div>

    <!-- Avatar for user -->
    <div
      v-if="message.role === 'user'"
      class="flex-shrink-0 w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center"
    >
      <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    </div>
  </div>
</template>
