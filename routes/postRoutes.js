import express from 'express'
import { createPost, deletePost, getPosts, likePost } from '../controllers/postController.js'
import guardRoute from '../services/guardRoute.js'

const router = express.Router()

router.get('/:id', getPosts)
router.post('/create', guardRoute, createPost)
router.delete('/:id', guardRoute, deletePost)
router.post('/like/:id', guardRoute, likePost)

export default router
