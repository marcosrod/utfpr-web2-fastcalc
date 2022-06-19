const express = require('express')
const router = express.Router();
const auth = require('../middlewares/auth')

router.get('/',(req, res) =>{
    res.redirect('login');
})


router.get('/login',(req, res) =>{
    if(req.cookies.token != null) {
        res.redirect('/index')
    } else {
        res.render('login');
    }
    
})

router.get('/register',(req, res) =>{
    res.render('register');
})

router.get('/index', auth, (req, res)=>{
    res.render('index');
})

router.get('/challenges', auth, (req, res)=>{
    res.render('challenges');
})

router.get('/help', (req, res)=>{
    res.render('doc');
})

router.get('/mypage', auth, (req, res)=>{
    res.render('mypage');
})

router.get('/mydetails', auth, (req, res)=>{
    res.render('mypagedetails');
})

router.get('/answer', auth, (req, res)=>{
    res.render('answer');
})
module.exports = router;