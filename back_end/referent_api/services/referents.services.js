const db = require('../db');

class ReferentService {

  static async createRecord(record) {

    const query = `
      INSERT INTO referent 
      (nom, prenom, telephone, email, dateNaissance, poste, adresse)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.execute(query, [
      record.nom,
      record.prenom,
      record.telephone,
      record.email,
      record.dateNaissance,
      record.poste,
      record.adresse,
    ]);
    return { id: result.insertId, ...record };
  }

  static async updateRecordById(record, id) {
    const query = `
      UPDATE referent 
      SET nom = ?, prenom = ?, telephone = ?, email = ?, dateNaissance = ?, adresse = ?, poste = ?
      WHERE id = ?
    `;
    await db.execute(query, [
      record.nom,
      record.prenom,
      record.telephone,
      record.email,
      record.dateNaissance,
      record.adresse,
      record.poste,
      id,
    ]);
    return { message: `Référent (${id}) mis à jour avec succès.` };
  }

  static async deleteRecordById(id) {
    const query = `DELETE FROM referent WHERE id = ?`;
    await db.execute(query, [id]);
    return { message: `L'identifiant (${id}) est supprimé avec succès.` };
  }

  static async getAllRecords() {
    // 1️⃣ Récupérer référents et fichiers avec LEFT JOIN
    const query = `
    SELECT r.id AS referentId, r.nom, r.prenom, r.email, r.telephone,
           f.id AS fichierId, f.nom AS fichierNom, f.chemin AS fichierChemin
    FROM referent r
    LEFT JOIN fichier f ON f.idReferent = r.id
    ORDER BY r.id, f.id
  `;
    const [rows] = await db.execute(query);

    // 2️⃣ Organiser les fichiers par référent
    const referentsMap = new Map();
    rows.forEach(row => {
      if (!referentsMap.has(row.referentId)) {
        referentsMap.set(row.referentId, {
          id: row.referentId,
          nom: row.nom,
          prenom: row.prenom,
          email: row.email,
          telephone: row.telephone,
          fichiers: []
        });
      }

      if (row.fichierId) {
        referentsMap.get(row.referentId).fichiers.push({
          id: row.fichierId,       // ✅ Ajouter l’ID du fichier
          nom: row.fichierNom,
          chemin: row.fichierChemin
        });
      }
    });

    // 3️⃣ Retourner le résultat sous forme de tableau
    return Array.from(referentsMap.values());
  }


  static async getRecordById(id) {
    const query = `SELECT * FROM referent WHERE id = ?`;
    const [rows] = await db.execute(query, [id]);
    return rows[0] || null;
  }

}

module.exports = ReferentService;
