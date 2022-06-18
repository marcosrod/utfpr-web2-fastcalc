const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
    user_email : {type: String, required:true, lowercase:true},
    difficulty: {type:String,required:true},
    score: {type:Integer, required:true},
    remaining_time: {type:Integer, required:true},
    created: {type:Date,default:Date.now}

})