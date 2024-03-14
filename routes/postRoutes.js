import express from 'express'
import { createPost, getPosts } from '../controllers/postController.js'
import guardRoute from '../services/guardRoute.js'

const router = express.Router()

router.get('/:id', getPosts)
router.post('/create', guardRoute, createPost)

export default router
