import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import fileUpload from 'express-fileupload'
const app = express()

import connectDB from './config/db.js'
import notFound from './middleware/notFound.js'
import ErrorHandler from './middleware/error.js'

// routes files
import userRouter from './routers/user.js'
import productRouter from './routers/product.js'
import orderRouter from './routers/order.js'

dotenv.config({ path: './config/.env' })
connectDB()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())
app.use(
    fileUpload({
        limits: {
            fileSize: 10 * 1024 * 1024,
        },
    })
)
app.use(express.static('public'))

const PORT = process.env.PORT || 3000

app.use('/api/v1/users', userRouter)
app.use('/api/v1/products', productRouter)
app.use('/api/v1/orders', orderRouter)

app.use(notFound)
app.use(ErrorHandler)

app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`)
})

process.on('unhandledRejection', (err) => {
    console.log(`Unhandled Rejection Error ${err}`)
})
