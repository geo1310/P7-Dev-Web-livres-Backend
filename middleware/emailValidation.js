const validator = require('email-validator');

/**
 * Validation de l'email envoyer par le client
 * vérification standard : partie locale + @ + domaine
 * longueur max : 254 caracteres
 * verifie la validité du domaine, un point dans le domaine et pas de point à la fin
 * certains caracteres speciaux
 * @param {object} req requete
 * @param {object} res reponse
 * @param {Function} next middleware suivant si email valide
 * @returns {} 401 - Email invalide
 */
module.exports = (req, res, next) => {
    if (!validator.validate(req.body.email)) {
        console.log('Email Invalide');
        return res.status(401).json({ error: 'Email Invalide' });
    } else {
        next();
    }
};
