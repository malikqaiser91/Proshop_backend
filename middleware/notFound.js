export default async (req, res, next) => {
    const URL = `${req.protocol}://${req.get('host')}${req.originalUrl}`
    return res.status(404).json({
        success: false,
        message: `No url found with ${URL}`,
    })
}
