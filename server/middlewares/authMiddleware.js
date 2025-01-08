const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.header('authorization').split(" ")[1];
        const decryptedToken = jwt.verify(token, process.env.JWT_SECRET);
        // Add the full user object to req
        req.user = { _id: decryptedToken.userId };
        req.body.userId = decryptedToken.userId;
        next();
    } catch (error) {
        res.status(401).send({
            success: false,
            message: error.message
        });
    }
};