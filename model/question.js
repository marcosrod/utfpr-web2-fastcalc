const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
    user_email : {type: String, required:true, lowercase:true},
    difficulty: {type:String,required:true},
    score: {type:Number, required:true},
    remaining_time: {type:Number, required:true},
    created: {type:Date,default:Date.now}

})

module.exports = mongoose.model('Questions',QuestionSchema);