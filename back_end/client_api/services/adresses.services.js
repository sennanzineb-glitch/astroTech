const db = require("../db"); // Assure-toi que db exporte un pool mysql2/promise

class AdresseService {

  // Créer une nouvelle adresse
  static async createRecord(record) {
    const query = `
      INSERT INTO adresse
      (adresse, codePostal, ville, province, pays, etage, appartementLocal, batiment, interphoneDigicode, escalier, porteEntree)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      record.adresse,
      record.codePostal,
      record.ville,
      record.province,
      record.pays,
      record.etage,
      record.appartementLocal,
      record.batiment,
      record.interphoneDigicode,
      record.escalier,
      record.porteEntree
    ].map(v => v ?? null); // Remplace undefined par null

    const [result] = await db.execute(query, values);
    return { id: result.insertId, ...record };
  }

  // Mettre à jour une adresse existante par ID
  static async updateRecordById(record) {
    const query = `
      UPDATE adresse
      SET adresse = ?, codePostal = ?, ville = ?, province = ?, pays = ?, etage = ?, appartementLocal = ?, batiment = ?, interphoneDigicode = ?, escalier = ?, porteEntree = ?
      WHERE id = ?
    `;

    const values = [
      record.adresse,
      record.codePostal,
      record.ville,
      record.province,
      record.pays,
      record.etage,
      record.appartementLocal,
      record.batiment,
      record.interphoneDigicode,
      record.escalier,
      record.porteEntree,
      record.id
    ].map(v => v ?? null);

    await db.execute(query, values);
    return { ...record };
  }

  // Supprimer une adresse par ID
  static async deleteRecordById(id) {
    const query = `DELETE FROM adresse WHERE id = ?`;
    await db.execute(query, [id]);
    return { message: `Adresse ${id} supprimée.` };
  }

  // Récupérer toutes les adresses
  static async getAllRecords() {
    const query = `SELECT * FROM adresse`;
    const [rows] = await db.execute(query);
    return rows;
  }

  // Récupérer une adresse par ID
  static async getRecordById(id) {
    const query = `SELECT * FROM adresse WHERE id = ?`;
    const [rows] = await db.execute(query, [id]);
    return rows[0] || null;
  }

}

module.exports = AdresseService;
