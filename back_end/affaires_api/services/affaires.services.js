const pool = require('../db'); // connexion MySQL2/promise

class AffaireService {
  /**
   * 🔹 Créer une nouvelle affaire
   */
  static async apiCreate(data) {
    const safeData = {
      reference: data.reference || '',
      titre: data.titre || '',
      zoneIntervention: data.zoneIntervention || '',
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
        reference, titre, zoneIntervention, description, clientId,
        etatLogement, technicienId, equipeTechnicienId,
        dateDebut, dateFin, motsCles, dureePrevueHeures, dureePrevueMinutes,
        memo, memoPiecesJointes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

      const values = [
        safeData.reference,
        safeData.titre,
        safeData.zoneIntervention,
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
        safeData.memoPiecesJointes
      ];

      const [result] = await connection.query(insertAffaireQuery, values);
      const affaireId = result.insertId;
      console.log("✅ Affaire créée avec ID:", affaireId);

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
    // 🔹 Récupérer toutes les affaires distinctes
    const sql = `
      SELECT DISTINCT
        a.id AS affaireId,
        a.reference,
        a.titre,
        a.dateDebut,
        a.dateFin,
        a.etatLogement,
        a.dureePrevueHeures,
        a.dureePrevueMinutes,
        a.memo,
        COALESCE(p.nomComplet, o.nomEntreprise, 'Client inconnu') AS nomClient,
        e.id AS equipeId,
        e.nom AS equipeNom,
        e.description AS equipeDescription,
        tc.id AS chefEquipeId,
        tc.nom AS chefEquipeNom,
        tc.prenom AS chefEquipePrenom
      FROM affaire a
      LEFT JOIN client c ON a.clientId = c.id
      LEFT JOIN particulier p ON p.idClient = c.id
      LEFT JOIN organisation o ON o.idClient = c.id
      LEFT JOIN equipe_technicien e ON a.equipeTechnicienId = e.id
      LEFT JOIN technicien tc ON e.chefId = tc.id
      ORDER BY a.id DESC;
    `;

    const [rows] = await pool.execute(sql);

    for (const affaire of rows) {
      const affaireId = affaire.affaireId;

      // 🔹 Fichiers associés
      const [fichiers] = affaireId
        ? await pool.execute(
            `SELECT nom, chemin FROM fichier WHERE idAffaire = ?`,
            [affaireId]
          )
        : [];
      affaire.fichiers = fichiers || [];

      // 🔹 Référents associés
      const [referents] = affaireId
        ? await pool.execute(
            `SELECT r.id, r.nom, r.prenom, r.email, r.telephone
             FROM referent r
             JOIN affaire_referent ar ON r.id = ar.idReferent
             WHERE ar.idAffaire = ?`,
            [affaireId]
          )
        : [];
      affaire.referents = referents.length > 0 ? referents : [{ message: 'Aucun référent assigné' }];

      // 🔹 Membres de l'équipe
      const [membres] = affaire.equipeId
        ? await pool.execute(
            `SELECT t.id, t.nom, t.prenom
             FROM technicien t
             JOIN technicien_equipe te ON t.id = te.technicienId
             WHERE te.equipeId = ?`,
            [affaire.equipeId]
          )
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
  static async updateAffaire(id, data) {
    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (fields.length === 0) return null;

    const query = `UPDATE affaire SET ${fields.join(', ')} WHERE id = ?`;
    values.push(id);

    await pool.query(query, values);
    const [updated] = await pool.query('SELECT * FROM affaire WHERE id = ?', [id]);
    return updated[0];
  }

  /**
   * 🔹 Supprimer une affaire
   */
  static async apiDeleteById(id) {
    const [result] = await pool.query('DELETE FROM affaire WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = AffaireService;
