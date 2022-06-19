const Answers = require('../model/answer'); 
var questions = [];

function getQuestions() {
    let i = 0;
    for(i = 0; i < 10; i++) {
        questions.push(getRandomQuestions());
    }
    
    return questions;
}

function getRandomQuestions() {
    var contador = 1;
    while(contador !== 0) {
        contador = 0;
        var random = {n1: (Math.random() * (9 - 1 + 1) + 1).toFixed(0), n2: (Math.random() * (9 - 1 + 1) + 1).toFixed(0)};
        questions.some(function(el) {
            if (el.n1 === random.n1 && el.n2 === random.n2) {
                contador++;
            }
        })
    }

    return random;
}

async function checkAnswer(answerRequest) {
    const {id, n1, n2, result, dateTimeAnswer, dateTimeStart, userEmail} = answerRequest;
    let remainingTime = dateTimeStart - dateTimeAnswer;
    
    if ((n1 * n2 !== result)) {
        return {remainingTime: dateTimeAnswer, result: false}
    } else if(id == 'q1'){
        await Answers.create({user_email: userEmail, open: true, q1: dateTimeAnswer})

        return {remainingTime: remainingTime, result: true}
    } else {
        switch(id) {
            case 'q2':
                Answers.updateOne({user_email: userEmail, open: true}, {q2: dateTimeAnswer})
                break;
            case 'q3':
                Answers.updateOne({user_email: userEmail, open: true}, {q3: dateTimeAnswer})
                break;
            case 'q4':
                Answers.updateOne({user_email: userEmail, open: true}, {q4: dateTimeAnswer})
                break;
            case 'q5':
                Answers.updateOne({user_email: userEmail, open: true}, {q5: dateTimeAnswer})
                break;
            case 'q6':
                Answers.updateOne({user_email: userEmail, open: true}, {q6: dateTimeAnswer})
                break;
            case 'q7':
                Answers.updateOne({user_email: userEmail, open: true}, {q7: dateTimeAnswer})
                break;
            case 'q8':
                Answers.updateOne({user_email: userEmail, open: true}, {q8: dateTimeAnswer})
                break;
            case 'q9':
                Answers.updateOne({user_email: userEmail, open: true}, {q9: dateTimeAnswer})
                break;
            case 'q10':
                Answers.updateOne({user_email: userEmail, open: true}, {q10: dateTimeAnswer})
                break;
            default:
                break;
        }
        checkCompleted(userEmail, dateTimeStart);
        return {remainingTime: remainingTime, result: true}
    }
}

async function checkCompleted(userEmail, dateTimeStart) {
    let answer = await Answers.exists({user_email: userEmail, open: true, 
        q1: {$ne : null}, q2: {$ne : null}, q3: {$ne : null}, q4: {$ne : null}, q5: {$ne : null}, 
        q6: {$ne : null}, q7: {$ne : null}, q8: {$ne : null}, q9: {$ne : null}, q10: {$ne : null}})
    
    if(answer) {
        calculateUserScore(answer, dateTimeStart);
    }
}

function calculateUserScore(answer, dateTimeStart) {
    
}



module.exports = {getQuestions};