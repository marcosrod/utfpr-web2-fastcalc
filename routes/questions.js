const express = require('express')
const router = express.Router();
const auth = require('../middlewares/auth')
const helper = require('../helper/questionHelper')

router.get('/try',auth,(req, res) =>{
    let dateNow = new Date();
    dateNow = dateNow.toISOString();
    res.cookie('start_time', dateNow);
    res.status(200).send(helper.getQuestions(req.query.difficulty));
})

router.post('/answer',auth,(req, res) =>{
    helper.checkAnswer(req.body.answerRequest).then(function(r) {
        res.status(200).send(r);
    });
    
})

module.exports = router;