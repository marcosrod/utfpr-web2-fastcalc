const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AnswerSchema = new Schema({
    user_email : {type: String, required:true, lowercase:true},
    open: {type: Boolean, required:true, lowercase:true},
    difficulty: {type: Number, required:true, lowercase:true},
    time_start: {type: Date, required:true},
    bonus_time: {type: Number},
    q1: {type:Date,default:Date.now},
    q2: {type:Date,default:Date.now},
    q3: {type:Date,default:Date.now},
    q4: {type:Date,default:Date.now},
    q5: {type:Date,default:Date.now},
    q6: {type:Date,default:Date.now},
    q7: {type:Date,default:Date.now},
    q8: {type:Date,default:Date.now},
    q9: {type:Date,default:Date.now},
    q10: {type:Date,default:Date.now},
})

module.exports = mongoose.model('Answer',AnswerSchema);