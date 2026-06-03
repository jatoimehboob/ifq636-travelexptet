const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const expenseRoutes = require("./routes/expenseRoutes");
const path = require("path");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use("/api/expenses", expenseRoutes);

// Serve frontend build
app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
});
// Start server
if (require.main === module) {
  connectDB();

  const PORT = process.env.PORT || 5001;

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;