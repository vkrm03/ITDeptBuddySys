const mongoose = require('mongoose');


const reportSchema = new mongoose.Schema({
    remarks: { type: String, required: true },
    mark: { type: String, required: true },
    grade : { type: String, required: true },
    std_reg_no : { type: String, required: true },
});

const report = mongoose.model('report', reportSchema);

module.exports = report;