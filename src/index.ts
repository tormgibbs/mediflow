import app from '@/app'
import 'module-alias/register'
import { PORT } from './config'

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
