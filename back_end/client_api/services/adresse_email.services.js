const db = require("../db");

class AdresseEmailService {

  static async createRecord(record) {
    // قص القيمة لتجنب Data truncated
    const typeValue = record.type ? record.type.substring(0, 20) : null; // إذا العمود VARCHAR(20)

    const query = `INSERT INTO adresse_email (email, type, idContact) VALUES (?, ?, ?)`;
    const [result] = await db.execute(query, [record.email, typeValue, record.idContact]);
    return { id: result.insertId, ...record };
  }

  static async updateRecordById(record) {
    const typeValue = record.type ? record.type.substring(0, 20) : null;

    const query = `UPDATE adresse_email SET email = ?, type = ?, idContact = ? WHERE id = ?`;
    await db.execute(query, [record.email, typeValue, record.idContact, record.id]);
  }

  static async deleteRecordById(id) {
    const query = `DELETE FROM adresse_email WHERE id = ?`;
    await db.execute(query, [id]);
    return { message: `L'identifiant (${id}) est supprimé avec succès.` };
  }

  static async getAllRecords() {
    const query = `SELECT * FROM adresse_email`;
    const [rows] = await db.execute(query);
    return rows;
  }

  static async getRecordById(id) {
    const query = `SELECT * FROM adresse_email WHERE id = ?`;
    const [rows] = await db.execute(query, [id]);
    return rows[0];
  }

  static async getByEmailAndContact(idContact, email) {
    const [rows] = await db.execute(
      `SELECT * FROM adresse_email WHERE idContact = ? AND email = ? LIMIT 1`,
      [idContact, email]
    );
    return rows.length > 0 ? rows[0] : null;
  }

}

module.exports = AdresseEmailService;