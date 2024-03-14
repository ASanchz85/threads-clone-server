import Post from '../db/models/postModel.js'
import User from '../db/models/userModel.js'

async function getPosts (req, res) {
  try {
    const post = await Post.findById(req.params.id)
    if (!post) {
      return res.status(404).json({ error: 'Post not found' })
    }

    res.status(200).json({
      message: 'Post retrieved successfully',
      error: null,
      post: { ...post._doc }
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
    console.log('Error in getPosts', error)
  }
}

async function createPost (req, res) {
  try {
    const { postedBy, text, img } = req.body
    if (!postedBy || !text) {
      return res.status(400).json({ error: 'Posted by and text are required' })
    }

    const user = await User.findById(postedBy)
    if (!user) {
      return res.status(400).json({ error: 'User not found' })
    }

    if (user._id.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const maxLength = 500
    if (text.length > maxLength) {
      return res
        .status(400)
        .json({ error: `Text must be less than ${maxLength} characters` })
    }

    const newPost = new Post({ postedBy, text, img })
    await newPost.save()

    res.status(201).json({
      message: 'Post created successfully',
      error: null,
      post: { ...newPost._doc }
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
    console.log('Error in createPost', error)
  }
}

export { createPost, getPosts }
