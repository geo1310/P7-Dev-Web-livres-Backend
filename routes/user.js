/**
 * Router pour les Endpoints utilisateurs
 */

const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const passwordValidation = require('../middleware/passwordValidation');
const emailValidation = require('../middleware/emailValidation');

// Inscription d'un utilisateur
router.post('/signup', emailValidation, passwordValidation, userCtrl.signup);

// Connexion d'un utilisateur
router.post('/login', emailValidation, userCtrl.login);

module.exports = router;
