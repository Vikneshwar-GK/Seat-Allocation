const mongoose = require('mongoose');

const Department = new mongoose.Schema({
    dept: {
        type: String,
        required: true
    },

});

const Departments = mongoose.model('Department', Department);

module.exports = Departments;