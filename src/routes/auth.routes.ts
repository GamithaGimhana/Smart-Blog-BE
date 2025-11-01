import { Router, Request, Response } from 'express'
import { register, login, getMe, registerAdmin } from '../controllers/auth.controller'
import { authenticate } from '../middlewares/auth.middlewares'

const router = Router()

// /api/v1/auth/register
// public route
router.post('/register', register)

// /api/v1/auth/login
// public route
router.post('/login', login)

// /api/v1/auth/me
// protected route (USER, AUTHOR, ADMIN)
router.get('/me', authenticate, getMe)

// /api/v1/auth/admin/register
// protected route (ADMIN)
router.post('/admin/register', authenticate, registerAdmin)

export default router
