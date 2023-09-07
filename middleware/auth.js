const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    jwt.verify(
        req.headers['x-access-token'], 
        process.env.ACCESS_TOKEN_SECRET, 
        (err, decoded) => {
            if (err)
                return res.status(401).send({ message: 'Unauthorized' });

            req.userId = decoded.id;
            req.userRole = decoded.role;
            next();
        }
    );
};

module.exports = authenticate;