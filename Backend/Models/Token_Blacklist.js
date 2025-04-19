// models/TokenBlacklist.js
const mongoose = require('mongoose');

const TokenBlacklistSchema = new mongoose.Schema({
    token: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: '1d' } // Expire after 1 day
});

module.exports = mongoose.model('TokenBlacklist', TokenBlacklistSchema);
