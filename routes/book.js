// le router stocke toute les routes

const express = require('express');
const router = express.Router(); // création d'un routeur express
const bookCtrl = require('../controllers/book');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const imageCompression = require('../middleware/compression');

// routes

router.post('/:id/rating', auth, bookCtrl.ratingBook);

router.post('/', auth, multer, imageCompression, bookCtrl.createBook); // pas de parenthese car on n'appelle pas la fonction on l'applique seulement à la route

router.put('/:id', auth, multer, imageCompression, bookCtrl.modifyBook);

router.delete('/:id', auth, bookCtrl.deleteBook);

router.get('/bestrating', bookCtrl.bestRatingBooks);

router.get('/:id', bookCtrl.findOneBook);

router.get('/', bookCtrl.findAllBooks);

module.exports = router; // regroupe les routes
