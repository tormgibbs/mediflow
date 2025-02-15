import * as dotenv from 'dotenv'

dotenv.config()

export const PORT = process.env.PORT ?? 3000
export const JWT_SECRET = process.env.JWT_SECRET!
export const TOKEN_EXPIRY = process.env.TOKEN_EXPIRY ?? '1h'
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY
