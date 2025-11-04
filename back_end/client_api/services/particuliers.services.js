const db = require("../db");

class ParticulierService {

  static async createRecord(record) {
    const query = `INSERT INTO particulier (nomComplet, email, telephone, idAdresse, idClient) VALUES (?, ?, ?, ?, ?)`;
    const [result] = await db.execute(query, [record.nomComplet, record.email, record.telephone, record.idAdresse, record.idClient]);
    return { id: result.insertId, ...record };
  }

  static async updateRecordById(record) {
    const query = `UPDATE particulier SET nomComplet = ?, email = ?, telephone = ?, idAdresse = ?, idClient = ? WHERE id = ?`;
    await db.execute(query, [record.nomComplet, record.email, record.telephone, record.idAdresse, record.idClient, record.id]);
  }

  static async deleteRecordById(id) {
    const query = `DELETE FROM particulier WHERE id = ?`;
    await db.execute(query, [id]);
    return { message: `L'identifiant (${id}) est supprimé avec succès.` };
  }

  static async getAllRecords() {
    const query = `SELECT * FROM particulier`;
    const [rows] = await db.execute(query);
    return rows;
  }

  static async getRecordById(id) {
    const query = `SELECT * FROM particulier WHERE id = ?`;
    const [rows] = await db.execute(query, [id]);
    return rows[0];
  }

}

module.exports = ParticulierService;