const Answers = require('../model/answer'); 
const Questions = require('../model/question');
var questions = [];

function getQuestions(difficulty) {
    let i = 0;
    for(i = 0; i < 10; i++) {
        questions.push(getRandomQuestions());
    }

    return {questions: questions, difficulty: difficulty};
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
    const {id, n1, n2, result, dateTimeAnswer, dateTimeStart, userEmail, difficulty} = answerRequest;
    var remainingTime;
    var subScore;
    if ((n1 * n2 !== result)) {
        return {result: false}
    } else if(id == 'q1'){
        if (await checkForOpenAnswers(userEmail)) {
            return "Já existe uma atividade aberta aguardando resposta, termine primeiro para depois abrir outra."
        }
        let answer = await Answers.create({user_email: userEmail, open: true, 
            difficulty: difficulty, time_start: dateTimeStart, bonus_time: null, q1: dateTimeAnswer, q2: null, q3: null, 
            q4: null, q5: null, q6: null, q7: null, q8: null, q9:null, q10:null})
            remainingTime = await calculateRemainingTime(answer.time_start, dateTimeStart, dateTimeAnswer, difficulty, userEmail);
        console.log(answer)
        return {remainingTime: remainingTime, result: true}
    } else {
        switch(id) {
            case 'q2':
                await Answers.updateOne({user_email: userEmail, open: true}, {q2: dateTimeAnswer})
                subScore = 20;
                break;
            case 'q3':
                await Answers.updateOne({user_email: userEmail, open: true}, {q3: dateTimeAnswer})
                subScore = 30;
                break;
            case 'q4':
                await Answers.updateOne({user_email: userEmail, open: true}, {q4: dateTimeAnswer})
                subScore = 40;
                break;
            case 'q5':
                await Answers.updateOne({user_email: userEmail, open: true}, {q5: dateTimeAnswer})
                subScore = 50;
                break;
            case 'q6':
                await Answers.updateOne({user_email: userEmail, open: true}, {q6: dateTimeAnswer})
                subScore = 60;
                break;
            case 'q7':
                await Answers.updateOne({user_email: userEmail, open: true}, {q7: dateTimeAnswer})
                subScore = 60;
                break;
            case 'q8':
                await Answers.updateOne({user_email: userEmail, open: true}, {q8: dateTimeAnswer})
                subScore = 60;
                break;
            case 'q9':
                await Answers.updateOne({user_email: userEmail, open: true}, {q9: dateTimeAnswer})
                subScore = 60;
                break;
            case 'q10':
                await Answers.updateOne({user_email: userEmail, open: true}, {q10: dateTimeAnswer})
                break;
            default:
                break;
        }
        let answer = await Answers.findOne({user_email: userEmail, open: true});
        remainingTime = await calculateRemainingTime(answer.time_start, dateTimeStart, dateTimeAnswer, difficulty, userEmail);
        let check = await checkCompleted(userEmail, answer.time_start, remainingTime, id, subScore);
        console.log(check);
        return check && check.completed ? check : {remainingTime: remainingTime, result: true}
    }
}

async function checkCompleted(userEmail, dateTimeStart, remainingTime, id, subScore) {
    let answer = await Answers.findOne({user_email: userEmail, open: true, 
        q1: {$ne : null}, q2: {$ne : null}, q3: {$ne : null}, q4: {$ne : null}, q5: {$ne : null}, 
        q6: {$ne : null}, q7: {$ne : null}, q8: {$ne : null}, q9: {$ne : null}, q10: {$ne : null}})
    let score;
    if(answer) {
        score = calculateUserScore(answer, dateTimeStart, id);

        return await saveQuestionResult(userEmail, answer.difficulty, score, remainingTime);
    } else if(remainingTime == 0) {
        let answer = await Answers.findOne({user_email: userEmail, open: true});
        score = calculateUserSubScore(answer, subScore);

        return await saveQuestionResult(userEmail, answer.difficulty, score, remainingTime);
    }

    return false;
    
}

async function saveQuestionResult(userEmail, difficulty, score, remainingTime) {
    let question = await Questions.create({user_email: userEmail, difficulty: difficulty, 
        score: score, remaining_time: remainingTime});
    let answer = await Answers.findOneAndUpdate({user_email: userEmail, open: true}, {open: false});

    return {completed: true, question: question, answer: answer};
}

function calculateUserScore(answer, dateTimeStart, id) {
    let answerTime = new Date(answer[id]);
    let timeStart = new Date(dateTimeStart);

    let finalRemainingTime = answerTime - timeStart;
    return calculateScoreByDifficulty(answer, finalRemainingTime);
}

function calculateUserSubScore(answer, subScore) {
    return subScore + (5 * answer.difficulty) - 10; 
}

function calculateScoreByDifficulty(answer, finalRemainingTime) {
    let scoreResult;
    switch(answer.difficulty) {
        case 1:
            scoreResult = getScoreResult(finalRemainingTime, 2);
            scoreResult = checkScoreResult(scoreResult);
            break;
        case 2:
            scoreResult = getScoreResult(finalRemainingTime, 3);
            scoreResult = checkScoreResult(scoreResult);
            break;
        case 3:
            scoreResult = getScoreResult(finalRemainingTime, 4);
            scoreResult = checkScoreResult(scoreResult);
            break;
        case 4:
            scoreResult = getScoreResult(finalRemainingTime, 10);
            scoreResult = checkScoreResult(scoreResult);
            break;
    }

    return scoreResult;
}

function getScoreResult(finalRemainingTime, operator) {
    return finalRemainingTime * operator;
}

function checkScoreResult(scoreResult) {
    return scoreResult > 100 ? 100 : scoreResult;
}

async function calculateRemainingTime(dateTimeStart, dateTimePastAnswer, dateTimeAnswer, difficulty, userEmail) {
    let dateAnswer = new Date(dateTimeAnswer);
    let datePast = new Date(dateTimePastAnswer);
    let timeAnswer = (dateAnswer.getTime() - datePast.getTime()) / 1000;
    console.log(timeAnswer);
    remainingTime = await getRemainingTime(difficulty, timeAnswer, dateTimeStart, datePast, dateAnswer, userEmail);
    remainingTime = remainingTime.toFixed(0);
    console.log(remainingTime);
    if (remainingTime < 0) {
        remainingTime = 0;
    }
    await Answers.updateOne({user_email: userEmail, open: true}, {bonus_time: remainingTime})

    return remainingTime;
}

async function getRemainingTime(difficulty, timeAnswer, dateTimeStart, datePast, dateAnswer, userEmail) {
    let finalAdditionalRemainingTime;
    let finalRemainingTime;
    let totalQuestionTime;
    let answer = await Answers.findOne({user_email: userEmail, open: true, bonus_time: {$ne: null}});

    switch(difficulty) {
        case 1:
            if (answer) {
                totalQuestionTime = answer.bonus_time;
                console.log(totalQuestionTime);
            } else {
                totalQuestionTime = 60;
            }
            finalAdditionalRemainingTime = (totalQuestionTime - timeAnswer) / 6;
            finalRemainingTime = totalQuestionTime - ((dateAnswer.getTime() - datePast.getTime()) / 1000);
            break;
        case 2:
            if (answer) {
                totalQuestionTime = answer.bonus_time;
            } else {
                totalQuestionTime = 45;
            }
            finalAdditionalRemainingTime = (totalQuestionTime - timeAnswer) / 4;
            finalRemainingTime = totalQuestionTime - ((dateAnswer.getTime() - dateTimeStart.getTime()) / 1000);
            break;
        case 3:
            if (answer) {
                totalQuestionTime = answer.bonus_time;
            } else {
                totalQuestionTime = 30;
            }
            finalAdditionalRemainingTime = (totalQuestionTime - timeAnswer) / 2;
            finalRemainingTime = totalQuestionTime - ((dateAnswer.getTime() - dateTimeStart.getTime()) / 1000);
            break;
        case 4:
            if (answer) {
                totalQuestionTime = answer.bonus_time;
            } else {
                totalQuestionTime = 20;
            }
            finalAdditionalRemainingTime = (totalQuestionTime - timeAnswer) / 2;
            finalRemainingTime = totalQuestionTime - ((dateAnswer.getTime() - dateTimeStart.getTime()) / 1000);
            break;
    }

    return finalRemainingTime + finalAdditionalRemainingTime;
}

async function checkForOpenAnswers(userEmail) {
    return await Answers.exists({user_email: userEmail, open: true})
}



module.exports = {getQuestions, checkAnswer};