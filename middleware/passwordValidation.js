const passwordValidator = require('password-validator');

/**
 * Validation du mot de passe envoyé par le client
 * S'assure que le mot de passe respecte bien le schema demandé
 * longueur min de 8 caracteres
 * au moins 1 lettre majuscule et 1 lettre miniscule
 * au moins 1 chiffre
 * au moins un symbole
 * pas d'espaces
 * @param {object} req requete
 * @param {object} res reponse
 * @param {Function} next middleware suivant si password valide
 * @returns 401 - Mot de passe invalide
 */
module.exports = (req, res, next) => {
    const passwordSchema = new passwordValidator();

    passwordSchema
        .is()
        .min(8)
        .has()
        .uppercase()
        .has()
        .lowercase()
        .has()
        .digits(1)
        .has()
        .symbols(1)
        .has()
        .not()
        .spaces();

    if (!passwordSchema.validate(req.body.password)) {
        console.log('Mot de passe Invalide');
        return res.status(401).json({ error: 'Mot de passe Invalide' });
    } else {
        next();
    }
};
