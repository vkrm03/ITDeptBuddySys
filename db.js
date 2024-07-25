const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    reg_no: { type: String, required: true },
    std_name: { type: String, required: true },
    std_dob: { type: String, required: true },
    std_phone: { type: Number, required: true },
    std_email: { type: String, required: true },
    mentee_id: { type: String, required: true },
});

const Students = mongoose.model('Students', studentSchema);

module.exports = Students;
