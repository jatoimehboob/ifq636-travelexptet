// One-off script to create (or promote) the admin account.
// Run once from your backend root: node seedAdmin.js
// Change the password below before running, or change it via the
// app immediately after your first login.

require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');

const ADMIN_EMAIL = 'admin@admin.com';
const ADMIN_PASSWORD = 'Admin@12345';

const seedAdmin = async () => {
    await connectDB();

    let admin = await User.findOne({ email: ADMIN_EMAIL });

    if (admin) {
        admin.role = 'admin';
        admin.isActive = true;
        await admin.save();
        console.log(`Existing user promoted to admin: ${ADMIN_EMAIL}`);
    } else {
        admin = await User.create({
            name: 'Admin',
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD,
            role: 'admin',
        });
        console.log(`Admin user created: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
    }

    await mongoose.connection.close();
};

seedAdmin();
