<script setup>
import { ref } from 'vue'

defineProps({
  disabled: {
    type: Boolean,
    default: false
  },
  placeholder: {
    type: String,
    default: 'Describe the market you want to create...'
  }
})

const emit = defineEmits(['send'])

const message = ref('')
const textarea = ref(null)

function handleSubmit() {
  if (!message.value.trim()) return
  emit('send', message.value)
  message.value = ''
  // Reset textarea height
  if (textarea.value) {
    textarea.value.style.height = 'auto'
  }
}

function handleKeydown(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSubmit()
  }
}

function autoResize() {
  if (textarea.value) {
    textarea.value.style.height = 'auto'
    textarea.value.style.height = Math.min(textarea.value.scrollHeight, 200) + 'px'
  }
}
</script>

<template>
  <div class="border-t border-gray-700 bg-gray-800/50 p-4">
    <form @submit.prevent="handleSubmit" class="flex gap-3 items-end max-w-4xl mx-auto">
      <div class="flex-1 relative">
        <textarea
          ref="textarea"
          v-model="message"
          @keydown="handleKeydown"
          @input="autoResize"
          :disabled="disabled"
          :placeholder="placeholder"
          rows="1"
          class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>
      <button
        type="submit"
        :disabled="disabled || !message.trim()"
        class="flex-shrink-0 p-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-xl transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      </button>
    </form>
    <p class="text-center text-xs text-gray-500 mt-2">
      Press Enter to send, Shift+Enter for new line
    </p>
  </div>
</template>
