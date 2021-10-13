const mongoose = require('mongoose');

const BlockDetailsSchema = new mongoose.Schema({
    blockName: {
        type: String,
        required: true
    },
    blockId: {
        type: String,
        required: true
    },

});

const BlockName = mongoose.model('BlockNames', BlockDetailsSchema);

module.exports = BlockName;