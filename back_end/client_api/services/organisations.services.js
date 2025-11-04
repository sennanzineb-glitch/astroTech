const db = require("../db");

class OrganisationService {
  static async createRecord(record) {
    const query = `INSERT INTO organisation (idClient, nomEntreprise) VALUES (?, ?)`;
    const [result] = await db.execute(query, [record.idClient, record.nomEntreprise]);
    return { id: result.insertId, ...record };
  }

  static async updateRecordById(record) {
    const query = `UPDATE organisation SET idClient = ?, nomEntreprise = ? WHERE id = ?`;
    await db.execute(query, [record.idClient, record.nomEntreprise, record.id]);
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
}

module.exports = OrganisationService;