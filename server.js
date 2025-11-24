import express from 'express'
import { createProxyMiddleware } from 'http-proxy-middleware'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000
const API_TARGET = process.env.API_TARGET || 'http://34.175.222.176:7863'

// Proxy API requests to the backend
app.use('/api', createProxyMiddleware({
  target: API_TARGET,
  changeOrigin: true,
  timeout: 600000, // 10 minutes for long-running requests
  proxyTimeout: 600000
}))

// Proxy health check
app.use('/health', createProxyMiddleware({
  target: API_TARGET,
  changeOrigin: true
}))

// Serve static files from dist
app.use(express.static(path.join(__dirname, 'dist')))

// SPA fallback - serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Proxying API requests to ${API_TARGET}`)
})
