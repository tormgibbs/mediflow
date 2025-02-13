import express from 'express'


const app = express()

app.use(express.json())

app.get('/api/v1/health', async (_, response) => {
  response.status(200).json({
    status: 'ok',
    environment: process.env.NODE_ENV,
    version: '1.0.0'
  })
})

export default app

