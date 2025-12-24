const db = require("../db");

class SecteurService {

  static async createRecord(record) {
    const query = `
            INSERT INTO secteur 
            (reference, nom, description, adresse_id, agence_id, organisation_id, parent_id)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
    const [result] = await db.execute(query, [
      record.reference, record.nom, record.description,
      record.adresse_id, record.agence_id, record.organisation_id, record.parent_id
    ]);
    return { id: result.insertId, ...record };
  }

  static async updateRecordById(record) {
    const query = `
            UPDATE secteur SET 
                reference = ?, 
                nom = ?, 
                description = ?, 
                adresse_id = ?, 
                agence_id = ?, 
                organisation_id = ?, 
                parent_id = ? 
            WHERE id = ?
        `;
    await db.execute(query, [
      record.reference, record.nom, record.description,
      record.adresse_id, record.agence_id, record.organisation_id, record.parent_id,
      record.id
    ]);
    return { message: `Secteur ID ${record.id} mis à jour avec succès.` };
  }

  static async deleteRecordById(id) {
    const query = `DELETE FROM secteur WHERE id = ?`;
    await db.execute(query, [id]);
    return { message: `Secteur ID ${id} supprimé avec succès.` };
  }

  static async getAllRecords() {
    const query = `SELECT * FROM secteur`;
    const [rows] = await db.execute(query);
    return rows;
  }

  static async getRecordById(id) {
    const query = `SELECT * FROM secteur WHERE id = ?`;
    const [rows] = await db.execute(query, [id]);
    return rows[0];
  }

  // Détails d’un client secteur avec contacts et type_client
  static async getRecordDetails(id) {
    const [rows] = await db.query(
      `SELECT
      s.id AS secteur_id,
      s.nom AS nom_client,
      s.reference,
      s.description,
      s.note,
      ad.id AS adresseId, ad.adresse AS adresseLigne, ad.code_postal, ad.ville, ad.province, ad.pays,
      ad.etage, ad.appartement_local, ad.batiment, ad.interphone_digicode,
      ad.escalier, ad.porte_entree,
      ct.id AS contact_id, ct.nom_complet AS contact_nom_complet, ct.poste, ct.date_du, ct.date_au, ct.memo_note,
      e.id AS emailId, e.email, e.type AS emailType,
      t.id AS telId, t.tel, t.type AS telType
    FROM secteur s
    LEFT JOIN adresse ad ON ad.id = s.adresse_id
    LEFT JOIN contact ct ON ct.secteur_id = s.id
    LEFT JOIN adresse_email e ON e.contact_id = ct.id
    LEFT JOIN num_tel t ON t.contact_id = ct.id
    WHERE s.id = ?
    ORDER BY s.id, ct.id;`,
      [id]
    );

    if (!rows.length) return null;

    const secteurRow = rows[0];

    const client = {
      id: secteurRow.secteur_id,
      nom_client: secteurRow.nom_client,
      reference: secteurRow.reference,
      description: secteurRow.description,
      note: secteurRow.note,
      type_client: 'secteur',
      adresse: secteurRow.adresseId ? {
        id: secteurRow.adresseId,
        adresse: secteurRow.adresseLigne,
        code_postal: secteurRow.code_postal,
        ville: secteurRow.ville,
        province: secteurRow.province,
        pays: secteurRow.pays,
        etage: secteurRow.etage,
        appartement_local: secteurRow.appartement_local,
        batiment: secteurRow.batiment,
        interphone_digicode: secteurRow.interphone_digicode,
        escalier: secteurRow.escalier,
        porte_entree: secteurRow.porte_entree
      } : null,
      contacts: []
    };

    for (const row of rows) {
      if (row.contact_id) {
        let contact = client.contacts.find(ct => ct.id === row.contact_id);
        if (!contact) {
          contact = {
            id: row.contact_id,
            nom_complet: row.contact_nom_complet,
            poste: row.poste,
            date_du: row.date_du,
            date_au: row.date_au,
            memo_note: row.memo_note,
            emails: [],
            telephones: []
          };
          client.contacts.push(contact);
        }

        if (row.emailId && !contact.emails.some(e => e.id === row.emailId)) {
          contact.emails.push({ id: row.emailId, email: row.email, type: row.emailType });
        }

        if (row.telId && !contact.telephones.some(t => t.id === row.telId)) {
          contact.telephones.push({ id: row.telId, tel: row.tel, type: row.telType });
        }
      }
    }

    return client;
  }

  //
  static async updateRecordNote(id, note) {
    try {
      const [result] = await db.execute(
        `UPDATE secteur SET note = ?, date_modification = NOW() WHERE id = ?`,
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

module.exports = SecteurService;