const db = require("../db"); // Assurez-vous que c'est votre pool mysql2/promise

class ContactService {

  // Créer un contact
  static async createRecord(data) {
    const query = `
      INSERT INTO contact (client_id, nom_complet, poste, date_du, date_au, memo_note, secteur_id, habitation_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      data.client_id ?? null,
      data.nom_complet ?? null,
      data.poste ?? null,
      data.date_du ?? null,
      data.date_au ?? null,
      data.memo_note ?? null,
      data.secteur_id ?? null,
      data.habitation_id ?? null
    ];
    const [result] = await db.execute(query, params);
    return { id: result.insertId, ...data };
  }

  // Mettre à jour un contact par ID
  static async updateRecordById(data) {
    if (!data.id) throw new Error("L'id du contact est requis pour la mise à jour");

    const query = `
      UPDATE contact
      SET nom_complet = ?, poste = ?, date_du = ?, date_au = ?, memo_note = ?, client_id = ?
      WHERE id = ?
    `;
    const params = [
      data.nom_complet ?? null,
      data.poste ?? null,
      data.date_du ?? null,
      data.date_au ?? null,
      data.memo_note ?? null,
      data.client_id ?? null,
      data.id
    ];

    const [result] = await db.execute(query, params);
    return { affectedRows: result.affectedRows };
  }

  // Supprimer un contact par ID
  static async deleteRecordById(id) {
    const query = `DELETE FROM contact WHERE id = ?`;
    const [result] = await db.execute(query, [id]);
    return { affectedRows: result.affectedRows };
  }

  // Récupérer tous les contacts
  static async getAllRecords() {
    const query = `SELECT * FROM contact`;
    const [rows] = await db.execute(query);
    return rows;
  }

  // Récupérer un contact par ID
  static async getRecordById(id) {
    const query = `SELECT * FROM contact WHERE id = ?`;
    const [rows] = await db.execute(query, [id]);
    return rows[0] ?? null;
  }

  // Vérifier existence d'un contact par client_id, nom_complet et poste
  static async getByNameAndPoste(type, id, nom_complet, poste) {
    let column;

    switch (type) {
      case 'organisation':
      case 'agence':
      case 'particulier':
        column = 'client_id';
        break;

      case 'secteur':
        column = 'secteur_id';
        break;

      case 'habitation':
        column = 'habitation_id';
        break;

      default:
        throw new Error('Type non valide pour getByNameAndPoste');
    }

    const query = `
    SELECT *
    FROM contact
    WHERE ${column} = ?
      AND nom_complet = ?
      AND poste = ?
  `;

    const [rows] = await db.execute(query, [id, nom_complet, poste]);
    return rows[0] ?? null;
  }

}

module.exports = ContactService;
