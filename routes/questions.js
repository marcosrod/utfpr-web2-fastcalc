const express = require('express')
const router = express.Router();
const auth = require('../middlewares/auth')
const helper = require('../helper/questionHelper')

router.get('/',auth,(req, res) =>{

})

router.get('/solved',auth,(req, res) =>{

})

router.get('/activities',auth,(req, res) =>{

})

router.get('/random',auth,(req, res) =>{
    res.status(200).send(helper.getQuestions());
})

router.post('/answer',auth,(req, res) =>{
    helper.checkAnswer(req.body.answerRequest).then(function(r) {
        res.status(200).send(r);
    });
    
})

module.exports = router;