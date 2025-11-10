import { Router } from 'express'
import { authenticate } from '../middlewares/auth.middleware'
import { savePost, getAllPost, getMyPost } from '../controllers/post.controller'
import { requireRole } from '../middlewares/role.middleware'
import { Role } from '../models/user.model'
import { upload } from '../middlewares/upload.middleware'

const router = Router()

// /api/v1/post/create
// protected route (AUTHOR, ADMIN)
// image upload with multer middleware, image - form data eke key eke name ek denn oni
router.post('/create', authenticate, requireRole([ Role.ADMIN, Role.AUTHOR ]), upload.single('image'), savePost)

// /api/v1/post/
// public route
router.get('/', getAllPost)

// /api/v1/post/me
// protected route (AUTHOR, ADMIN)
router.get('/me', authenticate, requireRole([ Role.ADMIN, Role.AUTHOR ]), getMyPost)

export default router
