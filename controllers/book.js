// le controleur stocke toute la logique metier

const Book = require('../models/book');
const fs = require('fs');

// création d'un livre
exports.createBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book);
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
            res.status(400).json({ error});
        });
};

// modifie un livre
exports.modifyBook = (req, res, next) => {
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
            if (book.userId != req.auth.userId) {
                res.status(403).json({ message: 'Not authorized' });
            } else {
                const filename = book.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Book.updateOne(
                        { _id: req.params.id },
                        { ...bookObject, _id: req.params.id }
                    )
                        .then(() =>
                            res.status(200).json({ message: 'Objet modifié!' })
                        )
                        .catch((error) => res.status(500).json({ error }));
                });
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

// efface un  livre
exports.deleteBook = (req, res, next) => {
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

// trouve tous les livres
exports.findAllBooks = (req, res, next) => {
    Book.find() // renvoie un tableau contenant toutes la collection
        .then((books) => res.status(200).json(books))
        .catch((error) => res.status(400).json({ error }));
};

// trouve un livre
exports.findOneBook = (req, res, next) => {
    
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            res.status(200).json(book);
            next()
        })
        .catch((error) => res.status(404).json({ error }));
};

// note un livre
exports.ratingBook = (req, res, next) => {
    const bookId = req.params.id;
    const userId = req.body.userId;
    const rating = req.body.rating;

    Book.findOneAndUpdate(
        { _id: bookId, 'ratings.userId': { $ne: userId } }, // Vérifie si userId n'est pas déjà présent dans ratings
        { $addToSet: { ratings: { userId: userId, grade: rating } } }, // Utilise $addToSet au lieu de $push
        { new: true }
    )
        .then((book) => {
            if (!book) {
                // Si le livre n'est pas trouvé ou si l'utilisateur a déjà noté le livre, retourner une erreur
                return res.status(404).json({ error: 'Le livre n\'a pas été trouvé ou l\'utilisateur a déjà noté le livre.' });
            }
            const averageBook = calculateAverageRating(book.ratings)
            book.averageRating = averageBook
            book.save() // Enregistre les modifications dans la base de données
                .then((updatedBook) => {
                    res.status(200).json(updatedBook);
                })
                .catch((error) => res.status(500).json({ error }));
            
        })
        .catch((error) => res.status(500).json({ error }));
};


// Renvoie les 3 livres les mieux notes
exports.bestRatingBooks = (req, res, next) => {
    Book.find()
        .sort({ 'averageRating': -1 }) // Trie les livres par note décroissante
        .limit(3) // Limite les résultats aux 3 premiers livres
        .then((books) => {
            res.status(200).json(books);
        })
        .catch((error) => res.status(500).json({ error }));
};

// calcul la moyenne des notes d'un livre
const calculateAverageRating = (ratings) => {
    if (ratings.length === 0) {
        return 0; // Retourne 0 si le tableau est vide pour éviter une division par zéro
    }

    const sum = ratings.reduce((total, rating) => total + rating.grade, 0);
    const average = sum / ratings.length;

    return Math.round(average);
};

