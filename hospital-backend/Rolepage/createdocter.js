const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Doctor = require('../models/Doctor');

const createDoctor = async () => {
    try {
        // Connect without deprecated options
        await mongoose.connect('mongodb+srv://adwaitlkshs:dqgMpLOgvYnqvh9X@cluster0.qbv5xha.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
        console.log('✅ Connected to MongoDB');

        // Create and save
        const doctor = new Doctor({
            name: 'User Doctor',
            email: 'doctor@example.com',
            password: await bcrypt.hash('doctorpassword', 10),
        });

        await doctor.save();
        console.log('✅ Doctor created successfully. Verify with:');
        console.log('   mongo hospitalDB --eval "db.doctors.find()"');

    } catch (error) {
        console.error('❌ FATAL ERROR:', error.message);
    } finally {
        await mongoose.connection.close();
    }
};

module.exports = createDoctor;