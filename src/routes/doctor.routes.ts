import { Router } from 'express'
import doctor from '@/controllers/doctor.controller'
import { authMiddleware, doctorOnly } from '@/utils/middleware'

const router = Router()

router.get('/', [authMiddleware, doctorOnly], doctor.listAll)
// router.post('/login', auth.login)

export default router