const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config()
const cookieParser = require("cookie-parser");

const url = process.env.bdURL;
const options = { useUnifiedTopology: true , poolSize: 5, useNewUrlParser: true,useCreateIndex: true};

mongoose.connect(url,options);
mongoose.set('useCreateIndex',true);

mongoose.connection.on('error', (err) =>{
    console.log(url);
    console.log(`Erro na conexão com o banco de dados: ${err} `);
})

mongoose.connection.on('connected',() =>{
    console.log("Conectado com sucesso ao banco de dados");
})

mongoose.connection.on('disconnected',() =>{
    console.log("aplicação desconectada do banco de dados");
})


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('./public'));
app.use(cookieParser());

const indexRoute = require('./routes/index');
const usersRoute = require('./routes/users');
const questionsRoute = require('./routes/questions');

app.set('view engine', 'ejs');
app.set('views', "./public/html");
app.use('/', indexRoute);
app.use('/users',usersRoute);
app.use('/challenges',questionsRoute);


app.listen(3000);

module.exports = app;