const express = require('express')
const router = express.Router();

const Users = require('../model/user'); 

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
require('dotenv').config()

const createUserToken = (userid) =>{
    return jwt.sign({id: userid},process.env.tokenPass,{expiresIn:'5d'});
}

router.get('/', async (req,res) =>{  
    try {
        const users = await Users.find({});
        return res.send(users);
    }catch (err) {

        return res.status(500).send({error:'Houve um erro ao fazer a consulta de usuarios'});
        
    }

})

router.post('/create', async(req,res)=>{
    const {email, password} = req.body;

    if(!email || !password) return res.status(400).send({error:'Houve um erro na criação de usuario, dados insuficientes'})

    try {
        if (await Users.findOne({email})) return res.status(400).send({error:'Usuário já cadastrado'});

        req.body.admin = false;
        const user = await Users.create(req.body);
        user.password = undefined;
        return res.status(201).send({user,token: createUserToken(user.id)});


    } catch (err) {
        if(err) return res.status(500).send({error:'Erro ao buscar usuario'});
    }

})

router.put('/update', async(req,res)=>{
    let {email, password} = req.body;

    if(!email || !password) return res.status(400).send({error:'Houve um erro na atualização de usuario, dados insuficientes'})

    try {
        if (!(await Users.findOne({email}))) return res.status(400).send({error:'O usuário não está cadastrado'});

        req.body.admin = false;
        password = await bcrypt.hash(password, 10);
        await Users.updateOne({email}, {password});
        const user = await Users.findOne({email});
        user.password = undefined;
        return res.status(201).send();


    } catch (err) {
        if(err) return res.status(500).send({error:'Erro ao buscar usuario'});
    }

})

router.post('/auth', async (req,res)=>{
    const {email,password} = req.body;
    if(!email || !password) return res.status(400).send({error:'Houve um erro na autenticação de usuario, dados insuficientes'})

    try {
        const user = await Users.findOne({email}).select('+password');
        if(!user) return res.status(400).send({error:'Usuário não consta no banco de dados'});

        const passOk = await bcrypt.compare(password,user.password);
        if(!passOk) return res.status(401).send({error:'Erro ao autenticar usuário!'});

        user.password = undefined;

        let token = createUserToken(user.id);

        res.cookie('token', token);
        res.redirect('/index');
    } catch (err) {
        return res.status(500).send({error:'erro ao buscar usuário'});
    }
})

router.get('/logout', async (req,res)=>{
    const {token} = req.cookies;
    if(!token) return res.status(400).send({error:'O usuário já está deslogado'})

    res.clearCookie('token');
    res.redirect('/login');
})



module.exports = router;