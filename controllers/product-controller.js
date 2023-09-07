import { fileURLToPath } from 'url'
import fs from 'fs'
import path, { dirname } from 'path'

import asyncHandler from 'express-async-handler'
import Product from '../models/Product.js'
import ErrorResponse from '../utils/ErrorResponse.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const getProducts = asyncHandler(async (req, res, next) => {
    const pageSize = 10
    const page = parseInt(req.query.page) || 1
    const searchQuery = req.query.keyword || ''
    const query = searchQuery
        ? {
              name: {
                  $regex: new RegExp(searchQuery, 'i'),
              },
          }
        : {}
    const count = await Product.countDocuments({ ...query })
    const products = await Product.find({ ...query })
        .skip(pageSize * (page - 1))
        .limit(pageSize)

    return res.status(200).json({
        success: true,
        message: 'Products found successfully.',
        count,
        data: products,
    })
})

export const createProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.create({
        name: 'Sample Product',
        price: 0,
        image: 'sample.jpg',
        brand: 'Sample brand',
        countInStock: 0,
        category: 'Sample category',
        description: 'Sample description',
        user: req.user._id,
    })
    return res.status(201).json({
        success: true,
        message: 'Product created successfully.',
        data: product,
    })
})

export const getProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id)
    if (!product) return next(new ErrorResponse(`No product found with id ${req.params.id}`, 404))
    return res.status(200).json({
        success: true,
        message: 'Product found successfully',
        data: product,
    })
})

export const productReview = asyncHandler(async (req, res, next) => {
    const { rating, comment } = req.body

    const product = await Product.findById(req.params.id)
    if (!product) return next(new ErrorResponse(`No product found with id ${req.params.id}`, 404))

    // Check if the review already exist
    const reviewExisted = product.reviews.find((r) => r.user.toString() === req.user._id.toString())
    if (reviewExisted)
        return res.status(200).json({
            success: false,
            message: `Review already existed on the product ${product.name}`,
        })

    product.reviews.push({
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
    })

    product.numReviews = product.reviews.length
    product.rating = product.reviews.reduce((sum, r) => r.rating + sum, 0) / product.reviews.length
    await product.save()
    return res.status(200).json({
        success: true,
        message: 'Review added successfully.',
    })
})

export const topProduct = asyncHandler(async (req, res, next) => {
    const topProducts = await Product.find({}).sort('-rating').limit(3)
    return res.status(200).json({
        success: true,
        message: 'Top products found successfully',
        data: topProducts,
    })
})

export const deleteProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findByIdAndDelete(req.params.id)
    if (!product) return next(new ErrorResponse(`No product found with id ${req.params.id}`, 404))
    return res.status(200).json({
        success: true,
        message: 'Product removed successfully.',
        data: product,
    })
})

export const updateProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        runValidators: true,
        new: true,
    })
    if (!product) return next(new ErrorResponse(`No product found with id ${req.params.id}`, 404))
    return res.status(200).json({
        success: true,
        message: 'Product updated successfully',
        data: {},
    })
})

export const uploadFile = asyncHandler(async (req, res, next) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return next(new ErrorResponse(`No files were uploaded.`, 400))
    }
    const { image } = req.files
    const allowedExtensions = ['png', 'jpeg', 'jpg']
    if (!allowedExtensions.includes(image.mimetype?.split('/')[1])) return next(new ErrorResponse(`Please upload the image in png, jpeg or jpg format.`, 400))
    const fileName = `product-image-${Date.now()}-${image.name}`
    const product = await Product.findById(req.params.id)
    if (product.image) {
        let imagePath = path.join(__dirname, '..', 'public', 'uploads', product.image)
        if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath)
    }
    if (!product) return next(new ErrorResponse(`No product found with id ${req.params.id}`, 404))
    product.image = `${fileName}`
    await image.mv(`${path.join(__dirname, '..')}/public/uploads/${fileName}`)
    await product.save()
    return res.status(201).json({
        success: true,
        message: 'Image uploaded successfully.',
    })
})
