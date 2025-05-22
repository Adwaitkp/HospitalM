const jwt = require('jsonwebtoken');
const Doctor = require('../models/Doctor');

const isdoctorMiddleware = async (req, res, next) => {
    // Read token from standard Authorization header
    const token = req.header('Authorization')?.replace('Bearer ', ''); // Fix 1

    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        const doctor = await Doctor.findById(decoded.id);
        if (!doctor || doctor.role !== 'doctor') {
            return res.status(403).json({ msg: 'Doctor access denied' });
        }

        next();
    } catch (err) {
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ msg: 'Invalid token' });
        }
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ msg: 'Token expired' });
        }
        res.status(500).json({ msg: 'Server error' });
    }
};

module.exports = isdoctorMiddleware;