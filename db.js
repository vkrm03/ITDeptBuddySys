const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    Reg_No: { type: Number, required: true },
    Std_Name: { type: String, required: true },
});

const Students = mongoose.model('Students', studentSchema);

module.exports = Students;
