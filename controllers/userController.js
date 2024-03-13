import User from '../db/models/userModel.js'
import bcrypt from 'bcryptjs'
import generateToken from '../utils/generateToken.js'

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
      generateToken(newUser._id, res)

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

async function loginUser (req, res) {
  try {
    const { username, password } = req.body

    const user = await User.findOne({ username })
    const isMatch = await bcrypt.compare(password, user?.password ?? '')

    if (!user || !isMatch) {
      return res.status(400).json({ error: 'Invalid username or password' })
    }

    generateToken(user._id, res)

    res.status(200).json({
      message: 'User logged in successfully',
      error: null,
      data: {
        _id: user._id,
        username: user.username
      }
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
    console.log('Error in loginUser', error)
  }
}

function logoutUser (req, res) {
  try {
    res.clearCookie('token')

    res.status(200).json({
      message: 'User logged out successfully',
      error: null,
      data: null
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
    console.log('Error in logoutUser', error)
  }
}

async function followUser (req, res) {
  try {
    const { id } = req.params
    const userToModify = await User.findById(id)
    const currentUser = await User.findById(req.user._id)

    if (!userToModify || !currentUser) {
      return res.status(404).json({ error: 'User not found' })
    }

    if (id === req.user._id) {
      return res.status(400).json({ error: 'You cannot follow yourself' })
    }

    const isFollowing = currentUser.following.includes(userToModify._id)

    if (isFollowing) {
      // unfollowing
      await User.findByIdAndUpdate(currentUser._id, {
        $pull: { following: userToModify._id }
      })

      await User.findByIdAndUpdate(userToModify._id, {
        $pull: { followers: currentUser._id }
      })

      res.status(200).json({
        message: `You are no longer following ${userToModify.username}`,
        error: null,
        data: null
      })
    } else {
      // following
      await User.findByIdAndUpdate(currentUser._id, {
        $push: { following: userToModify._id }
      })

      await User.findByIdAndUpdate(userToModify._id, {
        $push: { followers: currentUser._id }
      })

      res.status(200).json({
        message: `You are now following ${userToModify.username}`,
        error: null,
        data: null
      })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
    console.log('Error in following/unfollowing user', error)
  }
}

export { signUpUser, loginUser, logoutUser, followUser }
