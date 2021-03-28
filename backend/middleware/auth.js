const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    if(req.method === "OPTIONS" ) {
        return next();
    }
    try {
        const token = req.headers.authorization.split(' ')[1];
        if(!token) {
            let newErr =  new Error("Authorization token not found");
            newErr.code = 403
            return next(newErr);
        }
        const payload = jwt.verify(token, 'secretkey');
        req.userId = payload.id;
        next();
    } catch(err) {
        let newErr = new Error("Authorization failed. Please try again later.")
        newErr.code = 401
        next(newErr);
    }
};