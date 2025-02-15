import { GEMINI_API_KEY } from '@/config'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY!)

export interface ActionableSteps {
  checklist: string[];
  plan: { task: string; days: number }[];
}

export const processDoctorNote = async(note: string): Promise<ActionableSteps | null> => {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  const prompt = `Extract actionable steps from this doctor note:

    "${note}"
    
    Return JSON format: 
    { "checklist": ["task1", "task2"], "plan": [{ "task": "task name", "days": 7 }] }
    `

  const result = await model.generateContent(prompt)
  const response = result.response
  let text = response.text()

  text = text.replace(/```json\n?|\n?```/g, '').trim()

  return JSON.parse(text) as ActionableSteps
}

// const createActionableSteps = (processedNote: ProcessedNote, noteId: string) => {
//   const createChecklistItems = processedNote.checklist.map(item => ({
//     type: 'CHECKLIST' as const,
//     description: item,
//     startDate: new Date(),
//     noteId
//   }));

//   const createPlanItems = processedNote.plan.map(item => ({
//     type: 'PLAN' as const,
//     description: item.action,
//     startDate: new Date(),
//     repetitionDays: calculateRepetitionDays(item.duration, item.frequency),
//     noteId
//   }));

//   return [...createChecklistItems, ...createPlanItems];
// };