// le router stocke toute les routes

const express = require('express');
const router = express.Router(); // création d'un routeur express
const bookCtrl = require('../controllers/book')
const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')

// routes

  router.post('/', auth, multer, bookCtrl.createBook) // pas de parenthese car on n'appelle pas la fonction on l'applique seulement à la route
  
  router.put('/:id', auth, multer, bookCtrl.modifyBook)

  router.delete('/:id', auth, bookCtrl.deleteBook)

  router.get('/', bookCtrl.findAllBooks)
  
  router.get('/:id', bookCtrl.findOneBook)

module.exports = router;