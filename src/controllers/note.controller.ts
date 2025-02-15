import prisma from '@/config/db'
import { ActionableSteps, processDoctorNote } from '@/services/gemini.service'
import { clearOldReminders, scheduleReminders } from '@/services/scheduler.service'
import { Request, Response } from 'express'

const createNote = async (request: Request, response: Response) => {
  const userId = request.user?.userId
  const { patientId, note } = request.body

  if (!patientId || !note) {
    response.status(400).json({ error: 'Patient ID and note are required' })
    return 
  }

  const doctor = await prisma.doctor.findUnique({
    where: { userId },
  })

  if (!doctor) {
    response.status(404).json({ error: 'Doctor not found' })
    return 
  }

  await prisma.doctorNote.create({
    data: {
      doctorId: doctor.id,
      patientId,
      content: note
    }
  })

  const actions: ActionableSteps | null = await processDoctorNote(note)

  if (!actions) {
    response.status(500).json({ error: 'Failed to process note with Gemini' })
    return 
  }

  clearOldReminders(patientId)
  scheduleReminders(actions.plan, patientId)

  await prisma.actionableStep.create({
    data: {
      patientId,
      checklist: actions.checklist,
      plan: actions.plan,
    }
  })

  response.json({ message: 'Note processed successfully', actions })
}


const listNotes = async (request: Request, response: Response) => {
  const userId = request.user?.userId
  
  const patient = await prisma.patient.findUnique(
    { where: { userId } }
  )
 
  if (!patient) {
    response.status(400).json({ error: 'Patient not found' })
    return 
  }

  const doctor = await prisma.doctor.findUnique({
    where: { userId },
  })

  if (!doctor) {
    response.status(404).json({ error: 'Doctor not found' })
    return 
  }

  const notes = await prisma.doctorNote.findMany({
    where: { patientId: patient.id },
  })

  response.status(200).json(notes)
}

export default {
  createNote,
  listNotes,
}