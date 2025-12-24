const pool = require('../db'); // connexion MySQL2/promise

class AffaireService {
  /**
   * 🔹 Créer une nouvelle affaire
   */
  static async apiCreate(data) {
    const safeData = {
      reference: data.reference || '',
      titre: data.titre || '',
      adresse_id: data.adresse_id != null ? Number(data.adresse_id) : null,
      client_adresse_id: data.client_adresse_id != null ? Number(data.client_adresse_id) : null,
      type_client_adresse: data.type_client_adresse || '',
      description: data.description || '',
      clientId: data.clientId != null ? Number(data.clientId) : null,
      etatLogement: data.etatLogement || '',
      technicienId: data.technicienId != null ? Number(data.technicienId) : null,
      equipeTechnicienId: data.equipeTechnicienId != null ? Number(data.equipeTechnicienId) : null,
      referents: Array.isArray(data.referents) ? data.referents.map(r => Number(r)) : [],
      dateDebut: data.dateDebut || null,
      dateFin: data.dateFin || null,
      motsCles: data.motsCles || '',
      dureePrevueHeures: data.dureePrevueHeures != null ? Number(data.dureePrevueHeures) : 0,
      dureePrevueMinutes: data.dureePrevueMinutes != null ? Number(data.dureePrevueMinutes) : 0,
      memo: data.memo || '',
      memoPiecesJointes: data.memoPiecesJointes || ''
    };

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // 🔹 1. Insertion dans affaire
      const insertAffaireQuery = `
      INSERT INTO affaire (
        reference, titre, description, clientId,
        etatLogement, technicienId, equipeTechnicienId,
        dateDebut, dateFin, motsCles, dureePrevueHeures, dureePrevueMinutes,
        memo, memoPiecesJointes, adresse_id, client_adresse_id, type_client_adresse
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

      const values = [
        safeData.reference,
        safeData.titre,
        safeData.description,
        safeData.clientId,
        safeData.etatLogement,
        safeData.technicienId,
        safeData.equipeTechnicienId,
        safeData.dateDebut,
        safeData.dateFin,
        safeData.motsCles,
        safeData.dureePrevueHeures,
        safeData.dureePrevueMinutes,
        safeData.memo,
        safeData.memoPiecesJointes,
        safeData.adresse_id,
        safeData.client_adresse_id,
        safeData.type_client_adresse
      ];

      const [result] = await connection.query(insertAffaireQuery, values);
      const affaireId = result.insertId;

      // 🔹 2. Insertion dans affaire_referent
      if (safeData.referents && safeData.referents.length > 0) {
        const valuesRef = safeData.referents.map(refId => [affaireId, refId]);
        console.log("Valeurs à insérer dans affaire_referent:", valuesRef);

        await connection.query(
          "INSERT INTO affaire_referent (idAffaire, idReferent) VALUES ?",
          [valuesRef]
        );

        console.log("✅ Référents associés:", safeData.referents);
      } else {
        console.warn("⚠️ Aucun référent associé à cette affaire.");
      }

      await connection.commit();
      return { id: affaireId, ...safeData };
    } catch (error) {
      await connection.rollback();
      console.error("❌ Erreur création affaire:", error);
      throw error;
    } finally {
      connection.release();
    }
  }


  /**
   * 🔹 Récupérer toutes les affaires
   */
  // Récupération des affaires avec fichiers, référents et équipe
  static async apiGetAll() {
    try {
      // 🔹 Requête principale : récupère les affaires avec le nom exact du client
      const sql = `
      SELECT
        a.id AS affaireId,
        a.reference,
        a.titre,
        a.dateDebut,
        a.dateFin,
        a.etatLogement,
        a.dureePrevueHeures,
        a.dureePrevueMinutes,
        a.memo,
        -- Nom du client : particulier > agence > organisation
        COALESCE(p.nom_complet, ag.nom_agence, o.nom_entreprise, 'Client inconnu') AS nomClient,
        e.id AS equipeId,
        e.nom AS equipeNom,
        e.description AS equipeDescription,
        tc.id AS chefEquipeId,
        tc.nom AS chefEquipeNom,
        tc.prenom AS chefEquipePrenom
      FROM affaire a
      LEFT JOIN client c ON a.clientId = c.id
      LEFT JOIN particulier p ON p.client_id = c.id
      LEFT JOIN agence ag ON ag.client_id = c.id
      LEFT JOIN organisation o ON o.client_id = c.id
      LEFT JOIN equipe_technicien e ON a.equipeTechnicienId = e.id
      LEFT JOIN technicien tc ON e.chefId = tc.id
      ORDER BY a.id DESC;
    `;

      const [rows] = await pool.execute(sql);

      for (const affaire of rows) {
        const affaireId = affaire.affaireId;

        // 🔹 Fichiers associés
        affaire.fichiers = affaireId
          ? (await pool.execute(
            `SELECT id, nom, chemin FROM fichier WHERE idAffaire = ?`,
            [affaireId]
          ))[0]
          : [];

        // 🔹 Référents associés
        const referents = affaireId
          ? (await pool.execute(
            `SELECT r.id, r.nom, r.prenom, r.email, r.telephone
             FROM referent r
             JOIN affaire_referent ar ON r.id = ar.idReferent
             WHERE ar.idAffaire = ?`,
            [affaireId]
          ))[0]
          : [];
        affaire.referents = referents.length > 0 ? referents : [{ message: 'Aucun référent assigné' }];

        // 🔹 Membres de l'équipe
        const membres = affaire.equipeId
          ? (await pool.execute(
            `SELECT t.id, t.nom, t.prenom
             FROM technicien t
             JOIN technicien_equipe te ON t.id = te.technicienId
             WHERE te.equipeId = ?`,
            [affaire.equipeId]
          ))[0]
          : [];
        affaire.membresEquipe = membres || [];
      }

      return rows;

    } catch (err) {
      console.error('Erreur apiGetAll:', err);
      throw err;
    }
  }

  /**
   * 🔹 Modifier une affaire
   */
  // Exemple de service basique pour mettre à jour une affaire
  static async updateAffaire(record) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // 🔹 Helper : convertir '' en NULL (important pour MySQL DATE)
      const cleanDate = (value) =>
        value && value !== '' ? value : null;

      // 🔹 1. Mise à jour de l'affaire
      const query = `
      UPDATE affaire 
      SET 
        reference = ?, 
        titre = ?, 
        description = ?, 
        clientId = ?, 
        etatLogement = ?, 
        technicienId = ?, 
        equipeTechnicienId = ?, 
        dateDebut = ?, 
        dateFin = ?, 
        motsCles = ?, 
        dureePrevueHeures = ?, 
        dureePrevueMinutes = ?, 
        memo = ?, 
        memoPiecesJointes = ?, 
        adresse_id = ?, 
        client_adresse_id = ?,
        type_client_adresse = ?
      WHERE id = ?
    `;

      const values = [
        record.reference ?? null,
        record.titre ?? null,
        record.description ?? null,
        record.clientId ?? null,
        record.etatLogement ?? null,
        record.technicienId ?? null,
        record.equipeTechnicienId ?? null,

        // ✅ correction dates
        cleanDate(record.dateDebut),
        cleanDate(record.dateFin),

        record.motsCles ?? null,
        record.dureePrevueHeures ?? null,
        record.dureePrevueMinutes ?? null,
        record.memo ?? null,
        record.memoPiecesJointes ?? null,
        record.adresse_id ?? null,
        record.client_adresse_id ?? null,
        record.type_client_adresse ?? null,
        record.id
      ];

      await connection.execute(query, values);

      // 🔹 2. Mise à jour des référents
      if (Array.isArray(record.referents)) {

        // Supprimer les anciens référents
        await connection.execute(
          `DELETE FROM affaire_referent WHERE idAffaire = ?`,
          [record.id]
        );

        // Réinsérer les nouveaux référents
        if (record.referents.length > 0) {
          const valuesRef = record.referents.map(refId => [
            record.id,
            Number(refId)
          ]);

          await connection.query(
            `INSERT INTO affaire_referent (idAffaire, idReferent) VALUES ?`,
            [valuesRef]
          );
        }
      }

      await connection.commit();
      return { success: true };

    } catch (error) {
      await connection.rollback();
      console.error('❌ Erreur updateAffaire:', error);
      throw error;
    } finally {
      connection.release();
    }
  }


  /**
   * 🔹 Supprimer une affaire
   */
  static async apiDeleteById(id) {
    const [result] = await pool.query('DELETE FROM affaire WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  /** 🔹 Récupérer une affaire par son ID */
  static async apiGetById(id) {
    try {
      const [rows] = await pool.query(
        `SELECT 
        a.id, a.reference, a.titre, a.description, a.clientId, a.adresse_id, a.client_adresse_id, a.type_client_adresse,
        a.etatLogement, a.technicienId, a.equipeTechnicienId, a.dateDebut, a.dateFin,
        a.dureePrevueHeures, a.dureePrevueMinutes, a.motsCles, a.memo, a.memoPiecesJointes
      FROM affaire a
      WHERE a.id = ?`,
        [id]
      );

      if (!rows || rows.length === 0) {
        return { success: false, message: 'Affaire non trouvée' };
      }

      const affaire = rows[0];

      // 🔹 Charger uniquement les IDs des référents
      const [referents] = await pool.query(
        `SELECT r.id
       FROM referent r
       JOIN affaire_referent ar ON r.id = ar.idReferent
       WHERE ar.idAffaire = ?`,
        [id]
      );
      // Tableau vide si aucun référent
      affaire.referents = referents ? referents.map(r => r.id) : [];

      // 🔹 Charger les fichiers associés (optionnel)
      const [files] = await pool.query(
        `SELECT id, nom, chemin FROM fichier WHERE idAffaire = ?`,
        [id]
      );
      affaire.fichiers = files || [];

      return { success: true, data: affaire };

    } catch (error) {
      console.error('Erreur apiGetById:', error);
      return { success: false, message: 'Erreur serveur' };
    }
  }


}

module.exports = AffaireService;
