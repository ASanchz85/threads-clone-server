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

async function deletePost (req, res) {
  try {
    const { id } = req.params
    const post = await Post.findById(id)
    if (!post) {
      return res.status(404).json({ error: 'Post not found' })
    }

    if (post.postedBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    await Post.findByIdAndDelete(id)

    res.status(200).json({
      message: 'Post deleted successfully',
      error: null
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
    console.log('Error in deletePost', error)
  }
}

async function likePost (req, res) {
  try {
    const { id: postId } = req.params
    const { _id: userId } = req.user
    const post = await Post.findById(postId)
    if (!post) {
      return res.status(404).json({ error: 'Post not found' })
    }

    if (post.postedBy.toString() === userId.toString()) {
      return res.status(400).json({ error: 'Cannot like your own post' })
    }

    const isUserLiked = post.likes.includes(userId)
    if (isUserLiked) {
      // unlike
      await Post.findByIdAndUpdate(postId, {
        $pull: { likes: userId }
      })
      return res.status(200).json({
        message: 'Post unliked successfully',
        error: null,
        data: { postId, userId }
      })
    } else {
      // like
      await Post.findByIdAndUpdate(postId, {
        $push: { likes: userId }
      })
      return res.status(200).json({
        message: 'Post liked successfully',
        error: null,
        data: { postId, userId }
      })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
    console.log('Error in likePost', error)
  }
}

export { createPost, getPosts, deletePost, likePost }
