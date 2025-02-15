import prisma from '@/config/db'
import { Request, Response } from 'express'

const listAll = async (request: Request, response: Response) => {
  const doctors = await prisma.doctor.findMany({
    select: {
      user: {
        select: {
          name: true,
          email: true,
        }
      }
    }
  })

  const formattedDoctors = doctors.map(doctor => ({
    name: doctor.user.name,
    email: doctor.user.email
  }))

  response.status(200).json(formattedDoctors)
}

export default {
  listAll
}