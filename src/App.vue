<script setup>
import { onMounted, ref, nextTick, watch } from 'vue'
import { useChat } from './composables/useChat'
import ChatMessage from './components/ChatMessage.vue'
import ChatInput from './components/ChatInput.vue'
import TypingIndicator from './components/TypingIndicator.vue'
import WelcomeScreen from './components/WelcomeScreen.vue'

const {
  messages,
  isLoading,
  isLocked,
  sessionId,
  currentMarket,
  error,
  isConnected,
  hasMessages,
  initSession,
  sendMessage,
  submitMarket,
  newSession,
  clearError
} = useChat()

const messagesContainer = ref(null)

// Initialize session on mount
onMounted(() => {
  initSession()
})

// Auto-scroll to bottom when new messages arrive
watch(messages, async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}, { deep: true })

// Handle suggestion click
function handleSuggestion(suggestion) {
  sendMessage(suggestion)
}

// Handle market submission
async function handleSubmitMarket() {
  try {
    await submitMarket()
  } catch (e) {
    console.error('Failed to submit market:', e)
  }
}
</script>

<template>
  <div class="h-screen flex flex-col bg-gray-900">
    <!-- Header -->
    <header class="flex-shrink-0 border-b border-gray-700 bg-gray-800/80 backdrop-blur-sm">
      <div class="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div>
            <h1 class="font-semibold text-white">Market Creator</h1>
            <p class="text-xs text-gray-400">AI-Powered Prediction Markets</p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <!-- Connection status -->
          <div class="flex items-center gap-2 text-sm">
            <span
              class="w-2 h-2 rounded-full"
              :class="isConnected ? 'bg-green-500' : 'bg-red-500'"
            ></span>
            <span class="text-gray-400 hidden sm:inline">
              {{ isConnected ? 'Connected' : 'Disconnected' }}
            </span>
          </div>

          <!-- New chat button -->
          <button
            @click="newSession"
            class="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            title="New conversation"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>
    </header>

    <!-- Error banner -->
    <div
      v-if="error"
      class="flex-shrink-0 bg-red-900/50 border-b border-red-700 px-4 py-2"
    >
      <div class="max-w-4xl mx-auto flex items-center justify-between">
        <div class="flex items-center gap-2 text-red-200">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="text-sm">{{ error }}</span>
        </div>
        <button
          @click="clearError"
          class="text-red-300 hover:text-white"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Main content -->
    <main class="flex-1 flex flex-col overflow-hidden">
      <!-- Welcome screen (no messages) -->
      <WelcomeScreen
        v-if="!hasMessages && !isLoading"
        @select="handleSuggestion"
      />

      <!-- Messages area -->
      <div
        v-else
        ref="messagesContainer"
        class="flex-1 overflow-y-auto chat-messages"
      >
        <div class="max-w-4xl mx-auto py-4">
          <TransitionGroup name="message">
            <ChatMessage
              v-for="message in messages"
              :key="message.id"
              :message="message"
              @submit-market="handleSubmitMarket"
            />
          </TransitionGroup>

          <!-- Typing indicator -->
          <TypingIndicator v-if="isLoading" />
        </div>
      </div>
    </main>

    <!-- Input area -->
    <ChatInput
      :disabled="isLoading || isLocked"
      :placeholder="isLoading ? 'Processing your request...' : isLocked ? 'Session locked, please wait...' : 'Describe the market you want to create...'"
      @send="sendMessage"
    />

    <!-- Session ID footer -->
    <footer class="flex-shrink-0 border-t border-gray-800 bg-gray-900 px-4 py-2">
      <div class="max-w-4xl mx-auto flex items-center justify-between text-xs text-gray-500">
        <span>Session: {{ sessionId.slice(0, 20) }}...</span>
        <span v-if="currentMarket">Market ready: {{ currentMarket.id }}</span>
      </div>
    </footer>
  </div>
</template>
