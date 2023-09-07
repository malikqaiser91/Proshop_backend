import asyncHandler from 'express-async-handler'
import User from '../models/User.js'
import ErrorResponse from '../utils/ErrorResponse.js'

export const register = asyncHandler(async (req, res, next) => {
    const { name, email, password } = req.body
    if (!name || !email || !password)
        return res.status(400).json({
            success: false,
            message: 'Please include all the required fields.',
        })
    let user = await User.findOne({ email })
    if (user) return next(new ErrorResponse(`User already exist with email ${email}`, 400))
    user = new User({
        name,
        email,
        password,
    })
    await user.save()

    return res.status(201).json({
        success: true,
        message: 'User registered successfully.',
        data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: await user.generateJWToken(),
        },
    })
})

export const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body
    if (!email || !password) return next(new ErrorResponse(`Please include all the required fields.`, 400))
    const user = await User.findOne({ email })
    if (!user || !(await user.validatePassword(password))) return next(new ErrorResponse(`Invalid Credentials`, 400))
    return res.status(200).json({
        success: true,
        message: 'User login successfully.',
        data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: await user.generateJWToken(),
        },
    })
})

export const getProfile = asyncHandler(async (req, res, next) => {
    const user = req?.user
    return res.status(200).json({
        success: true,
        message: 'User data found successfully.',
        data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            isAdmin: user.isAdmin,
        },
    })
})

export const updateProfile = asyncHandler(async (req, res, next) => {
    const { name, email, password } = req.body
    const user = await User.findById(req.user._id)
    if (name) user.name = name
    if (email) user.email = email
    if (password) user.password = password
    await user.save()
    return res.status(201).json({
        success: true,
        message: 'User profile updated successfully.',
        data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: await user.generateJWToken(),
        },
    })
})
