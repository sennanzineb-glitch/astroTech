const pool = require('../db'); // connexion MySQL2/promise

class InterventionService {
  /**
   * 🔹 Créer une nouvelle intervention
   */
  // Service
  static async apiCreate(data) {
    const safeData = {
      numero: Number(data.numero || 0),
      titre: data.titre || '',
      type: data.type || '',
      description: data.description || '',

      client_id: Number(data.client_id || 0),
      adresse_facturation_id: Number(data.adresse_facturation_id || 0), // ✅ correct
      client_adresse_id: Number(data.client_adresse_id || 0),
      type_client_adresse: data.type_client_adresse || '',

      priorite: data.priorite || '',
      etat: data.etat || '',

      date_butoir_realisation: data.date_butoir_realisation || null,
      date_cloture_estimee: data.date_cloture_estimee || null,

      mots_cles: data.mots_cles || '',

      montant_intervention: Number(data.montant_intervention || 0),
      montant_main_oeuvre: Number(data.montant_main_oeuvre || 0),
      montant_fournitures: Number(data.montant_fournitures || 0),

      referents: Array.isArray(data.referents) ? data.referents.map(Number) : [],

      createur_id: Number(data.createur_id || null)
    };

    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const insertQuery = `
      INSERT INTO intervention (
        numero,
        titre,
        type,
        description,
        client_id,
        adresse_facturation_id,   -- ✅ correct
        client_adresse_id,
        type_client_adresse,
        priorite,
        etat,
        date_butoir_realisation,
        date_cloture_estimee,
        mots_cles,
        montant_intervention,
        montant_main_oeuvre,
        montant_fournitures,
        createur_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

      const values = [
        safeData.numero,
        safeData.titre,
        safeData.type,
        safeData.description,

        safeData.client_id,
        safeData.adresse_facturation_id, // ✅ correct
        safeData.client_adresse_id,
        safeData.type_client_adresse,

        safeData.priorite,
        safeData.etat,
        safeData.date_butoir_realisation,
        safeData.date_cloture_estimee,

        safeData.mots_cles,
        safeData.montant_intervention,
        safeData.montant_main_oeuvre,
        safeData.montant_fournitures,

        safeData.createur_id
      ];

      const [result] = await connection.query(insertQuery, values);
      const interventionId = result.insertId;

      if (safeData.referents.length > 0) {
        const refValues = safeData.referents.map(refId => [
          interventionId,
          refId,
          safeData.createur_id
        ]);

        await connection.query(
          `INSERT INTO intervention_referent (intervention_id, referent_id, createur_id) VALUES ?`,
          [refValues]
        );
      }

      await connection.commit();
      return { id: interventionId };

    } catch (error) {
      await connection.rollback();
      console.error('❌ Erreur création intervention:', error);
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
 * 🔹 Récupérer toutes les interventions
 */
  static async apiGetAll() {
    try {
      const sql = `SELECT * FROM intervention ORDER BY id DESC`;
      const [rows] = await pool.execute(sql);

      for (const intervention of rows) {
        const interventionId = intervention.id;

        // 🔹 Référents
        const [referents] = await pool.execute(
          `SELECT r.id, r.nom, r.prenom, r.email, r.telephone
         FROM referent r
         JOIN intervention_referent ir ON r.id = ir.referent_id
         WHERE ir.intervention_id = ?`,
          [interventionId]
        );

        intervention.referents = referents.length > 0 ? referents : [];

        // ✅ NOUVEAU : IDs des référents
        intervention.referent_ids = referents.map(r => r.id);

        // 🔹 Techniciens
        const [techniciens] = await pool.execute(
          `SELECT t.id, t.nom, t.prenom, it.role
         FROM technicien t
         JOIN intervention_technicien it ON t.id = it.id_technicien
         WHERE it.id_intervention = ?`,
          [interventionId]
        );

        intervention.techniciens = techniciens.length > 0 ? techniciens : [];
      }

      return rows;
    } catch (err) {
      console.error('Erreur apiGetAll:', err);
      throw err;
    }
  }


  /**
   * 🔹 Modifier une intervention
   */
  static async updateIntervention(id, data) {
    if (!data || Object.keys(data).length === 0) return null;
    const allowedFields = [
      'titre', 'description', 'numero', 'type', 'adresse_facturation',
      'priorite', 'etat', 'date_butoir_realisation', 'date_cloture_estimee', 'mots_cles',
      'montant_intervention', 'montant_main_oeuvre', 'montant_fournitures',
      'date_prevue', 'duree_heures', 'duree_minutes', 'id_affaire',
      'adresse_id', 'client_adresse_id', 'type_client_adresse', 'createur_id'
    ];

    const fields = [];
    const values = [];

    for (const key of allowedFields) {
      if (key in data) {
        const value = data[key];
        fields.push(`${key} = ?`);
        values.push(value !== undefined ? value : null); // Met null si undefined
      }
    }

    if (fields.length === 0) return null;

    const query = `UPDATE intervention SET ${fields.join(', ')} WHERE id = ?`;
    values.push(id);

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // 🔹 Mise à jour de l'intervention
      await connection.query(query, values);

      // 🔹 Récupérer l'intervention mise à jour
      const [updatedRows] = await connection.query('SELECT * FROM intervention WHERE id = ?', [id]);
      const updatedIntervention = updatedRows[0];

      await connection.commit();
      return updatedIntervention;

    } catch (error) {
      await connection.rollback();
      console.error('❌ Erreur updateIntervention:', error);
      throw error;
    } finally {
      connection.release();
    }
  }


  /**
   * 🔹 Supprimer une intervention
   */
  static async apiDeleteById(id) {
    const [result] = await pool.query('DELETE FROM intervention WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  // 🔹 Obtenir le prochain numéro
  static async getNextNumero() {
    try {
      const [rows] = await pool.query(
        "SELECT MAX(numero) AS maxNumero FROM intervention"
      );
      const nextNumero = (rows[0].maxNumero || 0) + 1;
      return nextNumero;
    } catch (error) {
      console.error("Erreur getNextNumero:", error);
      throw error;
    }
  }

  // Assigner des techniciens à une intervention
  static async assignTechniciens(interventionId, techniciens) {
    // Supprimer d'abord les techniciens existants pour cette intervention
    await pool.query('DELETE FROM intervention_technicien WHERE id_intervention = ?', [interventionId]);
    // Ré-affecter les techniciens
    const values = techniciens.map(techId => [interventionId, techId]);
    await pool.query('INSERT INTO intervention_technicien (id_intervention, id_technicien) VALUES ?', [values]);
    return { interventionId, techniciens };
  }

  static async addPlanning(interventionId, planning) {
    const { date, heure } = planning;
    const sql = `
    INSERT INTO intervention_planning (intervention_id, date, heure)
    VALUES (?, ?, ?)
  `;
    await pool.query(sql, [interventionId, date, heure]);
    return { interventionId, date, heure };
  }


}


module.exports = InterventionService;