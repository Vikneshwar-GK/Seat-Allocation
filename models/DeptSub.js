const mongoose = require('mongoose');

const DeptSubSchema = new mongoose.Schema({
    sem: {
        type: String,
        required: true
    },
    dept: {
        type: String,
        required: true
    },
    subj: {
        type: String,
        required: true
    },
});

const DeptSub = mongoose.model('DeptSub', DeptSubSchema);

module.exports = DeptSub;