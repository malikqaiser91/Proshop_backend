import express from 'express'
const router = express.Router()

import { auth, isAdmin } from '../middleware/auth.js'
import { addOrder, getOrders, getOrder, deliverOrder, myOrders, payOrder } from '../controllers/order-controller.js'

router.route('/').post(auth, addOrder).get(auth, isAdmin, getOrders)

router.route('/my-orders').get(auth, myOrders)

router.route('/:id').get(auth, getOrder)

router.route('/:id/pay').put(auth, payOrder)
router.route('/:id/deliver').put(auth, isAdmin, deliverOrder)

export default router
