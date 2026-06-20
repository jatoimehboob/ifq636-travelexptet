const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
<<<<<<< HEAD
=======

const expenseRoutes = require('./routes/expenseRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const userRoutes = require('./routes/userRoutes');
>>>>>>> 6e7cec9581199d9ff50d912129cce202acc14d0e

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

<<<<<<< HEAD
// Connect DB (important for tests)
connectDB();

// API routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/expenses', require('./routes/expenseRoutes'));

const PORT = process.env.PORT || 5001;

// Only start server when running normally (not tests)
if (require.main === module) {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
=======
// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/expenses', expenseRoutes);
console.log('Category routes loaded');
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);

connectDB();

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
>>>>>>> 6e7cec9581199d9ff50d912129cce202acc14d0e
