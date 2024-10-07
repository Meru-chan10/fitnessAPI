const jwt = require("jsonwebtoken")

//  Environment Setup
require('dotenv').config()


//Token Creation
module.exports.createAccessToken = (user) => {
    const data = {
        id : user._id,
        email : user.email,
    };

    return jwt.sign(data, process.env.JWT_SECRET_KEY, {});
    
};


// Token Verification
module.exports.verify = (req, res, next) => {
    console.log(req.headers.authorization);

    let token = req.headers.authorization;

    if(typeof token === "undefined"){
        return res.send({ auth: "Failed. No Token" });
    } else {
        console.log(token);		
        token = token.slice(7, token.length);
        console.log(token);

        jwt.verify(token, process.env.JWT_SECRET_KEY, function(err, decodedToken){
            
            if(err){
                return res.status(403).send({
                    auth: "Failed",
                    message: err.message
                });

            } else {

                console.log("result from verify method:")
                console.log(decodedToken);

                req.user = decodedToken;

                next();
            }
        })
    }
};


// Error handler
module.exports.errorHandler = (err, req, res, next) => {
    // Log the error
    console.error(err);

    //Add status code 500
    const statusCode = err.status || 500;
    const errorMessage = err.message || 'Internal Server Error';

    // Send a standardized error response
    res.status(statusCode).json({
        error: {
            message: errorMessage,
            errorCode: err.code || 'SERVER_ERROR',
            details: err.details || null
        }
    });
};


// Middleware to check if the user is authenticated
module.exports.isLoggedIn = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.sendStatus(401);
    }
}