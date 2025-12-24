const FichierService = require("../services/fichiers.services");
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const UPLOAD_DIR = path.join(__dirname, '../uploads');

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage }).array('files', 10);

class FichierController {

  static async apiGetAll(req, res) {
    try {
      const response = await FichierService.getAllRecords();
      res.json(response);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  // GET /api/fichiers/referent/:id
  static async getRecordsByReferent(req, res) {
    const referentId = parseInt(req.params.id, 10);

    if (isNaN(referentId)) {
      return res.status(400).json({ message: 'ID de référent invalide' });
    }

    try {
      const fichiers = await FichierService.getRecordsByReferent(referentId);
      return res.status(200).json(fichiers);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Erreur lors de la récupération des fichiers' });
    }
  }

  static async apiDeleteById(req, res) {
    try {
      const { id } = req.params;
      await FichierService.deleteFileById(id);
      res.status(204).send();
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: error.message });
    }
  }

  static async apiUploadFiles(req, res) {
    upload(req, res, async (err) => {
      if (err)
        return res.status(500).json({ message: 'Upload failed', error: err.message });

      try {
        const { idReferent, idAffaire } = req.body;

        // Vérification qu’au moins un id est fourni
        if (!idReferent && !idAffaire) {
          return res.status(400).json({ message: "⚠️ Vous devez fournir idReferent ou idAffaire" });
        }

        // Transmettre les fichiers et l’id correct au service
        const files = await FichierService.uploadFiles(req.files, idReferent || null, idAffaire || null);

        res.status(201).json({ message: 'Fichiers enregistrés avec succès', files });

      } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
      }
    });

  }

}

module.exports = FichierController;