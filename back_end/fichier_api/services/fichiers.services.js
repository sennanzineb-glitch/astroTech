const fs = require('fs');
const path = require('path');
const db = require("../db");

const UPLOAD_DIR = path.join(__dirname, '../uploads');

// 🔹 إنشاء المجلد إذا لم يكن موجود
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  console.log(`📁 Dossier créé : ${UPLOAD_DIR}`);
}

class FichierService {

  // 🔹 Récupérer tous les fichiers
  static async getAllRecords() {
    try {
      const [rows] = await db.query('SELECT * FROM fichier');
      return rows;
    } catch (err) {
      console.error('Erreur lors de la récupération des fichiers :', err);
      throw err;
    }
  }

  static async getRecordsByReferent(referentId) {
    const [rows] = await db.query('SELECT * FROM fichier WHERE idReferent = ?', [referentId]);
    return rows;
  }

  // 🔹 Supprimer un fichier
  static async deleteFileById(id) {
    const [rows] = await db.execute('SELECT chemin FROM fichier WHERE id = ?', [id]);
    if (!rows.length) throw new Error(`File with id ${id} not found`);

    const filename = rows[0].chemin;
    const filePath = path.join(UPLOAD_DIR, filename);

    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await db.execute('DELETE FROM fichier WHERE id = ?', [id]);
  }

  // 🔹 Upload plusieurs fichiers avec idReferent
  static async uploadFiles(files, idReferent = null, idAffaire = null) {
    if (!files || files.length === 0) {
      throw new Error('Aucun fichier reçu');
    }

    const sql = `
    INSERT INTO fichier (nom, chemin, taille, type, date_upload, idReferent, idAffaire)
    VALUES (?, ?, ?, ?, NOW(), ?, ?)
  `;

    const results = await Promise.all(
      files.map(async (file) => {
        const safeReferentId = idReferent ?? null;
        const safeAffaireId = idAffaire ?? null;

        const [result] = await db.execute(sql, [
          file.originalname,
          file.filename,
          file.size,
          file.mimetype,
          safeReferentId,
          safeAffaireId
        ]);

        return {
          id: result.insertId,   // ✅ ID du fichier inséré
          originalname: file.originalname,
          filename: file.filename,
          size: file.size,
          mimetype: file.mimetype,
          idReferent: safeReferentId,
          idAffaire: safeAffaireId
        };
      })
    );

    return results;
  }

}

module.exports = FichierService;
