const db = require("../db"); // <-- IMPORT DU POOL MYSQL

class ClientService {

  // Récupérer tous les clients avec une seule colonne "nomClient"
  static async getAllRecords() {
    const query = `
      SELECT 
        c.id,
        c.numero,
        c.compte,
        COALESCE(p.nomComplet, a.nomAgence, o.nomEntreprise) AS nom
      FROM client c
      LEFT JOIN particulier p ON p.idClient = c.id
      LEFT JOIN agence a ON a.idClient = c.id
      LEFT JOIN organisation o ON o.idClient = c.id
      ORDER BY nom ASC
    `;

    try {
      const [rows] = await db.query(query);
      return rows;
    } catch (error) {
      console.error('Erreur ClientService.getAllClients:', error);
      throw error;
    }
  }

  // Récupérer tous les clients avec contacts, emails et téléphones
  static async getAllClientsWithContacts() {
    try {
      const query = `
      SELECT 
        c.id AS clientId, c.numero, c.compte,
        COALESCE(p.nomComplet, a.nomAgence, o.nomEntreprise) AS nomClient,
        ct.id AS contactId, ct.nomComplet AS contactNomComplet, ct.poste, ct.dateDu, ct.dateAu, ct.memoNote,
        e.id AS emailId, e.email, e.type AS emailType,
        t.id AS telId, t.tel, t.type AS telType
      FROM client c
      LEFT JOIN particulier p ON p.idClient = c.id
      LEFT JOIN agence a ON a.idClient = c.id
      LEFT JOIN organisation o ON o.idClient = c.id
      LEFT JOIN contact ct ON ct.idClient = c.id
      LEFT JOIN adresse_email e ON e.idContact = ct.id
      LEFT JOIN num_tel t ON t.idContact = ct.id
      ORDER BY c.id, ct.id
    `;

      const [rows] = await db.execute(query);

      // Transformer le résultat en structure hiérarchique
      const clientsMap = new Map();

      rows.forEach(row => {
        if (!clientsMap.has(row.clientId)) {
          clientsMap.set(row.clientId, {
            id: row.clientId,
            numero: row.numero,
            compte: row.compte,
            nomClient: row.nomClient,   // nom unique pour tous les types
            contacts: []
          });
        }

        const client = clientsMap.get(row.clientId);

        if (row.contactId) {
          let contact = client.contacts.find(c => c.id === row.contactId);
          if (!contact) {
            contact = {
              id: row.contactId,
              nomComplet: row.contactNomComplet,
              poste: row.poste,
              dateDu: row.dateDu,
              dateAu: row.dateAu,
              memoNote: row.memoNote,
              listEmails: [],
              listTels: []
            };
            client.contacts.push(contact);
          }

          if (row.emailId && !contact.listEmails.some(e => e.id === row.emailId)) {
            contact.listEmails.push({
              id: row.emailId,
              email: row.email,
              type: row.emailType
            });
          }

          if (row.telId && !contact.listTels.some(t => t.id === row.telId)) {
            contact.listTels.push({
              id: row.telId,
              tel: row.tel,
              type: row.telType
            });
          }
        }
      });

      return Array.from(clientsMap.values());

    } catch (err) {
      console.error("Erreur getAllClientsWithContacts:", err);
      throw err;
    }
  }


  static async createRecord(record) {
    try {
      const query = `INSERT INTO client (numero, compte) VALUES (?, ?)`;
      const [result] = await db.execute(query, [record.numero, record.compte]);
      return { id: result.insertId, ...record };
    } catch (err) {
      throw err;
    }
  }

  static async getRecordById(id) {
    try {
      const query = `SELECT * FROM client WHERE id = ?`;
      const [rows] = await db.execute(query, [id]);
      return rows[0] || null; // retourne le premier résultat ou null si rien trouvé
    } catch (err) {
      throw err;
    }
  }

  static async deleteRecordById(idClient) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // récupérer idContact
      const [contactRows] = await connection.query(
        `SELECT id FROM contact WHERE idClient = ? LIMIT 1`,
        [idClient]
      );
      const idContact = contactRows.length ? contactRows[0].id : null;

      if (idContact) {
        await connection.query(`DELETE FROM num_tel WHERE idContact = ?`, [idContact]);
        await connection.query(`DELETE FROM adresse_email WHERE idContact = ?`, [idContact]);
        await connection.query(`DELETE FROM contact WHERE id = ?`, [idContact]);
      }

      // Récupérer idAdresseAgence et supprimer
      const [agenceRows] = await connection.query(
        `SELECT idAdresse FROM agence WHERE idClient = ? LIMIT 1`,
        [idClient]
      );
      const idAdresseAgence = agenceRows.length ? agenceRows[0].idAdresse : null;
      if (idAdresseAgence) {
        await connection.query(`DELETE FROM adresse WHERE id = ?`, [idAdresseAgence]);
      }

      // Récupérer idAdresseParticulier et supprimer
      const [particulierRows] = await connection.query(
        `SELECT idAdresse FROM particulier WHERE idClient = ? LIMIT 1`,
        [idClient]
      );
      const idAdresseParticulier = particulierRows.length ? particulierRows[0].idAdresse : null;
      if (idAdresseParticulier) {
        await connection.query(`DELETE FROM adresse WHERE id = ?`, [idAdresseParticulier]);
      }

      // Supprimer agences, particuliers, organisations, client
      await connection.query(`DELETE FROM agence WHERE idClient = ?`, [idClient]);
      await connection.query(`DELETE FROM particulier WHERE idClient = ?`, [idClient]);
      await connection.query(`DELETE FROM organisation WHERE idClient = ?`, [idClient]);
      await connection.query(`DELETE FROM client WHERE id = ?`, [idClient]);

      await connection.commit();
      connection.release();
    } catch (err) {
      await connection.rollback();
      connection.release();
      throw err;
    }
  }

  static async getRecordDetails(id) {
    const [rows] = await db.query(
      `
      SELECT 
        c.id AS clientId,
        c.numero,
        c.compte,
        COALESCE(p.nomComplet, a.nomAgence, o.nomEntreprise) AS nomClient,

        ad.id AS adresseId,
        ad.adresse AS adresseLigne,
        ad.codePostal,
        ad.ville,
        ad.province,
        ad.pays,
        ad.etage,
        ad.appartementLocal,
        ad.batiment,
        ad.interphoneDigicode,
        ad.escalier,
        ad.porteEntree,

        ct.id AS contactId,
        ct.nomComplet AS contactNomComplet,
        ct.poste,
        ct.dateDu,
        ct.dateAu,
        ct.memoNote,

        e.id AS emailId,
        e.email,
        e.type AS emailType,

        t.id AS telId,
        t.tel,
        t.type AS telType

      FROM client c
      LEFT JOIN particulier p ON p.idClient = c.id
      LEFT JOIN agence a ON a.idClient = c.id
      LEFT JOIN organisation o ON o.idClient = c.id
      LEFT JOIN adresse ad ON ad.id = a.idAdresse
      LEFT JOIN contact ct ON ct.idClient = c.id
      LEFT JOIN adresse_email e ON e.idContact = ct.id
      LEFT JOIN num_tel t ON t.idContact = ct.id

      WHERE c.id = ?
      ORDER BY c.id, ct.id
      `,
      [id]
    );

    if (!rows.length) return null;

    const clientRow = rows[0];
    const client = {
      id: clientRow.clientId,
      numero: clientRow.numero,
      compte: clientRow.compte,
      nomClient: clientRow.nomClient,
      adresse: {
        id: clientRow.adresseId,
        adresse: clientRow.adresseLigne,
        codePostal: clientRow.codePostal,
        ville: clientRow.ville,
        province: clientRow.province,
        pays: clientRow.pays,
        etage: clientRow.etage,
        appartementLocal: clientRow.appartementLocal,
        batiment: clientRow.batiment,
        interphoneDigicode: clientRow.interphoneDigicode,
        escalier: clientRow.escalier,
        porteEntree: clientRow.porteEntree,
      },
      contacts: [],
    };

    for (const row of rows) {
      if (row.contactId) {
        let contact = client.contacts.find(ct => ct.id === row.contactId);
        if (!contact) {
          contact = {
            id: row.contactId,
            nomComplet: row.contactNomComplet,
            poste: row.poste,
            dateDu: row.dateDu,
            dateAu: row.dateAu,
            memoNote: row.memoNote,
            emails: [],
            telephones: [],
          };
          client.contacts.push(contact);
        }

        if (row.emailId)
          contact.emails.push({
            id: row.emailId,
            email: row.email,
            type: row.emailType,
          });

        if (row.telId)
          contact.telephones.push({
            id: row.telId,
            tel: row.tel,
            type: row.telType,
          });
      }
    }

    return client;
  }

}

module.exports = ClientService;
