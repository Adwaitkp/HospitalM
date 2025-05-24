const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Login with Email & Password
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Debug log
        console.log("Login attempt for email:", email);
        
        let user = await User.findOne({ email });
        if (!user) {
            console.log("User not found with email:", email);
            return res.status(400).json({ msg: "Invalid credentials" });
        }

        // If user registered through Google and has no password
        if (!user.password) {
            console.log("User has no password (OAuth user)");
            return res.status(400).json({ msg: "Please login with Google" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("Password doesn't match for user:", email);
            return res.status(400).json({ msg: "Invalid credentials" });
        }

        // Generate JWT Token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        console.log("User logged in successfully:", user.email);
        
        res.json({ 
            token, 
            user: { 
                id: user._id, 
                name: user.name, 
                email: user.email,
                role: user.role // Include role in response
            } 
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// Google OAuth Login
router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth Callback
router.get(
    "/google/callback",
    passport.authenticate("google", { session: false }),
    async (req, res) => {
        try {
            console.log("Google callback received, req.user:", req.user);
            
            if (!req.user) {
                console.log("Authentication failed - no user");
                return res.status(401).json({ message: "Authentication failed" });
            }

            // Generate JWT token here (not in the strategy)
            const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
            console.log("Token generated for user:", req.user.email);

            // Redirect to frontend with token
            res.redirect(`https://utkarsha.onrender.com/oauth/callback?token=${token}`);
        } catch (error) {
            console.error("Google OAuth Error:", error);
            res.status(500).json({ message: "Server error" });
        }
    }
);

// Get Profile
router.get("/profile", authMiddleware, async (req, res) => {
    try {
        console.log("Fetching profile for user ID:", req.user.id);
        
        const user = await User.findById(req.user.id).select("-password");
        console.log("User found:", user);
        
        if (!user) {
            console.log("User not found with ID:", req.user.id);
            return res.status(404).json({ msg: "User not found" });
        }
        
        res.json(user);
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// Register with Email & Password
router.post("/register", async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;
        
        console.log("Registration attempt for email:", email);
        
        if (!name || !email || !password || !confirmPassword) {
            console.log("Missing required fields");
            return res.status(400).json({ message: "All fields are required" });
        }
        
        if (password !== confirmPassword) {
            console.log("Passwords don't match");
            return res.status(400).json({ message: "Passwords do not match" });
        }

        let user = await User.findOne({ email });
        if (user) {
            console.log("User already exists with email:", email);
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({ 
            name, 
            email, 
            password: hashedPassword,
            role: "patient" // Set default role explicitly
        });

        await user.save();
        console.log("User registered successfully:", email);
        
        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;