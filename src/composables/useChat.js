import { ref, computed } from 'vue'
import api from '../services/api'

/**
 * Generate a unique session ID
 */
function generateSessionId() {
  return `web-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

/**
 * Chat composable for managing conversation state
 */
export function useChat() {
  const messages = ref([])
  const isLoading = ref(false)
  const isLocked = ref(false)
  const sessionId = ref(generateSessionId())
  const currentMarket = ref(null)
  const error = ref(null)
  const isConnected = ref(true)

  const hasMessages = computed(() => messages.value.length > 0)

  /**
   * Initialize session
   */
  async function initSession() {
    try {
      await api.createSession(sessionId.value, {
        platform: 'web-ui',
        created_at: new Date().toISOString()
      })
      isConnected.value = true
    } catch (e) {
      isConnected.value = false
      error.value = 'Failed to connect to API'
    }
  }

  /**
   * Send a message
   */
  async function sendMessage(content) {
    if (!content.trim() || isLoading.value) return

    error.value = null

    // Add user message
    messages.value.push({
      id: Date.now(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    })

    isLoading.value = true

    try {
      const result = await api.sendMessage(sessionId.value, content.trim())

      if (result.status === 'locked') {
        isLocked.value = true
        error.value = 'Session is processing. Please wait...'
        // Remove the user message since it wasn't processed
        messages.value.pop()
        return
      }

      isLocked.value = false

      // Add assistant message
      messages.value.push({
        id: Date.now() + 1,
        role: 'assistant',
        content: result.response,
        timestamp: new Date(),
        hasMarket: result.has_market,
        marketId: result.market_id,
        evalSummary: result.eval_summary
      })

      // Update current market if generated
      if (result.has_market) {
        currentMarket.value = {
          id: result.market_id,
          evalSummary: result.eval_summary
        }
      }

    } catch (e) {
      error.value = e.message || 'Failed to send message'
      // Remove the user message on error
      messages.value.pop()
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Submit current market
   */
  async function submitMarket(userId = 'web-user') {
    if (!currentMarket.value) return

    try {
      const result = await api.submitMarket(currentMarket.value.id, {
        sessionId: sessionId.value,
        userId,
        link: window.location.href
      })

      // Add system message about submission
      messages.value.push({
        id: Date.now(),
        role: 'system',
        content: `Market submitted successfully! View it here: ${result.notion_url}`,
        timestamp: new Date(),
        notionUrl: result.notion_url
      })

      currentMarket.value = null
      return result
    } catch (e) {
      error.value = 'Failed to submit market'
      throw e
    }
  }

  /**
   * Start a new session
   */
  function newSession() {
    messages.value = []
    currentMarket.value = null
    error.value = null
    sessionId.value = generateSessionId()
    initSession()
  }

  /**
   * Clear error
   */
  function clearError() {
    error.value = null
  }

  return {
    // State
    messages,
    isLoading,
    isLocked,
    sessionId,
    currentMarket,
    error,
    isConnected,
    hasMessages,

    // Actions
    initSession,
    sendMessage,
    submitMarket,
    newSession,
    clearError
  }
}

export default useChat
