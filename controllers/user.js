const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

/**
 * Inscription d'un utilisateur dans la base de donnees
 * hachage du mot de passe avant enregistrement dans la base de donnees
 * @param {object} req requete
 * @param {object} res reponse
 */
exports.signup = (req, res) => {
    // fonction de hachage du mot de passe
    bcrypt
        .hash(req.body.password, 10)
        .then((hash) => {
            const user = new User({
                email: req.body.email,
                password: hash,
            });
            user.save()
                .then(() =>
                    res.status(201).json({ message: 'Utilisateur créé !' })
                )
                .catch((error) =>
                    res
                        .status(401)
                        .json({ error: 'Utilisateur deja enregistré' })
                );
        })

        .catch((error) => res.status(500).json({ error }));
};

/**
 * Login d'un utilisateur
 * Verification de la presence de l'email dans la base de donnees
 * Verification du mot de passe utilisateur
 * @param {object} req requete
 * @param {object} res reponse
 */
exports.login = (req, res) => {
    User.findOne({ email: req.body.email })
        .then((user) => {
            if (!user) {
                return res
                    .status(401)
                    .json({ message: 'Paire login/mot de passe incorrecte' });
            }
            bcrypt
                .compare(req.body.password, user.password)
                .then((valid) => {
                    if (!valid) {
                        return res.status(401).json({
                            message: 'Paire login/mot de passe incorrecte',
                        });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            process.env.TOKEN_SECRET,
                            { expiresIn: '2h' }
                        ),
                    });
                })
                .catch((error) => res.status(500).json({ error }));
        })
        .catch((error) => res.status(500).json({ error }));
};
