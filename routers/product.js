import express from 'express'
const router = express.Router()

import {
    getProducts,
    createProduct,
    getProduct,
    productReview,
    topProduct,
    deleteProduct,
    updateProduct,
    uploadFile,
} from '../controllers/product-controller.js'
import { auth, isAdmin } from '../middleware/auth.js'

router.route('/').get(getProducts).post(auth, isAdmin, createProduct)

router.route('/top-products').get(topProduct)

router.route('/:id/reviews').post(auth, productReview)

router.route('/:id/upload').put(auth, isAdmin, uploadFile)

router.route('/:id').get(getProduct).put(auth, isAdmin, updateProduct).delete(auth, isAdmin, deleteProduct)

export default router
