const Book = require('../models/book');
const fs = require('fs');

/**
 * Création d'un Livre --------------------------------------------------
 * @param {object} req requete
 * @param {object} res reponse
 */
exports.createBook = (req, res) => {
    const bookObject = JSON.parse(req.body.book);

    // controle de la note si pas entre 1 et 5 envoie une liste vide
    if (bookObject.ratings[0].grade < 1 || bookObject.ratings[0].grade > 5) {
        bookObject.ratings = [];
    }
    const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${
            req.file.filename
        }`,
    });

    book.save()
        .then(() => {
            res.status(201).json({ message: 'Objet enregistré !' });
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

/**
 * Modification d'un livre --------------------------------------------------
 * @param {object} req requete
 * @param {object} res reponse
 */
exports.modifyBook = (req, res) => {
    const bookObject = req.file
        ? {
              ...JSON.parse(req.body.book),
              imageUrl: `${req.protocol}://${req.get('host')}/images/${
                  req.file.filename
              }`,
          }
        : { ...req.body };
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            // verification de l'authentification
            if (book.userId != req.auth.userId) {
                res.status(403).json({ message: 'Not authorized' });
            } else {
                // verification de la presence d'un fichier dans la requete
                if (req.file) {
                    const filename = book.imageUrl.split('/images/')[1];
                    fs.unlink(`images/${filename}`, () => {
                        updateBook(res, bookObject, req.params.id);
                    });
                } else {
                    updateBook(res, bookObject, req.params.id);
                }
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

/**
 * Mise à jour du livre dans la base de donnees
 * @param {object} res reponse
 * @param {object} bookObject livre
 * @param {string} bookId Id du livre
 */
function updateBook(res, bookObject, bookId) {
    Book.updateOne({ _id: bookId }, { ...bookObject, _id: bookId })
        .then(() => res.status(200).json({ message: 'Objet modifié!' }))
        .catch((error) => res.status(500).json({ error }));
}

/**
 * Suppression d'un livre --------------------------------------------------
 * @param {object} req requete
 * @param {object} res reponse
 */
exports.deleteBook = (req, res) => {
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({ message: 'Not authorized' });
            } else {
                const filename = book.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Book.deleteOne({ _id: req.params.id })
                        .then(() => {
                            res.status(200).json({
                                message: 'Objet supprimé !',
                            });
                        })
                        .catch((error) => res.status(401).json({ error }));
                });
            }
        })
        .catch((error) => {
            res.status(500).json({ error });
        });
};

/**
 * Renvoie la liste de tous les livres --------------------------------------------------
 * @param {object} req requete
 * @param {object} res reponse
 */
exports.findAllBooks = (req, res) => {
    Book.find() // renvoie un tableau contenant toutes la collection
        .then((books) => res.status(200).json(books))
        .catch((error) => res.status(400).json({ error }));
};

/**
 * Trouve un livre avec son id en parametre --------------------------------------------------
 * @param {object} req requete
 * @param {object} res reponse
 * @param {Function} next
 */
exports.findOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            res.status(200).json(book);
            next();
        })
        .catch((error) => res.status(404).json({ error }));
};

/**
 * Renvoie les 3 livres les mieux notes --------------------------------------------------
 * @param {object} res reponse
 */
exports.bestRatingBooks = (req, res) => {
    Book.find()
        .sort({ averageRating: -1 }) // Trie les livres par note décroissante
        .limit(3) // Limite les résultats aux 3 premiers livres
        .then((books) => {
            res.status(200).json(books);
        })
        .catch((error) => res.status(500).json({ error }));
};

/**
 * Notation d'un livre --------------------------------------------------
 * @param {object} req requete
 * @param {object} res reponse
 */
exports.ratingBook = (req, res) => {
    const bookId = req.params.id;
    const userId = req.auth.userId;
    let rating = req.body.rating;

    // verification de la plage de notation entre 0 et 5
    if (rating > 5) {
        rating = 5;
    }

    Book.findOneAndUpdate(
        { _id: bookId, 'ratings.userId': { $ne: userId } }, // Vérifie si userId n'est pas déjà présent dans ratings
        { $addToSet: { ratings: { userId: userId, grade: rating } } }, // Ajoute la notation si elle n'existe pas deja
        { new: true }
    )
        .then((book) => {
            if (!book) {
                return res.status(404).json({
                    error: "Le livre n'a pas été trouvé ou l'utilisateur a déjà noté le livre.",
                });
            }
            const averageBook = calculateAverageRating(book.ratings);
            book.averageRating = averageBook;
            book.save()
                .then((updatedBook) => {
                    res.status(200).json(updatedBook);
                })
                .catch((error) => res.status(500).json({ error }));
        })
        .catch((error) => res.status(500).json({ error }));
};

/**
 * Calcul la note moyenne d'un livre
 * @param {Array} ratings
 * @returns {number} average ou 0 si average vide
 */
const calculateAverageRating = (ratings) => {
    if (ratings.length === 0) {
        return 0; // Retourne 0 si le tableau est vide pour éviter une division par zéro
    }

    const sum = ratings.reduce((total, rating) => total + rating.grade, 0); // somme de toutes les notes du livre
    const average = sum / ratings.length;

    return Math.round(average);
};
