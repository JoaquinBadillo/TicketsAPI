const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// API routes
const authRouter = require('./routes/auth');

dotenv.config();

mongoose.connect(
    process.env.DATABASE_URL,
    { useNewUrlParser: true },
);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static('static'));

app.use('/api/user', authRouter);

app.listen(port, () => {
    console.log(`Local: http://localhost:${port}`);
    }
);
