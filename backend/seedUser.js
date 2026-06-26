const mongoose = require("./config/db");
const User = require("./models/User");

const seedUsers = async () => {
  try {
    console.log("Seeding users...");

    // optional cleanup
    await User.deleteMany({});

    // ADMIN USER
    await User.create({
      email: "david@test.com",
      password: "Password123",
      role: "admin"
    });

    // NORMAL USER (IMPORTANT FOR RBAC TEST)
    await User.create({
      email: "user@test.com",
      password: "Password123",
      role: "user"
    });

    console.log("Users seeded successfully");
    process.exit();

  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
};

seedUsers();
