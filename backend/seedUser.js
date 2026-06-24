const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./models/User");

const seedUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB Connected");

        // Clean existing user (prevents duplicates)
        await User.deleteMany({ email: "david@test.com" });

        // IMPORTANT:
        // DO NOT hash password here
        // pre-save hook in User model will handle hashing
        const user = await User.create({
            name: "David",
            email: "david@test.com",
            password: "Password123",
            role: "admin",
            isActive: true
        });

        console.log("✅ Seed user created successfully");
        console.log("Email: david@test.com");
        console.log("Password: Password123");

        process.exit();

    } catch (error) {
        console.error("❌ Seed error:", error.message);
        process.exit(1);
    }
};

seedUser();
