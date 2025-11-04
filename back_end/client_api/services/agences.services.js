const db = require("../db");

class AgenceService {
  static async createRecord(record) {
    const query = `INSERT INTO agence (idClient, nomAgence, idAdresse) VALUES (?, ?, ?)`;
    const [result] = await db.execute(query, [record.idClient, record.nomAgence, record.idAdresse]);
    return { id: result.insertId, ...record };
  }

  static async updateRecordById(record) {
    const query = `UPDATE agence SET idClient = ?, nomAgence = ?, idAdresse = ? WHERE id = ?`;
    await db.execute(query, [record.idClient, record.nomAgence, record.idAdresse, record.id]);
  }

  static async deleteRecordById(id) {
    const query = `DELETE FROM agence WHERE id = ?`;
    await db.execute(query, [id]);
    return { message: `L'identifiant (${id}) est supprimé avec succès.` };
  }

  static async getAllRecords() {
    const query = `SELECT * FROM agence`;
    const [rows] = await db.execute(query);
    return rows;
  }

  static async getRecordById(id) {
    const query = `SELECT * FROM agence WHERE id = ?`;
    const [rows] = await db.execute(query, [id]);
    return rows[0];
  }
}

module.exports = AgenceService;