const pool = require('../db'); // connexion MySQL2/promise

class PlanningService {

  // 🔹 Ajouter une planification
  static async addPlanning(interventionId, planning) {
    const { date, heure } = planning;
    if (!date || !heure) throw new Error('Date et heure obligatoires');

    const sql = 'INSERT INTO intervention_planning (intervention_id, date, heure) VALUES (?, ?, ?)';
    const [result] = await pool.query(sql, [interventionId, date, heure]);

    return {
      id: result.insertId,
      interventionId,
      date,
      heure
    };
  }

  // services/planning.service.js
  static async getAllByUser(userId) {
    try {
      if (!userId) throw new Error('userId manquant');

      const sql = `
      SELECT 
        p.id AS planningId,
        p.intervention_id AS interventionId,
        p.date AS planningDate,
        p.heure AS planningHeure,

        i.titre AS interventionTitre,
        i.description AS interventionDescription,
        i.numero AS interventionNumero,
        i.type AS interventionType,
        i.priorite AS interventionPriorite,
        i.etat AS interventionEtat,
        i.date_butoir_realisation AS interventionDateButoir,
        i.date_cloture_estimee AS interventionDateClotureEstimee,
        i.mots_cles AS interventionMotsCles,
        i.montant_intervention AS interventionMontant,
        i.montant_main_oeuvre AS interventionMainOeuvre,
        i.montant_fournitures AS interventionFournitures,
        i.date_prevue AS interventionDatePrevue,
        i.duree_heures AS interventionDureeHeures,
        i.duree_minutes AS interventionDureeMinutes,
        i.id_affaire AS interventionAffaireId,
        i.createur_id AS interventionCreateurId,
        i.date_creation AS interventionDateCreation,
        i.date_modification AS interventionDateModification,

        c.id AS clientId,
        c.numero AS clientNumero,
        c.compte AS clientCompte

      FROM intervention_planning p
      INNER JOIN intervention i ON i.id = p.intervention_id
      LEFT JOIN affaire a ON a.id = i.id_affaire
      LEFT JOIN client c ON c.id = a.client_id

      WHERE i.createur_id = ?
      ORDER BY p.date ASC, p.heure ASC
    `;

      const [rows] = await pool.query(sql, [userId]);
      return rows;

    } catch (err) {
      console.error('Erreur PlanningService.getAllByUser:', err);
      throw err;
    }
  }


  // 🔹 Modifier une planification
  static async updatePlanning(id, planning) {
    const { date, heure } = planning;
    if (!date || !heure) throw new Error('Date et heure obligatoires');

    const sql = 'UPDATE intervention_planning SET date = ?, heure = ? WHERE id = ?';
    await pool.query(sql, [date, heure, id]);

    const [updated] = await pool.query('SELECT * FROM intervention_planning WHERE id = ?', [id]);
    return updated[0];
  }

  // 🔹 Supprimer une planification
  static async deletePlanning(id) {
    const sql = 'DELETE FROM intervention_planning WHERE id = ?';
    const [result] = await pool.query(sql, [id]);
    return result.affectedRows > 0;
  }
}

module.exports = PlanningService;