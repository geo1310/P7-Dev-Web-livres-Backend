const passwordValidator = require('password-validator');

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
