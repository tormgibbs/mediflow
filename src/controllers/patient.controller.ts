import prisma from '@/config/db'
import { Request, Response } from 'express'


const selectDoctor = async (request: Request, response: Response) => {
  const { doctorId } = request.body
  
  if (!doctorId) {
    response.status(400).json({ error: 'doctorId is required' })
    return 
  }

  const patient = await prisma.patient.findUnique({
    where: { userId: request.user?.userId },
  })


  if (!patient) {
    response.status(404).json({ error: 'Patient not found' })
    return 
  }

  const doctor = await prisma.doctor.findUnique({
    where: { userId: doctorId },
  })

  if (!doctor) {
    response.status(404).json({ error: 'Doctor not found' })
    return 
  }

  const updatedPatient = await prisma.patient.update({
    where: { userId: request.user?.userId },
    data: { doctorId: doctor.id },
  })

  response.status(200).json({
    message: 'Doctor assigned successfully',
    patient: updatedPatient,
  })
}

const getDoctorPatients = async (request: Request, response: Response) => {
  const doctorId = request.user?.userId

  if (!doctorId) {
    response.status(400).json({ error: 'Doctor ID is required' })
    return 
  }

  
  const doctor = await prisma.doctor.findUnique({
    where: { userId: doctorId },
  })

  if (!doctor) {
    response.status(404).json({ error: 'Doctor not found' })
    return 
  }


  const patients = await prisma.patient.findMany({
    where: { doctorId: doctor.id },
    include: { user: true }, 
  })

  response.status(200).json({
    message: 'Patients retrieved successfully',
    patients,
  })
}

const checkIn = async (request: Request, response: Response) => {
  const userId = request.user?.userId 
  const { reminderId } = request.body

  if (!reminderId) {
    response.status(400).json({ error: 'reminderId is required' })
    return 
  }

  const patient = await prisma.patient.findUnique({
    where: { userId },
  })

  if (!patient) {
    response.status(404).json({ error: 'Patient not found' })
    return 
  }

  const reminder = await prisma.reminder.findUnique({
    where: { id: reminderId },
  })

  if (!reminder) {
    response.status(404).json({ error: 'Reminder not found' })
    return 
  }

  if (reminder.patientId !== patient.id) {
    response.status(403).json({ error: 'Unauthorized' })
    return 
  }

  await prisma.reminder.update({
    where: { id: reminderId },
    data: { status: 'COMPLETED' },
  })
}


const getReminders = async (request: Request, response: Response) => {
  const userId = request.user?.userId 

  const patient = await prisma.patient.findUnique({
    where: { userId },
  })

  if (!patient) {
    response.status(404).json({ error: 'Patient not found' })
    return 
  }

  const reminders = await prisma.reminder.findMany({
    where: { patientId: patient.id },
  })

  response.status(200).json({
    message: 'Reminders retrieved successfully',
    reminders,
  })
}

const getActions = async (request: Request, response: Response) => {
  const userId = request.user?.userId

  const patient = await prisma.patient.findUnique({
    where: { userId },
  })

  if (!patient) {
    response.status(404).json({ error: 'Patient not found' })
    return 
  }

  const actions = await prisma.actionableStep.findMany({
    where: { patientId: patient.id },
  })

  response.status(200).json({
    message: 'Actions retrieved successfully',
    actions,
  })
}


export default {
  selectDoctor,
  getDoctorPatients,
  checkIn,
  getReminders,
  getActions,
}