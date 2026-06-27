function errorHandler(err, req, res, next) {
    console.log("Error Middleware Executed");

    res.status(400).json({
        message: err.message
    });
}

module.exports = errorHandler;