const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const https = require("https");
const fs = require("fs");
dotenv.config();

// API routes
const userRouter = require("./routes/users");
const ticketRouter = require("./routes/tickets");
const reportRouter = require("./routes/reports");

// Database connection
mongoose.connect(
  process.env.DATABASE_URL, 
  { useUnifiedTopology: true, useNewUrlParser: true }
);

// Logger
const logger = require("./utils/logger");

const db = mongoose.connection;
db.on("error", (error) => (console.error(error), logger.error(error)));
db.once("open", () => console.log("💾 Connected to Database"));

// Express app
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/users", userRouter);
app.use("/api/tickets", ticketRouter);
app.use("/api/reports", reportRouter);

// 404 handler
app.use(function (_req, res, _next) {
  logger.error("Recurso no encontrado");
  return res.status(404).send({ message: "Recurso no encontrado" });
});

// 500 handler
app.use(function (err, _req, res, _next) {
  logger.error("Error de servidor");
  return res.status(500).send({ message: "Error de servidor" });
});

const port = process.env.PORT || 1337;

app.listen(port, () => {
  //console.log(`⚡ Server is running: http://localhost:${port}`);
  logger.info(`⚡ Server is running: http://localhost:${port}`);
});

/* https
  .createServer(
    {
      cert: fs.readFileSync(process.env.CERT_FILE || "backend.cer"),
      key: fs.readFileSync(process.env.KEY_FILE || "backend.key"),
    },
    app,
  )
  .listen(port, () => {
    console.log(`⚡ Server is running: https://localhost:${port}`);
  });
*/
