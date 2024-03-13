import express from 'express'
import { signUpUser } from '../controllers/userController.js'

const router = express.Router()

router.get('/', (req, res) => {
  res.send('Hello from userRoutes')
})

router.post('/signup', signUpUser)

export default router
