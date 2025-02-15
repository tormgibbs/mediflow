import express from 'express'
import 'express-async-errors'
import { notFoundResponse } from './utils/errors'
import authRoutes from '@/routes/auth.routes'
import doctorRoutes from '@/routes/doctor.routes'
import patientRoutes from '@/routes/patient.routes'
import noteRoutes from '@/routes/note.routes'
import middleware from './utils/middleware'


const app = express()

app.use(express.json())

app.get('/api/v1/health', async (_, response) => {
  response.status(200).json({
    status: 'ok',
    environment: process.env.NODE_ENV,
    version: '1.0.0'
  })
})

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/doctors', doctorRoutes)
app.use('/api/v1/patients', patientRoutes)
app.use('/api/v1/notes', noteRoutes)

app.use(notFoundResponse)
app.use(middleware.errorHandler)

export default app

