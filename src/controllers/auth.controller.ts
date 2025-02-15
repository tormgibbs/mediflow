import prisma from '@/config/db'
import { loginUserSchema, registerUserSchema } from '@/schemas/auth.schema'
import { createUser } from '@/services/user.service'
import { failedValidationResponse, invalidCredentialsResponse } from '@/utils/errors'
import { generateToken } from '@/utils/jwt'
import { compare } from 'bcrypt'
import { Request, Response } from 'express'


const register = async (request: Request, response: Response) => {
  const input = registerUserSchema.safeParse(request.body)

  if (!input.success) {
    const errors = input.error.errors.reduce((acc, err) => {
      const fieldName = err.path[0]?.toString() ?? 'unknown'
      return {
        ...acc,
        [fieldName]: err.message,
      }
    }, {})

    failedValidationResponse(response, errors)
    return
  }

  const user = await createUser(input.data)

  response.status(201).json(user)
}

const login = async (request: Request, response: Response) => {
  const input = loginUserSchema.safeParse(request.body)

  if (!input.success) {
    const errors = input.error.errors.reduce((acc, err) => {
      const fieldName = err.path[0]?.toString() ?? 'unknown'
      return {
        ...acc,
        [fieldName]: err.message,
      }
    }, {})

    failedValidationResponse(response, errors)
    return
  }

  const user = await prisma.user.findUnique({where: {email: input.data.email}, include: {
    doctor: true,
    patient: true,
  }})

  if (!user) {
    invalidCredentialsResponse(response)
    return
  }

  const isValid = await compare(input.data.password, user.password)
  if (!isValid) {
    invalidCredentialsResponse(response)
    return
  }


  const token = generateToken(user.id, user.role)

  // eslint-disable-next-line no-unused-vars
  const { password, ...userWithoutPassword } = user

  response.status(200).json({
    token,
    user: userWithoutPassword,
  })
}


export default {
  register,
  login
}