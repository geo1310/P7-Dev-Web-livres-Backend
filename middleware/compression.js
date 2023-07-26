const sharp = require('sharp');
const fs = require('fs');

const imageCompression = (req, res, next) => {
    if (req.file) {
        const compressedFileName = `compressed_${req.file.filename}`;
        const compressedFilePath = `images/${compressedFileName}`;

        sharp(req.file.path)
            .webp({ quality: 40 })
            .resize(800)
            .toFile(compressedFilePath, (error, info) => {
                if (error) {
                    console.error(
                        "Erreur lors de la compression de l'image:",
                        error
                    );
                    next(error); // Passez l'erreur au middleware suivant s'il y a une erreur
                } else {
                    console.log('Image compressée avec succès!');
                    fs.unlink(req.file.path, (error) => {
                        if (error) {
                            console.error(
                                'Erreur lors de la suppression du fichier:',
                                error
                            );
                            next(error); // Passez l'erreur au middleware suivant s'il y a une erreur
                        } else {
                            // Remplacez le fichier d'origine par le fichier compressé en renommant le fichier
                            fs.rename(
                                compressedFilePath,
                                req.file.path,
                                (error) => {
                                    if (error) {
                                        console.error(
                                            'Erreur lors du remplacement du fichier:',
                                            error
                                        );
                                        next(error); // Passez l'erreur au middleware suivant s'il y a une erreur
                                    } else {
                                        next(); // Passez à la prochaine fonction middleware
                                    }
                                }
                            );
                        }
                    });
                }
            });
    } else {
        next();
    }
};

module.exports = imageCompression;
