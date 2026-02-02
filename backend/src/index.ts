import express, { Express } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import apiRouter from './routes/api'

dotenv.config()

const app: Express = express()
const port = process.env.PORT || 3001

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}))

app.use(express.json())

app.use('/api', apiRouter)

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
