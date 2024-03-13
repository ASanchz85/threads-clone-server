import jwt from 'jsonwebtoken'
import User from '../db/models/userModel.js'

async function guardRoute (req, res, next) {
  try {
    const token = req.cookies.token

    if (!token) {
      return res.status(401).json({ error: 'Not authorized to access this route' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.userId).select('-password')

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    req.user = user

    next()
  } catch (error) {
    res.status(500).json({ error: error.message })
    console.log('Error in guardRoute', error)
  }
}

export default guardRoute
