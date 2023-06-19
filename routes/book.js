// Router pour les Endpoints livres

const express = require('express');
const router = express.Router();
const bookCtrl = require('../controllers/book');
const auth = require('../middleware/auth');
const saveAndCompressImage = require('../middleware/saveAndCompressImage');

// notation d un livre avec son id en parametre
router.post('/:id/rating', auth, bookCtrl.ratingBook);

// creation d un livre
router.post('/', auth, saveAndCompressImage, bookCtrl.createBook);

// modification d un livre avec son id en parametre
router.put('/:id', auth, saveAndCompressImage, bookCtrl.modifyBook);

// suppression d un livre avec son id en parametre
router.delete('/:id', auth, bookCtrl.deleteBook);

// liste des 3 livres les mieux notes
router.get('/bestrating', bookCtrl.bestRatingBooks);

// recherche d un livre avec son id en parametre
router.get('/:id', bookCtrl.findOneBook);

// liste de tous les livres
router.get('/', bookCtrl.findAllBooks);

module.exports = router;
