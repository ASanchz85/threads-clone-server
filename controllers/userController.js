import User from '../db/models/userModel.js'
import bcrypt from 'bcryptjs'

async function signUpUser (req, res) {
  try {
    const { name, username, email, password } = req.body

    const user = await User.findOne({ $or: [{ email }, { username }] })

    if (user) {
      return res.status(400).json({ error: 'User already exists' })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword
    })

    await newUser.save()

    if (!newUser) {
      return res.status(400).json({ error: 'Invalid user data' })
    } else {
      res.status(201).json({
        message: 'User created successfully',
        error: null,
        data: {
          _id: newUser._id,
          name: newUser.name,
          username: newUser.username,
          email: newUser.email
        }
      })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
    console.log('Error in signUpUser', error)
  }
}

export { signUpUser }
