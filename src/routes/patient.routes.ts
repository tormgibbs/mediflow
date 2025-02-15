import { Router } from 'express'
import patient from '@/controllers/patient.controller'
import { authMiddleware, doctorOnly, patientOnly, } from '@/utils/middleware'

const router = Router()

router.get('/', [authMiddleware, doctorOnly], patient.getDoctorPatients)
router.post('/select-doctor', [authMiddleware, patientOnly], patient.selectDoctor)
router.patch('/complete', [authMiddleware, patientOnly], patient.checkIn)
router.get('/actions', [authMiddleware, patientOnly], patient.getActions)
router.get('/reminders', [authMiddleware, patientOnly], patient.getReminders)


export default router