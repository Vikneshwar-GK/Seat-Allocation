const mongoose = require('mongoose');

const BlockDetailsSchema = new mongoose.Schema({
    blockId: {
        type: String,
        required: true
    },
    roomNo: {
        type: String,
        required: true
    },
    matrix: {
        type: Number,
        required: true
    },
});

const BlockDetails = mongoose.model('BlockDetails', BlockDetailsSchema);

module.exports = BlockDetails;