const db = require("../db");

class OrganisationService {
  static async createRecord(record) {
    const query = `INSERT INTO organisation (client_id, nom_entreprise) VALUES (?, ?)`;
    const [result] = await db.execute(query, [record.client_id, record.nom_entreprise]);
    return { id: result.insertId, ...record };
  }

  static async updateRecordById(record) {
    const query = `UPDATE organisation SET client_id = ?, nom_entreprise = ? WHERE id = ?`;
    await db.execute(query, [record.client_id, record.nom_entreprise, record.id]);
  }

  static async deleteRecordById(id) {
    const query = `DELETE FROM organisation WHERE id = ?`;
    await db.execute(query, [id]);
    return { message: `L'identifiant (${id}) est supprimé avec succès.` };
  }

  static async getAllRecords() {
    const query = `SELECT * FROM organisation`;
    const [rows] = await db.execute(query);
    return rows;
  }

  static async getRecordById(id) {
    const query = `SELECT * FROM organisation WHERE id = ?`;
    const [rows] = await db.execute(query, [id]);
    return rows[0];
  }

  static async updateRecordNote(id, note) {
    try {
      const [result] = await db.execute(
        `UPDATE organisation SET note = ?, date_modification = NOW() WHERE id = ?`,
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

module.exports = OrganisationService;