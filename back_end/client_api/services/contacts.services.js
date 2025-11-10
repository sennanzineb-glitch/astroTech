const db = require("../db"); // تأكد إن _db.service ترجع اتصال mysql2/promise

class ContactService {
  static async createRecord(record) {
    const query = `INSERT INTO contact (nomComplet, poste, dateDu, dateAu, memoNote, idClient) VALUES (?, ?, ?, ?, ?, ?)`;
    const [result] = await db.execute(query, [record.nomComplet, record.poste, record.dateDu, record.dateAu, record.memoNote, record.idClient]);
    return { id: result.insertId, ...record };
  }

  static async updateRecordById(record) {
    const query = `UPDATE contact SET nomComplet = ?, poste = ?, dateDu = ?, dateAu = ?, memoNote = ?, idClient = ? WHERE id = ?`;
    await db.execute(query, [record.nomComplet, record.poste, record.dateDu, record.dateAu, record.memoNote, record.idClient, record.id]);
  }

  static async deleteRecordById(id) {
    const query = `DELETE FROM contact WHERE id = ?`;
    await db.execute(query, [id]);
    return { message: `L'identifiant (${id}) est supprimé avec succès.` };
  }

  static async getAllRecords() {
    const query = `SELECT * FROM contact`;
    const [rows] = await db.execute(query);
    return rows;
  }

  static async getRecordById(id) {
    const query = `SELECT * FROM contact WHERE id = ?`;
    const [rows] = await db.execute(query, [id]);
    return rows[0];
  }

  static async getByNameAndPoste(idClient, nomComplet, poste) {
    try {
      const [rows] = await db.execute(
        `SELECT * FROM contact WHERE idClient = ? AND nomComplet = ? AND poste = ? LIMIT 1`,
        [idClient, nomComplet, poste]
      );

      if (rows.length > 0) {
        return rows[0];
      }
      return null;
    } catch (err) {
      console.error("Erreur getByNameAndPoste:", err);
      throw err;
    }
  }


}

module.exports = ContactService;
