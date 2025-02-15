import { Router } from 'express'
import auth from '@/controllers/auth.controller'

const router = Router()

router.post('/register', auth.register)
router.post('/login', auth.login)

export default router