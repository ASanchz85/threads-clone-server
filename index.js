import express from 'express'
import morgan from 'morgan'
import { configDotenv } from 'dotenv'
import dbConnection from './db/config/dbConnection.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import userRouter from './routes/userRoutes.js'

// Configurations
configDotenv()
const app = express()
const port = process.env.PORT || 3000
const logger = morgan('dev')
dbConnection()
// !missing helmet

// Middlewares
app.use(logger)
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true
  })
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// Routes
app.use('/api/users', userRouter)

// Server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
})
