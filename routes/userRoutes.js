import express from 'express'
import {
  loginUser,
  signUpUser,
  logoutUser,
  followUser
} from '../controllers/userController.js'
import guardRoute from '../services/guardRoute.js'

const router = express.Router()

router.get('/', (req, res) => {
  res.send('Hello from userRoutes')
})

router.post('/signup', signUpUser)
router.post('/login', loginUser)
router.post('/logout', logoutUser)
router.post('/follow/:id', guardRoute, followUser)

export default router
