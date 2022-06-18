const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config()

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


app.use(express.urlencoded());
app.use(express.json());

const indexRoute = require('./routes/index');
const usersRoute = require('./routes/users');
const questionsRoute = require('./routes/questions');

app.use('/', indexRoute);
app.use('/users',usersRoute);
app.use('/questions',questionsRoute);


app.listen(3000);

module.exports = app;