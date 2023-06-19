const jwt = require('jsonwebtoken');

/**
 * Vérifie si le client connecté à une autorisation valide (token)
 * pour accéder aux routes protegees
 * si le token est valide on ajoute auth = {userId: userId} à la requete
 * @param {object} req requete
 * @param {object} res reponse
 * @param {Function} next middleware suivant si autorisation valide
 */
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // on enleve Bearer de l'autorisation
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId,
        };
        next();
    } catch (error) {
        res.status(401).json({ error });
    }
};
