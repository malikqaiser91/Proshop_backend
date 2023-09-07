import asyncHandler from 'express-async-handler'
import Order from '../models/Order.js'
import ErrorResponse from '../utils/ErrorResponse.js'

export const addOrder = asyncHandler(async (req, res, next) => {
    const { orderItems, shippingAddress, paymentMethod, taxPrice, shippingPrice, totalPrice } = req.body
    if (orderItems && orderItems.length === 0) return next(new ErrorResponse(`No items to order`, 400))
    const order = new Order({
        orderItems,
        shippingAddress,
        paymentMethod,
        taxPrice,
        shippingPrice,
        totalPrice,
    })
    order.user = req.user._id
    await order.save()

    return res.status(201).json({
        success: true,
        message: 'Order created successfully.',
        data: order,
    })
})

export const getOrders = asyncHandler(async (req, res, next) => {
    const orders = await Order.find({}).sort('-createdAt')
    const count = await Order.countDocuments({})
    return res.status(200).json({
        success: true,
        message: 'Orders found successfully.',
        count,
        data: orders,
    })
})

export const myOrders = asyncHandler(async (req, res, next) => {
    const userOrders = await Order.find({ user: req.user._id })
    return res.status(200).json({
        success: true,
        message: 'User orders found successfully.',
        data: userOrders,
    })
})

export const getOrder = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate('user')
    if (!order) return next(new ErrorResponse(`No order found with id ${req.params.id}`, 404))
    if (order.user._id.toString() !== req.user?._id.toString() && !req.user.isAdmin) return next(new ErrorResponse(`Order does not belong to the user.`, 401))
    return res.status(200).json({
        success: true,
        message: 'Order found successfully',
        data: order,
    })
})

export const payOrder = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id)
    if (!order) return next(new ErrorResponse(`No order found with id ${req.params.id}`, 404))
    order.isPaid = true
    order.paidAt = Date.now()
    order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: Date.now(),
        email_address: req.user.email,
    }

    await order.save()
    return res.status(200).json({
        success: true,
        message: 'Order paid successfully',
    })
})

export const deliverOrder = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id)
    if (!order) return next(new ErrorResponse(`No order found with id ${req.params.id}`, 404))

    order.isDelivered = true
    order.deliveredAt = Date.now()

    await order.save()
    return res.status(200).json({
        success: true,
        message: 'Order delivered successfully',
    })
})
