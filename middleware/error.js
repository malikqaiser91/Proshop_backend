export default (err, req, res, next) => {
    const error = { ...err }
    error.statusCode = err.statusCode
    error.message = err.message

    return res.status(error?.statusCode || 500).json({
        success: false,
        message: error.message || 'Server Error',
    })
}
