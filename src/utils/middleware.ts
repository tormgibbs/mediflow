import { ErrorRequestHandler, NextFunction, Request, Response } from 'express'
import { badRequestResponse, failedValidationResponse, invalidCredentialsResponse, serverErrorResponse } from '@/utils/errors'
import { Prisma } from '@prisma/client'
import { verifyToken } from './jwt'

const unknownEndpoint = (request: Request, response: Response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

declare module 'express' {
  // eslint-disable-next-line no-unused-vars
  interface Request {
    user?: { userId: string; role: 'PATIENT' | 'DOCTOR' };
  }
}


export const authMiddleware = (request:Request, response:Response, next:NextFunction) => {
  const token = request.header('Authorization')?.split(' ')[1]
  if (!token) {
    response.status(401).json({ message: 'No token, authorization denied' })
    return
  }

  const decoded = verifyToken(token)
  if (!decoded) {
    response.status(401).json({ message: 'Invalid token' })
    return
  }

  request.user = decoded as { userId: string; role: 'PATIENT' | 'DOCTOR' }
  next()
}

export const doctorOnly = (request: Request, response: Response, next: NextFunction) => {
  if (request.user?.role !== 'DOCTOR') {
    response.status(403).json({ message: 'Access denied' })
    return 
  }
  next()
}

export const patientOnly  = (request: Request, response: Response, next: NextFunction) => {
  if (request.user?.role !== 'PATIENT') {
    response.status(403).json({ message: 'Access denied' })
    return 
  }
  next()
}


// eslint-disable-next-line no-unused-vars
const errorHandler: ErrorRequestHandler = (error, request, response, next) => {
  console.log(error)
  console.log()
  console.log('error has occured')
  console.log('Error type:', typeof error)
  console.log('Is instance of Error?', error instanceof Error)
  console.log(error.name)
  console.log(error.message)

  switch (true) {
    case error instanceof Prisma.PrismaClientKnownRequestError:
      if (error.code === 'P2002') {
        const errMessage = 'a user with this email address already exists'
        const error = { email: errMessage }
        failedValidationResponse(response, error)
      }
      break

    case error instanceof SyntaxError:
      badRequestResponse(response, 'body contains malformed JSON')
      break

    case error.name === 'AuthenticationError':
      invalidCredentialsResponse(response)
      break

    default:
      serverErrorResponse(request, response, error)
  }
}


export default {
  unknownEndpoint,
  errorHandler,
}