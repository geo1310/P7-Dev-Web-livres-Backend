// Module principal de l'application Express

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
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

// protection faille XSS
app.use(helmet.xssFilter());

// Parametrage CORS
app.use(
    cors({
        origin: '*', // Access-Control-Allow-Origin
        methods: 'GET,PUT,PATCH,DELETE,POST,OPTIONS', // Access-Control-Allow-Methods
        allowedHeaders: 'Origin, Accept, Content-Type, Authorization', // Access-Control-Allow-Headers
    })
);

//  Analyse automatiquement le corps de la requête entrante en tant que JSON, puis le transforme en un objet JavaScript
app.use(express.json());

// routes générales
app.use('/api/auth', userRoutes);
app.use('/api/books', booksRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;
