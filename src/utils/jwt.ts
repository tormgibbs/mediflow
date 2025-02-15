import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '@/config'

export const generateToken = (userId: string, role: any): string => {
  
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: '1hr' })
}

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET)
}