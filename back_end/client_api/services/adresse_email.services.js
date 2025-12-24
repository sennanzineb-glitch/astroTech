const db = require("../db");

class AdresseEmailService {

  // 🔹 Create
  static async createRecord(record) {
    const typeValue = record.type ? record.type.substring(0, 50) : null;

    const query = `
      INSERT INTO adresse_email (email, type, contact_id)
      VALUES (?, ?, ?)
    `;

    const [result] = await db.execute(query, [
      record.email,
      typeValue,
      record.contact_id
    ]);

    return { id: result.insertId, ...record };
  }

  // 🔹 Update
  static async updateRecordById(record) {
    const typeValue = record.type ? record.type.substring(0, 50) : null;

    const query = `
      UPDATE adresse_email
      SET email = ?, type = ?, contact_id = ? 
      WHERE id = ?
    `;

    await db.execute(query, [
      record.email,
      typeValue,
      record.contact_id,
      record.id
    ]);
  }

  // 🔹 Delete
  static async deleteRecordById(id) {
    const query = `DELETE FROM adresse_email WHERE id = ?`;
    await db.execute(query, [id]);
    return { message: `L'identifiant (${id}) est supprimé avec succès.` };
  }

  // 🔹 Get All
  static async getAllRecords() {
    const query = `SELECT * FROM adresse_email`;
    const [rows] = await db.execute(query);
    return rows;
  }

  // 🔹 Get by ID
  static async getRecordById(id) {
    const query = `SELECT * FROM adresse_email WHERE id = ?`;
    const [rows] = await db.execute(query, [id]);
    return rows[0];
  }

  // 🔹 Get by email && contact
  static async getByEmailAndContact(contact_id, email) {
    const query = `
      SELECT * FROM adresse_email
      WHERE contact_id = ? AND email = ?
      LIMIT 1
    `;

    const [rows] = await db.execute(query, [contact_id, email]);

    return rows.length > 0 ? rows[0] : null;
  }

}

module.exports = AdresseEmailService;
