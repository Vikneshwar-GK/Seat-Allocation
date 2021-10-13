const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    dept: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    roll: {
        type: Number,
        required: true
    },
    elective: {
        type: String,
        required: true
    }

});

const User = mongoose.model('studinfo', UserSchema);

module.exports = User;