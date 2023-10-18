const { createLogger, format, transports } = require("winston");
require("winston-mongodb");

const logger = createLogger({
  transports: [
    new transports.Console({
      level: "info",
      format: format.combine(format.timestamp(), format.json()),
      options: {useUnifiedTopology: true}
    }),
    new transports.MongoDB({
      level: "error",
      db: process.env.DATABASE_URL,
      collection: "error-logs",
      format: format.combine(format.timestamp(), format.json()),
      options: {useUnifiedTopology: true}
    }),
    new transports.MongoDB({
      level: "info",
      db: process.env.DATABASE_URL,
      collection: "info-logs",
      format: format.combine(format.timestamp(), format.json()),
      options: {useUnifiedTopology: true}
    }),
  ]
});

module.exports = logger;
