const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        name: { type: String, required: true },
        coin: { type: Number, required: true, default: 0 },
    },
    { timestamps: true }
)

const User = mongoose.model('User', userSchema)
module.exports = User