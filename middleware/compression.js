const sharp = require('sharp');
const fs = require('fs').promises;

const imageCompression = async (req, res, next) => {
    if (req.file) {
        const imagePath = req.file.path;
        console.log(imagePath);
        try {
            const compressedData = await sharp(imagePath)
                //.webp({ quality: 50 }) // Définir la qualité de compression (entre 0 et 100)
                .resize(500)
                .toBuffer();

            await fs.writeFile(imagePath, compressedData);
            console.log(
                "Image compressée avec succès et le fichier d'origine a été remplacé!"
            );
        } catch (error) {
            console.error(
                "Erreur lors de la compression de l'image ou de la mise à jour du fichier d'origine:",
                error
            );
        }
    }

    next();
};

module.exports = imageCompression;
