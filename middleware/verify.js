const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const header = req.headers['authorization'];
    const token = header && header.split(' ')[1];

    if (token == null)
        return res.sendStatus(401); // Unauthorized

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err)
            return res.sendStatus(403); // Forbidden

        req.user = user;
        next();
    })
}
