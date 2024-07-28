const mongoose = require('mongoose');


const MenteequestionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    mentee_id: { type: String, required: true },
    deadline: { type: String, required: true },
    meetinglink: { type: String, required: true },
});

const menteeQue = mongoose.model('menteeQuestion', MenteequestionSchema);

module.exports = menteeQue;