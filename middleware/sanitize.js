const sanitizer = require("sanitizer");

const sanitize = (req, res, next) => {
  const request = req.body;
  for (let key in request) {
    request[key] = sanitizer.escape(request[key]);
  }

  next();
};

module.exports = sanitize;
