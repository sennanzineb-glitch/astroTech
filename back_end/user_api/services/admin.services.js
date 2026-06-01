const db = require('../db');

class AdminService {

  // services/chat.service.js
  static async getAllAdmins() {
    try {
      const query = `SELECT id, full_name, email FROM users WHERE role = 'admin'`;
      const [rows] = await db.execute(query);
      return rows;
    } catch (error) {
      console.error('Erreur SQL getAllAdmins:', error);
      throw error;
    }
  }


}

module.exports = AdminService;
