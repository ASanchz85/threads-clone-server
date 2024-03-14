import express from 'express'
import {
  createPost,
  deletePost,
  getFeedPosts,
  getPosts,
  likePost,
  replyPost
} from '../controllers/postController.js'
import guardRoute from '../services/guardRoute.js'

const router = express.Router()

router.get('/feed', guardRoute, getFeedPosts)
router.get('/:id', getPosts)
router.post('/create', guardRoute, createPost)
router.delete('/:id', guardRoute, deletePost)
router.post('/like/:id', guardRoute, likePost)
router.post('/reply/:id', guardRoute, replyPost)

export default router
