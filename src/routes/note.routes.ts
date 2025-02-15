import { Router } from 'express'
import note from '@/controllers/note.controller'
import { authMiddleware, doctorOnly, patientOnly } from '@/utils/middleware'

const router = Router()

router.post('/', [authMiddleware, doctorOnly], note.createNote)
router.get('/', [authMiddleware, patientOnly], note.listNotes)

export default router