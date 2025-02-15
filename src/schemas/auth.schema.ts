/* eslint-disable no-unused-vars */
import { z } from 'zod'

export enum ROLE {
  PATIENT = 'patient',
  DOCTOR = 'doctor',
}

export const registerUserSchema = z.object({
  email: z
    .string({
      required_error: 'must be provided',
      invalid_type_error: 'must be a string',
    })
    .email({
      message: 'must be a valid email address',
    }),
  password: z
    .string({
      required_error: 'must be provided',
      invalid_type_error: 'must be a string',
    })
    .min(6, {
      message: 'must be at least 6 characters long',
    })
    .max(50, { message: 'must be at most 50 characters long' })
    .regex(/[A-Za-z]/, { message: 'must contain at least one letter' })
    .regex(/[0-9]/, { message: 'must contain at least one number' }),
  name: z
    .string({
      required_error: 'must be provided',
      invalid_type_error: 'must be a string',
    })
    .min(5, {
      message: 'must be at least 5 characters long',
    })
    .trim(),
  role: z.nativeEnum(ROLE),
})

export const loginUserSchema = registerUserSchema.pick({
  email: true,
  password: true,
})

export type RegisterUserInput = z.infer<typeof registerUserSchema>