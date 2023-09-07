import asyncHandler from 'express-async-handler'
import User from '../models/User.js'
import ErrorResponse from '../utils/ErrorResponse.js'

export const getAllUsers = asyncHandler(async (req, res, next) => {
    const users = await User.find({}).select('-password').sort('-createdAt')
    return res.status(200).json({
        success: true,
        message: 'All users data found successfully.',
        count: users.length,
        data: users,
    })
})

export const getUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params?.id)
    if (!user) return next(new ErrorResponse(`No user found with id ${req.params?.id}`, 404))
    return res.status(200).json({
        success: true,
        message: 'User found successfully.',
        data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        },
    })
})

export const updateUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params?.id)
    if (!user) return next(new ErrorResponse(`No user found with id ${req.params?.id}`, 404))
    const { name, email, password, isAdmin } = req.body
    if (name) user.name = name
    if (email) user.email = email
    if (password) user.password = password
    if (typeof isAdmin === 'boolean') user.isAdmin = isAdmin
    await user.save()
    return res.status(201).json({
        success: true,
        message: 'User updated successfully.',
        data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        },
    })
})

export const removeUser = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.params?.id)
    if (!user) return next(new ErrorResponse(`No user found with id ${req.params?.id}`, 404))
    return res.status(200).json({
        success: true,
        message: 'User removed successfully.',
    })
})
