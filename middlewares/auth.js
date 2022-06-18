const jwt = require('jsonwebtoken');
require('dotenv').config()
const auth = (req,res,next) =>{
    const tokenHeader = req.headers.auth;

    if (!tokenHeader) return res.status(401).send({ error: 'Autenticação negada!'});

    jwt.verify(tokenHeader,process.env.tokenPass, (err,decoded)=>{
        if (err) return res.status(401).send({error: 'Token inválido'});
        return next();
    })
}

module.exports = auth;