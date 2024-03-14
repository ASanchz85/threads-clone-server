import express from 'express'
import {
  loginUser,
  signUpUser,
  logoutUser,
  followUser,
  updateUser,
  getUserProfile
} from '../controllers/userController.js'
import guardRoute from '../services/guardRoute.js'

const router = express.Router()

router.get('/profile/:username', getUserProfile)
router.post('/signup', signUpUser)
router.post('/login', loginUser)
router.post('/logout', logoutUser)
router.post('/follow/:id', guardRoute, followUser)
router.put('/update/:id', guardRoute, updateUser)

export default router
