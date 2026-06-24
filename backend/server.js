const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/expenses", require("./routes/expenseRoutes"));

// Health check
app.get("/", (req, res) => {
    res.status(200).send("API Running");
});

// ------------------------------
// DATABASE CONNECTION
// ------------------------------
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB Connected");

    } catch (error) {
        console.error("Database connection failed:", error.message);
        process.exit(1);
    }
};

connectDB();

// ------------------------------
// SERVER LISTENER
// IMPORTANT: prevents tests from crashing when imported
// ------------------------------
if (require.main === module) {
    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

// Export for testing (Supertest/Mocha)
module.exports = app;
