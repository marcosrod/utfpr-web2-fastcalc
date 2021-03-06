const express = require('express')
const router = express.Router();
const auth = require('../middlewares/auth')
const helper = require('../helper/questionHelper')

router.get('/try',auth,(req, res) =>{
    res.status(200).send(helper.getQuestions(req.query.difficulty));
})

router.post('/answer',auth,(req, res) =>{
    helper.checkAnswer(req.body.answerRequest).then(function(r) {
        res.status(200).send(r);
    });
    
})

router.get('/best-time',auth,(req, res) =>{
    helper.getBestTime(req.query.email).then(function(r) {
        res.status(200).send(r);
    });
    
})

router.get('/history',auth,(req, res) =>{
    helper.getHistory(req.query.email, req.query.difficulty).then(function(r) {
        res.status(200).send(r);
    });
    
})

router.get('/get-difficulty-name', auth,(req, res) =>{
    res.status(200).send(helper.getDifficultyNameById(req.query.difficulty));
})

module.exports = router;