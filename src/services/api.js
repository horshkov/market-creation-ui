// In production, use relative URLs (proxy handles forwarding)
// In development, use the direct API URL
const API_URL = import.meta.env.DEV
  ? (import.meta.env.VITE_API_URL || 'http://34.175.222.176:7863')
  : ''  // Empty = relative URLs, goes through our proxy

/**
 * Market Creation API Service
 */
export const api = {
  /**
   * Get current API URL (for debugging)
   */
  getApiUrl() {
    return API_URL || '(using proxy)'
  },

  /**
   * Create a new session
   * @param {string} sessionId - Unique session identifier
   * @param {object} metadata - Optional metadata
   */
  async createSession(sessionId, metadata = {}) {
    const response = await fetch(`${API_URL}/api/v1/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_session_id: sessionId,
        metadata
      })
    })
    return response.json()
  },

  /**
   * Send a message to a session
   * @param {string} sessionId - Session identifier
   * @param {string} message - User message
   */
  async sendMessage(sessionId, message) {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 600000) // 10 min timeout

    try {
      const response = await fetch(
        `${API_URL}/api/v1/sessions/${sessionId}/messages`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message }),
          signal: controller.signal
        }
      )
      clearTimeout(timeoutId)
      return response.json()
    } catch (error) {
      clearTimeout(timeoutId)
      if (error.name === 'AbortError') {
        throw new Error('Request timed out. Please try again.')
      }
      throw error
    }
  },

  /**
   * Get session status and history
   * @param {string} sessionId - Session identifier
   */
  async getSession(sessionId) {
    const response = await fetch(`${API_URL}/api/v1/sessions/${sessionId}`)
    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error(`Failed to get session: ${response.status}`)
    }
    return response.json()
  },

  /**
   * Submit a generated market
   * @param {string} marketId - Market identifier
   * @param {object} data - Submission data
   */
  async submitMarket(marketId, { sessionId, userId, link }) {
    const response = await fetch(`${API_URL}/api/v1/markets/${marketId}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id: sessionId,
        user_id: userId,
        link
      })
    })
    return response.json()
  },

  /**
   * Check API health
   */
  async checkHealth() {
    try {
      const response = await fetch(`${API_URL}/health`, { timeout: 5000 })
      return response.ok
    } catch {
      return false
    }
  }
}

export default api
