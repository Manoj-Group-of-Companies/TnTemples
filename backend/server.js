const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./src/config/db');
require('dotenv').config();

const app = express();

// Middlewares
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/uploads', express.static('public/uploads'));

//routes
const authRoutes = require('./src/routes/authRoutes');
const templeRoutes = require('./src/routes/templeRoutes');
const masterRoutes = require("./src/routes/masterRoutes");
const contributorsRoutes = require("./src/routes/contributorRequestRoutes");

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/temples', templeRoutes);
app.use("/api/v1/masters", masterRoutes);
app.use("/api/v1/contributors", contributorsRoutes);

const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
