import express from 'express'
const router = express.Router()

import { register, login, getProfile, updateProfile } from '../controllers/user-controller.js'
import { getAllUsers, getUser, updateUser, removeUser } from '../controllers/admin-controller.js'
import { auth, isAdmin } from '../middleware/auth.js'

router.route('/').post(register).get(auth, isAdmin, getAllUsers)
router.post('/login', login)

router.route('/profile').get(auth, getProfile).put(auth, updateProfile)

router.route('/:id').get(auth, isAdmin, getUser).put(auth, isAdmin, updateUser).delete(auth, isAdmin, removeUser)

export default router
