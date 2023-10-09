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
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("💾 Connected to Database"));

// Express app
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/users", userRouter);
app.use("/api/tickets", ticketRouter);
app.use("/api/reports", reportRouter);

const port = process.env.PORT || 1337;

app.listen(port, () => {
    console.log(`⚡ Server is running: http://localhost:${port}`);
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
