const mongoose = require('mongoose');


const stdansSchema = new mongoose.Schema({
    question: { type: String, required: true },
    ans: { type: String, required: true },
    output : { type: String, required: true },
    std_reg_no : { type: String, required: true },
    submited_date: { type: String, required: true },
});

const stdAns = mongoose.model('stdanswers', stdansSchema);

module.exports = stdAns;