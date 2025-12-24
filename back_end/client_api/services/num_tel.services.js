const db = require("../db"); // db يجب أن يكون pool من mysql2/promise

class NumTelService {
  static async createRecord(record) {
    const typeValue = record.type ? record.type.substring(0, 20) : null;
    const query = `INSERT INTO num_tel (tel, type, contact_id) VALUES (?, ?, ?)`;
    const [result] = await db.execute(query, [record.tel, typeValue, record.contact_id]);
    return { id: result.insertId, ...record };
  }

  static async updateRecordById(record) {
    const typeValue = record.type ? record.type.substring(0, 20) : null;
    const query = `UPDATE num_tel SET tel = ?, type = ?, contact_id = ? WHERE id = ?`;
    await db.execute(query, [record.tel, typeValue, record.contact_id, record.id]);
  }

  static async deleteRecordById(id) {
    const query = `DELETE FROM num_tel WHERE id = ?`;
    await db.execute(query, [id]);
    return { message: `L'identifiant (${id}) est supprimé avec succès.` };
  }

  static async getAllRecords() {
    const query = `SELECT * FROM num_tel`;
    const [rows] = await db.execute(query);
    return rows;
  }

  static async getRecordById(id) {
    const query = `SELECT * FROM num_tel WHERE id = ?`;
    const [rows] = await db.execute(query, [id]);
    return rows[0];
  }

  static async getByTelAndContact(contact_id, tel) {
    const [rows] = await db.execute(
      `SELECT * FROM num_tel WHERE contact_id = ? AND tel = ? LIMIT 1`,
      [contact_id, tel]
    );
    return rows.length > 0 ? rows[0] : null;
  }
}

module.exports = NumTelService;


module.exports = NumTelService;