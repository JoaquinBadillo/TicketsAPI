const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");
const User = require("../models/User");


const authenticate = async (req, res, next) => {
  jwt.verify(
    req.get("Authentication"),
    process.env.ACCESS_TOKEN_SECRET,
    (err, decoded) => {
      if (err) {
        logger.error("Attempted unauthorized access");
        return;
      }

      req.userId = decoded.id;
      req.userRole = decoded.role;
    }
  );
  
  if (req.userId == null || req.userRole == null)
    return res.status(401).send({ message: "Unauthorized" });

  const user = await User.findOne({ _id: req.userId });

  if (!user) {
    logger.error("Someone faked a token");
    return res.status(401).send({message: "Hasta crees"});
  }

  if (user.role !== req.userRole) {
    logger.error(`Someone tried to raise permissions for user with email: ${user.email}`);
    return res.status(403).send({message: "Hasta crees"});
  }

  next();
};

module.exports = authenticate;
