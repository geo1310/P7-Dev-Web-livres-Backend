const multer = require('multer');
const sharp = require('sharp');
const path = require('path');

const storage = multer.memoryStorage();

const uploadImage = multer({
  storage: storage,
  fileFilter: (req, file, callback) => {
    if (file.mimetype.startsWith('image/')) {
      callback(null, true);
    } else {
      callback(new Error('Le fichier téléchargé n\'est pas une image valide.'));
    }
  },
});

const compressAndSaveImage = async (req, res, next) => {

  try {
    uploadImage.single('image')(req, res, async (error) => {
      if (error) {
        console.log('Erreur de téléchargement du fichier :', error.message);
        return res.status(400).json({error: error.message});
      }
      if (!req.file){
        console.log('Aucun fichier téléchargé.');
        return next()
      }

      console.log('Le fichier a été téléchargé en mémoire');

      const { buffer, originalname } = req.file;
      const { name } = path.parse(originalname); // Obtenir le nom de fichier sans l'extension
      const ref = `${name}_${Date.now()}.webp`;

      // compression et redimensionnement de l'image
      try {
        await sharp(buffer)
          .webp({ quality: 40 })
          .resize(500)
          .toFile("./images/" + ref);

        console.log('L\'image a été compressée et enregistrée avec succès.');
        req.file.filename = ref; // Mise à jour du nom de fichier dans req.file
        next();
      } catch (error) {
        console.log('Erreur lors de la compression et de l\'enregistrement de l\'image:', error);
        res.status(500).json({error: error.message});
      }
    });
  } catch (error) {
    console.log('Erreur lors du middleware multer:', error);
    return res.status(500).json({error: error.message});
    
  }
};

module.exports = compressAndSaveImage;


