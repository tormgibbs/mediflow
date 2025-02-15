import prisma from '@/config/db'
import { RegisterUserInput, ROLE } from '@/schemas/auth.schema'
import { hash } from 'bcrypt'

export const createUser = async (data: RegisterUserInput) => {
  data.password = await hash(data.password, 10)

  const role = data.role.toUpperCase() as keyof typeof ROLE

  const user = await prisma.user.create({
    data: {
      ...data,
      role,
      ...(role === 'PATIENT' && {
        patient: { create: {} }
      }),
      ...(role === 'DOCTOR' && {
        doctor: { create: {} }
      }),
    },
    include: {
      patient: true,
      doctor: true,
    },
  })

  // eslint-disable-next-line no-unused-vars
  const { password, ...userWithoutPassword } = user
  return userWithoutPassword
}

export const getUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: {
      email,
    },
  })
}

