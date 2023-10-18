const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");

const authenticate = (req, res, next) => {
  jwt.verify(
    req.get("Authentication"),
    process.env.ACCESS_TOKEN_SECRET,
    (err, decoded) => {
      if (err) {
        logger.err("Attempted unauthorized access");
        return res.status(401).send({ message: "Unauthorized" });
      }

      req.userId = decoded.id;
      req.userRole = decoded.role;
      next();
    }
  );
};

module.exports = authenticate;
