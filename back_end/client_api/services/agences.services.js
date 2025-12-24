const db = require("../db");

class AgenceService {

  // 🔹 CREATE
  static async createRecord(record) {
    const query = `
      INSERT INTO agence (client_id, nom_agence, adresse_id)
      VALUES (?, ?, ?)
    `;

    const [result] = await db.execute(query, [
      record.client_id,
      record.nom_agence,
      record.adresse_id,
    ]);

    return { id: result.insertId, ...record };
  }

  // 🔹 UPDATE
  static async updateRecordById(record) {
    const query = `
      UPDATE agence 
      SET client_id = ?, nom_agence = ?, adresse_id = ?
      WHERE id = ?
    `;

    await db.execute(query, [
      record.client_id,
      record.nom_agence,
      record.adresse_id,
      record.id
    ]);

    return { ...record };
  }

  // 🔹 DELETE
  static async deleteRecordById(id) {
    const query = `DELETE FROM agence WHERE id = ?`;
    await db.execute(query, [id]);
    return { message: `Agence ${id} supprimée.` };
  }

  // 🔹 GET ALL
  static async getAllRecords() {
    const query = `SELECT * FROM agence`;
    const [rows] = await db.execute(query);
    return rows;
  }

  // 🔹 GET BY ID
  static async getRecordById(id) {
    const query = `SELECT * FROM agence WHERE id = ?`;
    const [rows] = await db.execute(query, [id]);
    return rows[0] || null;
  }

  static async updateRecordNote(id, note) {
    try {
      const [result] = await db.execute(
        `UPDATE agence SET note = ?, date_modification = NOW() WHERE id = ?`,
        [note, id]
      );

      return {
        success: true,
        affectedRows: result.affectedRows
      };
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la note:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

}

module.exports = AgenceService;
