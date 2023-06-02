const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const userRoutes = require('./routes/user');
const booksRoutes = require('./routes/book');


//connexion a la base de donnees
mongoose
    .connect(
        'mongodb+srv://gbriche59:amelie59@cluster0.lmuexid.mongodb.net/Vieux_Grimoire?retryWrites=true&w=majority',
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

app.use(express.json()); //  analyse automatiquement le corps de la requête entrante en tant que JSON, puis le transforme en un objet JavaScript

app.use('/api/auth', userRoutes);
app.use('/api/books', booksRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;
