import jwt from 'jsonwebtoken'
import ErrorResponse from '../utils/ErrorResponse.js'
import asyncHandler from 'express-async-handler'
import User from '../models/User.js'

export const auth = asyncHandler(async (req, res, next) => {
    let token
    if (req.headers && req.headers?.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
        try {
            const decoded = jwt.decode(token, process.env.JWT_SECRET)
            const user = await User.findById(decoded._id)
            req.user = user
            next()
        } catch (err) {
            console.log('JWT Token Error', err)
            return next(new ErrorResponse(`Invalid Token, Not Authorized`, 401))
        }
    }
    if (!token) return next(new ErrorResponse(`No Token, Not Authorized`, 401))
})

export const isAdmin = asyncHandler(async (req, res, next) => {
    if (req.user && req.user.isAdmin) next()
    else return next(new ErrorResponse(`User with role of Admin can access this route.`, 403))
})
