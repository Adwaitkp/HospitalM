const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin'); // Corrected path

const createAdmin = async () => {
    try {
        await mongoose.connect('mongodb+srv://adwaitlkshs:dqgMpLOgvYnqvh9X@cluster0.qbv5xha.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

        const hashedPassword = await bcrypt.hash('adminpassword', 10);

        const admin = new Admin({
            name: 'Admin User',  // Add this
            email: 'admin@example.com', // Add this
            password: hashedPassword,
        });

        await admin.save();
        console.log('Admin user created successfully');
    } catch (error) {
        console.error('Error creating admin user:', error);
    } finally {
        mongoose.connection.close();
    }
};

createAdmin();
