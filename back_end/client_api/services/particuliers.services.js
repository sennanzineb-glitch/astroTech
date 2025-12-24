const db = require("../db"); // pool mysql2/promise

class ParticulierService {

  // Créer un particulier
  static async apiCreate(data) {
    const query = `
      INSERT INTO particulier 
        (nom_complet, email, telephone, adresse_id, client_id) 
      VALUES (?, ?, ?, ?, ?)
    `;
    const values = [
      data.nom_complet,
      data.email ?? null,
      data.telephone ?? null,
      data.adresse_id ?? null,
      data.client_id
    ];
    const [result] = await db.execute(query, values);
    return { id: result.insertId, ...data };
  }

  // Mettre à jour un particulier par ID
  static async apiUpdateById(data) {
    const query = `
      UPDATE particulier 
      SET nom_complet = ?, email = ?, telephone = ?, adresse_id = ?, client_id = ? 
      WHERE id = ?
    `;
    const values = [
      data.nom_complet,
      data.email ?? null,
      data.telephone ?? null,
      data.adresse_id ?? null,
      data.client_id,
      data.id
    ];
    await db.execute(query, values);
    return { ...data };
  }

  // Supprimer un particulier
  static async apiDeleteById(particulierId) {
    const query = `DELETE FROM particulier WHERE id = ?`;
    await db.execute(query, [particulierId]);
    return { message: `Le particulier (${particulierId}) a été supprimé avec succès.` };
  }

  // Récupérer tous les particuliers
  static async apiGetAll() {
    const query = `SELECT * FROM particulier`;
    const [rows] = await db.execute(query);
    return rows;
  }

  // Récupérer un particulier par ID
  static async apiGetById(particulierId) {
    const query = `SELECT * FROM particulier WHERE id = ?`;
    const [rows] = await db.execute(query, [particulierId]);
    return rows[0] || null;
  }

  //
  static async updateRecordNote(id, note) {
    try {
      const [result] = await db.execute(
        `UPDATE particulier SET note = ?, date_modification = NOW() WHERE id = ?`,
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

module.exports = ParticulierService;
