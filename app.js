const express = require('express');
const axios = require('axios')
const app = express();
const mongoose = require('mongoose');
const userRoutes = require('./routes/user')

//connexion a la base de donees
mongoose
    .connect(
        'mongodb+srv://gbriche59:amelie59@cluster0.lmuexid.mongodb.net/?retryWrites=true&w=majority',
        { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

// ajout des headers à la reponse
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, PATCH, OPTIONS'
    );
    next();
});

app.use(express.json())

app.use('/api/auth', userRoutes);

module.exports = app;
