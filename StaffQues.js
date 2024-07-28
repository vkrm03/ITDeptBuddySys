const mongoose = require('mongoose');


const StaffquestionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    staff_id : { type: String, required: true },
    deadline: { type: String, required: true },
    meetinglink: { type: String, required: true },
});

const staffQue = mongoose.model('StaffQuestion', StaffquestionSchema);

module.exports = staffQue;