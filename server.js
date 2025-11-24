import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000
const API_TARGET = process.env.API_TARGET || 'http://34.175.222.176:7863'

// Parse JSON bodies
app.use(express.json())

// Manual proxy for /api/* requests
app.all('/api/*', async (req, res) => {
  const targetUrl = `${API_TARGET}${req.originalUrl}`
  console.log(`Proxying: ${req.method} ${req.originalUrl} -> ${targetUrl}`)

  try {
    const fetchOptions = {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
      },
    }

    if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body) {
      fetchOptions.body = JSON.stringify(req.body)
    }

    const response = await fetch(targetUrl, fetchOptions)
    const data = await response.json()

    res.status(response.status).json(data)
  } catch (error) {
    console.error('Proxy error:', error.message)
    res.status(502).json({ error: 'Proxy error', message: error.message })
  }
})

// Proxy health check
app.get('/health', async (req, res) => {
  try {
    const response = await fetch(`${API_TARGET}/health`)
    const data = await response.json()
    res.json(data)
  } catch (error) {
    res.status(502).json({ error: 'API unreachable' })
  }
})

// Serve static files from dist
app.use(express.static(path.join(__dirname, 'dist')))

// SPA fallback - serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Proxying /api/* and /health to ${API_TARGET}`)
})
