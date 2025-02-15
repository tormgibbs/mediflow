import prisma from '@/config/db'
import schedule from 'node-schedule'

export const scheduleReminders = (plan: { task: string; days: number }[], patientId: string) => {
  plan.forEach((task, index) => {
    const jobName = `reminder-${patientId}-${index}`

    schedule.scheduleJob(jobName, `*/${task.days} * * * *`, async function () {
      console.log(`Reminder for patient ${patientId}: ${task.task}`)
          

      await prisma.reminder.create({
        data: {
          patientId,
          task: task.task,
          status: 'PENDING',
        },
      })
    })
  })
}

// Function to clear old reminders when a new note is added
export const clearOldReminders = (patientId: string) => {
  const jobs = schedule.scheduledJobs
  for (const job in jobs) {
    if (job.includes(patientId)) {
      schedule.cancelJob(job)
    }
  }
}