import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
const Schema = mongoose.Schema

const UserSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required.'],
        },
        email: {
            type: String,
            required: [true, 'Email is required.'],
            unique: true,
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address.'],
        },
        password: {
            type: String,
            required: true,
            minLength: [6, 'Password must be at least 6 characters. '],
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
)

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

UserSchema.methods.generateJWToken = async function () {
    const payload = {
        _id: this._id,
    }
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    })
}

UserSchema.methods.validatePassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

export default mongoose.model('User', UserSchema)
