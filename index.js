const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config();

// API routes
const userRouter = require('./routes/users');
const ticketRouter = require('./routes/tickets');

// Database connection
mongoose.connect(
    process.env.DATABASE_URL,
    { useNewUrlParser: true },
);

const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('💾 Connected to Database'));

// Express app
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static('static'));

app.use('/api/user', userRouter);
app.use('/api/tickets', ticketRouter);

const port = process.env.PORT || 1337;

app.listen(port, () => {
    console.log(`⚡ Server is running: http://localhost:${port}`);
    }
);
