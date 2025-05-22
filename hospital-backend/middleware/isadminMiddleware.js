const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const isAdmin = async (req, res, next) => {
    // Get token from header
    const token = req.header('x-auth-token');
    
    // Check if token exists
    if (!token) {
        console.log('No authentication token provided');
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        // Verify token
        console.log('Verifying token...');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.id, role: decoded.role };
        console.log('Token verified for user ID:', req.user.id);

        // Find admin in database
        const admin = await Admin.findById(req.user.id);
        
        // Check if admin exists
        if (!admin) {
            console.log('User not found in admin database');
            return res.status(404).json({ msg: 'User not found' });
        }
        
        // Check if user has admin role
        if (admin.role !== 'admin') {
            console.log('User does not have admin role');
            return res.status(403).json({ msg: 'Access denied, not an admin' });
        }
        
        console.log('Admin authentication successful');
        next();
    } catch (err) {
        console.error('Error in admin authentication:', err);
        
        // Handle specific JWT errors
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ msg: 'Invalid token' });
        }
        
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ msg: 'Token expired' });
        }
        
        // Generic server error
        res.status(500).json({ msg: 'Server error', details: err.message });
    }
};

module.exports = isAdmin;