import { Router } from 'express'
import { register, login, getMe, registerAdmin } from '../controllers/auth.controller'
import { authenticate } from '../middlewares/auth.middleware'
import { requireRole } from "../middlewares/role.middleware"
import { Role } from "../models/user.model"

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
router.post('/admin/register', authenticate, requireRole([Role.ADMIN]), registerAdmin)

// Refresh token end point

export default router
