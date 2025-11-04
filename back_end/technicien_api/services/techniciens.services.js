const db = require('../db');
const bcrypt = require('bcrypt');

class TechnicienService {
  
  static async createRecord(record) {
    // const hashedPassword = await bcrypt.hash(record.mot_de_passe, 10);
    const query = `
      INSERT INTO technicien 
      (nom, prenom, dateNaissance, adresse, telephone, email, pwd, specialite, certifications, experience, zoneIntervention, dateEmbauche, typeContrat, salaire, statut)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.execute(query, [
      record.nom,
      record.prenom,
      record.dateNaissance,
      record.adresse,
      record.telephone,
      record.email,
      record.pwd,
      record.specialite,
      record.certifications,
      record.experience,
      record.zoneIntervention,
      record.dateEmbauche,
      record.typeContrat,
      record.salaire,
      record.statut,
    ]);

    return { id: result.insertId, ...record };
  }

  static async updateRecordById(record, id) {
    const query = `
      UPDATE technicien 
      SET nom = ?, prenom = ?, dateNaissance = ?, adresse = ?, telephone = ?, email = ?, 
          pwd = ?, specialite = ?, certifications = ?, experience = ?, zoneIntervention = ?, 
          dateEmbauche = ?, typeContrat = ?, salaire = ?, statut = ?
      WHERE id = ?
    `;

    await db.execute(query, [
      record.nom,
      record.prenom,
      record.dateNaissance,
      record.adresse,
      record.telephone,
      record.email,
      record.pwd,
      record.specialite,
      record.certifications,
      record.experience,
      record.zoneIntervention,
      record.dateEmbauche,
      record.typeContrat,
      record.salaire,
      record.statut,
      id,
    ]);

    return { message: `Technicien (${id}) mis à jour avec succès.` };
  }

  static async deleteRecordById(id) {
    const query = `DELETE FROM technicien WHERE id = ?;`;
    await db.execute(query, [id]);
    return { message: `L'identifiant (${id}) est supprimé avec succès.` };
  }

  static async getAllRecords() {
    const query = `SELECT * FROM technicien;`;
    const [rows] = await db.execute(query);
    return rows;
  }

  static async getRecordById(id) {
    const query = `SELECT * FROM technicien WHERE id = ?;`;
    const [rows] = await db.execute(query, [id]);
    return rows[0] || null;
  }
}

module.exports = TechnicienService;
