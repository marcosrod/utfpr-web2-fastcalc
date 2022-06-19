const jwt = require('jsonwebtoken');
require('dotenv').config()
const auth = (req,res,next) =>{
    const tokenHeader = req.cookies.token;

    if (!tokenHeader) {
        res.redirect('/login')
    } else {
        jwt.verify(tokenHeader,process.env.tokenPass, (err,decoded)=>{
            if (err) return res.status(401).send({error: 'Token inválido'});
            return next();
        })
    }
}

module.exports = auth;