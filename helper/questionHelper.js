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

module.exports = {getQuestions};