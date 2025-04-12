const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: function () { return !this.googleId; } }, // Required unless Google OAuth
    googleId: { type: String }, // For Google OAuth users
    role: { type: String, default: "patient" }, // Default role for new users
});

module.exports = mongoose.model("User", UserSchema);