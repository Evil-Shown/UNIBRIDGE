const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    studentName: String,
    title: { type: String, required: true },
    module: { type: String, required: true },
    type: { type: String, required: true, enum: ['PDF','PPT','DOCX','Video','Other'] },
    link: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Material', materialSchema);
