const db = require("../db"); // pool mysql2/promise

class ClientService {

  // Récupérer tous les clients avec nom_client et type_client
  static async getAllRecords() {
    const query = `
    SELECT 
    c.id,
    c.numero,
    c.compte,
    COALESCE(p.nom_complet, a.nom_agence, o.nom_entreprise) AS nom_client,
    CASE
      WHEN p.client_id IS NOT NULL THEN 'particulier'
      WHEN a.client_id IS NOT NULL THEN 'agence'
      WHEN o.client_id IS NOT NULL THEN 'organisation'
      ELSE 'inconnu'
    END AS type_client
FROM client c
LEFT JOIN particulier p ON p.client_id = c.id
LEFT JOIN agence a ON a.client_id = c.id
LEFT JOIN organisation o ON o.client_id = c.id
WHERE c.parent_id IS NULL
ORDER BY nom_client ASC;

    `;

    const [rows] = await db.query(query);
    return rows;
  }

  // 🔹 UPDATE CLIENT BY ID
  static async updateRecordById(record) {
    const { id, numero, compte } = record;

    const query = `
      UPDATE client
      SET numero = ?, compte = ?
      WHERE id = ?
    `;

    const [result] = await db.execute(query, [
      numero,
      compte,
      id
    ]);

    return {
      success: true,
      message: "Client mis à jour avec succès",
      affectedRows: result.affectedRows,
      data: record
    };
  }

  // Récupérer tous les clients avec contacts, emails et téléphones
  static async getAllClientsWithContacts() {
    try {
      const query = `
      SELECT 
        c.id AS clientId,
        c.numero,
        c.compte,
        COALESCE(p.nom_complet, a.nom_agence, o.nom_entreprise) AS nomClient,
        CASE
          WHEN p.id IS NOT NULL THEN 'particulier'
          WHEN a.id IS NOT NULL THEN 'agence'
          WHEN o.id IS NOT NULL THEN 'organisation'
          ELSE 'inconnu'
        END AS typeClient,
        p.id AS particulierId,
        p.email AS particulierEmail,
        p.telephone AS particulierTel,
        a.id AS agenceId,
        o.id AS organisationId,
        ad.id AS adresseId,
        ad.adresse,
        ad.code_postal,
        ad.ville,
        ad.province,
        ad.pays,
        ad.etage,
        ad.appartement_local,
        ad.batiment,
        ad.interphone_digicode,
        ad.escalier,
        ad.porte_entree,
        ct.id AS contactId,
        ct.nom_complet AS contactNomComplet,
        ct.poste,
        ct.date_du,
        ct.date_au,
        ct.memo_note,
        e.id AS emailId,
        e.email,
        e.type AS emailType,
        t.id AS telId,
        t.tel,
        t.type AS telType
      FROM client c
      LEFT JOIN particulier p ON p.client_id = c.id
      LEFT JOIN agence a ON a.client_id = c.id
      LEFT JOIN organisation o ON o.client_id = c.id
      LEFT JOIN adresse ad ON ad.id = p.adresse_id OR ad.id = a.adresse_id
      LEFT JOIN contact ct ON ct.client_id = c.id
      LEFT JOIN adresse_email e ON e.contact_id = ct.id
      LEFT JOIN num_tel t ON t.contact_id = ct.id

      -- 🔥 FILTRE : retourner seulement les clients qui ne sont pas des parents
      WHERE c.parent_id IS NULL

      ORDER BY c.id, ct.id;
    `;

      const [rows] = await db.execute(query);

      const clientsMap = new Map();

      rows.forEach(row => {
        if (!clientsMap.has(row.clientId)) {
          const clientData = {
            id: row.clientId,
            numero: row.numero,
            compte: row.compte,
            nom_client: row.nomClient,
            type_client: row.typeClient,
            particulier_id: row.particulierId,
            agence_id: row.agenceId,
            organisation_id: row.organisationId,
            adresse: row.adresseId ? {
              id: row.adresseId,
              adresse: row.adresse,
              code_postal: row.code_postal,
              ville: row.ville,
              province: row.province,
              pays: row.pays,
              etage: row.etage,
              appartement_local: row.appartement_local,
              batiment: row.batiment,
              interphone_digicode: row.interphone_digicode,
              escalier: row.escalier,
              porte_entree: row.porte_entree
            } : null,
            contacts: []
          };

          if (row.typeClient === 'particulier') {
            clientData.email = row.particulierEmail;
            clientData.telephone = row.particulierTel;
          }

          clientsMap.set(row.clientId, clientData);
        }

        const client = clientsMap.get(row.clientId);

        if (row.contactId) {
          let contact = client.contacts.find(c => c.id === row.contactId);
          if (!contact) {
            contact = {
              id: row.contactId,
              nom_complet: row.contactNomComplet,
              poste: row.poste,
              date_du: row.date_du,
              date_au: row.date_au,
              memo_note: row.memo_note,
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

  // Créer un client simple
  static async createRecord(record) {
    const [result] = await db.execute(
      `INSERT INTO client (numero, compte, parent_id) VALUES (?, ?, ?)`,
      [record.numero, record.compte, record.parent_id]
    );
    return { id: result.insertId, ...record };
  }

  static async getRecordById(id) {
    const [rows] = await db.execute(`SELECT * FROM client WHERE id = ?`, [id]);
    return rows[0] || null;
  }

  // Supprimer un client et toutes les dépendances
  static async deleteRecordById(client_id) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Récupérer contact_id
      const [contactRows] = await connection.query(
        `SELECT id FROM contact WHERE client_id = ?`,
        [client_id]
      );
      const contact_id = contactRows.length ? contactRows[0].id : null;

      if (contact_id) {
        await connection.query(`DELETE FROM num_tel WHERE contact_id = ?`, [contact_id]);
        await connection.query(`DELETE FROM adresse_email WHERE contact_id = ?`, [contact_id]);
        await connection.query(`DELETE FROM contact WHERE id = ?`, [contact_id]);
      }

      // Supprimer adresses agence/particulier
      const [agenceRows] = await connection.query(
        `SELECT adresse_id FROM agence WHERE client_id = ?`,
        [client_id]
      );
      if (agenceRows.length) await connection.query(`DELETE FROM adresse WHERE id = ?`, [agenceRows[0].adresse_id]);

      const [partRows] = await connection.query(
        `SELECT adresse_id FROM particulier WHERE client_id = ?`,
        [client_id]
      );
      if (partRows.length) await connection.query(`DELETE FROM adresse WHERE id = ?`, [partRows[0].adresse_id]);

      // Supprimer agences, particuliers, organisations et client
      await connection.query(`DELETE FROM agence WHERE client_id = ?`, [client_id]);
      await connection.query(`DELETE FROM particulier WHERE client_id = ?`, [client_id]);
      await connection.query(`DELETE FROM organisation WHERE client_id = ?`, [client_id]);
      await connection.query(`DELETE FROM client WHERE id = ?`, [client_id]);

      await connection.commit();
      connection.release();
    } catch (err) {
      await connection.rollback();
      connection.release();
      throw err;
    }
  }

  // Détails d’un client avec contacts et type_client
  static async getRecordDetails(id) {
    const [rows] = await db.query(
      `SELECT
      c.id AS client_id,
      c.numero,
      c.compte,
      COALESCE(p.nom_complet, a.nom_agence, o.nom_entreprise) AS nom_client,
      COALESCE(p.note, a.note, o.note) AS note,
      COALESCE(p.id, a.id, o.id) AS id,  -- id spécifique selon le type
      CASE 
        WHEN p.id IS NOT NULL THEN 'particulier'
        WHEN a.id IS NOT NULL THEN 'agence'
        WHEN o.id IS NOT NULL THEN 'organisation'
        ELSE 'inconnu'
      END AS type_client,
      ad.id AS adresseId, ad.adresse AS adresseLigne, ad.code_postal, ad.ville, ad.province, ad.pays,
      ad.etage, ad.appartement_local, ad.batiment, ad.interphone_digicode,
      ad.escalier, ad.porte_entree,
      ct.id AS contact_id, ct.nom_complet AS contact_nom_complet, ct.poste, ct.date_du, ct.date_au, ct.memo_note,
      e.id AS emailId, e.email, e.type AS emailType,
      t.id AS telId, t.tel, t.type AS telType
    FROM client c
    LEFT JOIN particulier p ON p.client_id = c.id
    LEFT JOIN agence a ON a.client_id = c.id
    LEFT JOIN organisation o ON o.client_id = c.id
    LEFT JOIN adresse ad ON ad.id = COALESCE(a.adresse_id, p.adresse_id)
    LEFT JOIN contact ct ON ct.client_id = c.id
    LEFT JOIN adresse_email e ON e.contact_id = ct.id
    LEFT JOIN num_tel t ON t.contact_id = ct.id
    WHERE c.id = ?
    ORDER BY c.id, ct.id`,
      [id]
    );

    if (!rows.length) return null;

    const row = rows[0];

    const client = {
      client_id: row.client_id,   // ID général du client
      id: row.id,                 // ID spécifique selon le type (particulier, agence, organisation)
      type_client: row.type_client,
      numero: row.numero,
      compte: row.compte,
      nom_client: row.nom_client,
      note: row.note,
      adresse: row.adresseId ? {
        id: row.adresseId,
        adresse: row.adresseLigne,
        code_postal: row.code_postal,
        ville: row.ville,
        province: row.province,
        pays: row.pays,
        etage: row.etage,
        appartement_local: row.appartement_local,
        batiment: row.batiment,
        interphone_digicode: row.interphone_digicode,
        escalier: row.escalier,
        porte_entree: row.porte_entree
      } : null,
      contacts: []
    };

    for (const r of rows) {
      if (r.contact_id) {
        let contact = client.contacts.find(ct => ct.id === r.contact_id);
        if (!contact) {
          contact = {
            id: r.contact_id,
            nom_complet: r.contact_nom_complet,
            poste: r.poste,
            date_du: r.date_du,
            date_au: r.date_au,
            memo_note: r.memo_note,
            emails: [],
            telephones: []
          };
          client.contacts.push(contact);
        }

        if (r.emailId && !contact.emails.some(e => e.id === r.emailId))
          contact.emails.push({ id: r.emailId, email: r.email, type: r.emailType });

        if (r.telId && !contact.telephones.some(t => t.id === r.telId))
          contact.telephones.push({ id: r.telId, tel: r.tel, type: r.telType });
      }
    }

    return client;
  }



  static async getClientsByParentWithDetails(parentId) {
    try {
      const query = `
      /* =======================================================================
         1 — CLIENTS ENFANTS DIRECTS (contacts liés via client_id)
      ======================================================================== */
      SELECT
        c.id AS clientId,
        c.numero,
        c.compte,
        COALESCE(p.nom_complet, a.nom_agence, o.nom_entreprise) AS nom_client,
        NULL AS secteur_nom,
        NULL AS secteur_reference,
        NULL AS habitation_reference,
        NULL AS reference,
        p.id AS particulier_id,
        a.id AS agence_id,
        o.id AS organisation_id,
        NULL AS secteur_id,
        NULL AS habitation_id,
        c.parent_id AS parent_id,
        'client' AS type_item,
        -- Type du parent
        CASE 
          WHEN c.parent_id IS NULL THEN NULL
          WHEN EXISTS (SELECT 1 FROM particulier pp WHERE pp.client_id = c.parent_id) THEN 'particulier'
          WHEN EXISTS (SELECT 1 FROM agence aa WHERE aa.client_id = c.parent_id) THEN 'agence'
          WHEN EXISTS (SELECT 1 FROM organisation oo WHERE oo.client_id = c.parent_id) THEN 'organisation'
          ELSE 'client'
        END AS type_parent,
        ct.id AS contact_id,
        ct.nom_complet AS contact_nom_complet,
        ct.poste,
        ct.date_du,
        ct.date_au,
        ct.memo_note,
        e.id AS emailId,
        e.email,
        e.type AS emailType,
        t.id AS telId,
        t.tel,
        t.type AS telType,
        ad.id AS adresse_id,
        ad.adresse AS adresse_rue,
        ad.code_postal,
        ad.ville,
        ad.province,
        ad.pays,
        ad.etage,
        ad.appartement_local,
        ad.batiment,
        ad.interphone_digicode,
        ad.escalier,
        ad.porte_entree
      FROM client c
      LEFT JOIN particulier p ON p.client_id = c.id
      LEFT JOIN agence a ON a.client_id = c.id
      LEFT JOIN organisation o ON o.client_id = c.id

      /* Contacts par CLIENT */
      LEFT JOIN contact ct ON ct.client_id = c.id
      LEFT JOIN adresse_email e ON e.contact_id = ct.id
      LEFT JOIN num_tel t ON t.contact_id = ct.id

      LEFT JOIN adresse ad ON ad.id = COALESCE(a.adresse_id, p.adresse_id)
      WHERE c.parent_id = ?

      UNION ALL

      /* =======================================================================
         2 — SECTEURS (contacts liés via secteur_id)
      ======================================================================== */
      SELECT
        s.id AS clientId,
        NULL AS numero,
        NULL AS compte,
        NULL AS nom_client,
        s.nom AS secteur_nom,
        s.reference AS secteur_reference,
        NULL AS habitation_reference,
        s.reference AS reference,
        NULL AS particulier_id,
        s.agence_id,
        s.organisation_id,
        s.id AS secteur_id,
        NULL AS habitation_id,
        s.parent_id AS parent_id,
        'secteur' AS type_item,
        CASE
          WHEN s.parent_id IS NOT NULL THEN 'secteur'
          WHEN s.agence_id IS NOT NULL THEN 'agence'
          WHEN s.organisation_id IS NOT NULL THEN 'organisation'
          ELSE NULL
        END AS type_parent,

        /* Contacts par SECTEUR */
        ct.id AS contact_id,
        ct.nom_complet AS contact_nom_complet,
        ct.poste,
        ct.date_du,
        ct.date_au,
        ct.memo_note,
        e.id AS emailId,
        e.email,
        e.type AS emailType,
        t.id AS telId,
        t.tel,
        t.type AS telType,
        ad.id AS adresse_id,
        ad.adresse AS adresse_rue,
        ad.code_postal,
        ad.ville,
        ad.province,
        ad.pays,
        ad.etage,
        ad.appartement_local,
        ad.batiment,
        ad.interphone_digicode,
        ad.escalier,
        ad.porte_entree
      FROM secteur s
      LEFT JOIN contact ct ON ct.secteur_id = s.id
      LEFT JOIN adresse_email e ON e.contact_id = ct.id
      LEFT JOIN num_tel t ON t.contact_id = ct.id
      LEFT JOIN adresse ad ON ad.id = s.adresse_id
      WHERE s.parent_id = ? OR s.agence_id = ? OR s.organisation_id = ?

      UNION ALL

      /* =======================================================================
         3 — HABITATIONS (contacts liés via habitation_id)
      ======================================================================== */
      SELECT
        h.id AS clientId,
        NULL AS numero,
        NULL AS compte,
        NULL AS nom_client,
        NULL AS secteur_nom,
        NULL AS secteur_reference,
        h.reference AS habitation_reference,
        h.reference AS reference,
        h.particulier_id,
        h.agence_id,
        h.organisation_id,
        h.secteur_id AS secteur_id,
        h.id AS habitation_id,
        COALESCE(h.secteur_id, h.agence_id, h.organisation_id, h.particulier_id) AS parent_id,
        'habitation' AS type_item,

        CASE
          WHEN h.secteur_id IS NOT NULL THEN 'secteur'
          WHEN h.agence_id IS NOT NULL THEN 'agence'
          WHEN h.organisation_id IS NOT NULL THEN 'organisation'
          WHEN h.particulier_id IS NOT NULL THEN 'particulier'
          ELSE NULL
        END AS type_parent,

        /* Contacts par HABITATION */
        ct.id AS contact_id,
        ct.nom_complet AS contact_nom_complet,
        ct.poste,
        ct.date_du,
        ct.date_au,
        ct.memo_note,
        e.id AS emailId,
        e.email,
        e.type AS emailType,
        t.id AS telId,
        t.tel,
        t.type AS telType,
        ad.id AS adresse_id,
        ad.adresse AS adresse_rue,
        ad.code_postal,
        ad.ville,
        ad.province,
        ad.pays,
        ad.etage,
        ad.appartement_local,
        ad.batiment,
        ad.interphone_digicode,
        ad.escalier,
        ad.porte_entree
      FROM habitation h
      LEFT JOIN contact ct ON ct.habitation_id = h.id
      LEFT JOIN adresse_email e ON e.contact_id = ct.id
      LEFT JOIN num_tel t ON t.contact_id = ct.id
      LEFT JOIN adresse ad ON ad.id = h.adresse_id
      WHERE h.secteur_id = ? OR h.agence_id = ? OR h.organisation_id = ? OR h.particulier_id = ?

      ORDER BY type_item, clientId, contact_id;
    `;

      const params = [
        parentId,
        parentId, parentId, parentId,
        parentId, parentId, parentId, parentId
      ];

      const [rows] = await db.query(query, params);

      /* -------------------- FORMATAGE DES DONNÉES ------------------------ */

      const itemsMap = new Map();

      rows.forEach(row => {
        if (!itemsMap.has(row.clientId)) {
          let type_client = row.type_item !== 'client'
            ? row.type_item
            : row.particulier_id ? 'particulier'
              : row.agence_id ? 'agence'
                : row.organisation_id ? 'organisation'
                  : 'client';

          itemsMap.set(row.clientId, {
            id: row.clientId,
            numero: row.numero,
            compte: row.compte,
            nom_client:
              type_client === 'secteur' ? row.secteur_nom :
                type_client === 'habitation' ? row.habitation_reference :
                  row.nom_client,
            type_client,
            type_parent: row.type_parent,
            agence_id: row.agence_id,
            organisation_id: row.organisation_id,
            particulier_id: row.particulier_id,
            secteur_id: row.secteur_id,
            habitation_id: row.habitation_id,
            reference: row.reference,
            parent_id: row.parent_id,
            adresse: row.adresse_id ? {
              id: row.adresse_id,
              adresse: row.adresse_rue,
              code_postal: row.code_postal,
              ville: row.ville,
              province: row.province,
              pays: row.pays,
              etage: row.etage,
              appartement_local: row.appartement_local,
              batiment: row.batiment,
              interphone_digicode: row.interphone_digicode,
              escalier: row.escalier,
              porte_entree: row.porte_entree
            } : null,
            contacts: []
          });
        }

        const item = itemsMap.get(row.clientId);

        if (row.contact_id) {
          let contact = item.contacts.find(c => c.id === row.contact_id);
          if (!contact) {
            contact = {
              id: row.contact_id,
              nom_complet: row.contact_nom_complet,
              poste: row.poste,
              date_du: row.date_du,
              date_au: row.date_au,
              memo_note: row.memo_note,
              listEmails: [],
              listTels: []
            };
            item.contacts.push(contact);
          }

          if (row.emailId && !contact.listEmails.some(e => e.id === row.emailId))
            contact.listEmails.push({ id: row.emailId, email: row.email, type: row.emailType });

          if (row.telId && !contact.listTels.some(t => t.id === row.telId))
            contact.listTels.push({ id: row.telId, tel: row.tel, type: row.telType });
        }
      });

      return Array.from(itemsMap.values());
    } catch (err) {
      console.error("Erreur getClientsByParentWithDetails:", err);
      throw err;
    }
  }


}

module.exports = ClientService;
