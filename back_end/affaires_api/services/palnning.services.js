const pool = require('../db'); // connexion MySQL2/promise

class PlanningService {

  // 🔹 Ajouter une planification
  // Ajouter / Mettre à jour le planning
  static async addPlanning(interventionId, planning) {
    const {
      date_debut_intervention,
      heure_debut_intervention_h = 0,
      heure_debut_intervention_min = 0,
      date_fin_intervention,
      heure_fin_intervention_h = 0,
      heure_fin_intervention_min = 0,
      temps_trajet_estime_heures = 0,
      temps_trajet_estime_minutes = 0
    } = planning;

    if (!date_debut_intervention) {
      throw new Error('Date début obligatoire');
    }

    // Formater les dates pour MySQL (YYYY-MM-DD)
    const dateDebut = new Date(date_debut_intervention);
    const dateFin = date_fin_intervention ? new Date(date_fin_intervention) : dateDebut;

    // Mettre à jour la table intervention
    const sql = `
    UPDATE intervention
    SET
      date_debut_intervention = ?,
      heure_debut_intervention_h = ?,
      heure_debut_intervention_min = ?,
      date_fin_intervention = ?,
      heure_fin_intervention_h = ?,
      heure_fin_intervention_min = ?,
      temps_trajet_estime_heures = ?,
      temps_trajet_estime_minutes = ?
    WHERE id = ?
  `;

    await pool.query(sql, [
      dateDebut.toISOString().split('T')[0],
      parseInt(heure_debut_intervention_h),
      parseInt(heure_debut_intervention_min),
      dateFin.toISOString().split('T')[0],
      parseInt(heure_fin_intervention_h),
      parseInt(heure_fin_intervention_min),
      parseInt(temps_trajet_estime_heures),
      parseInt(temps_trajet_estime_minutes),
      interventionId
    ]);

    return {
      interventionId,
      date_debut_intervention: dateDebut,
      date_fin_intervention: dateFin,
      heure_debut_intervention_h: parseInt(heure_debut_intervention_h),
      heure_debut_intervention_min: parseInt(heure_debut_intervention_min),
      heure_fin_intervention_h: parseInt(heure_fin_intervention_h),
      heure_fin_intervention_min: parseInt(heure_fin_intervention_min),
      temps_trajet_estime_heures: parseInt(temps_trajet_estime_heures),
      temps_trajet_estime_minutes: parseInt(temps_trajet_estime_minutes)
    };
  }

  static async getAllByUser(userId) {
    try {
      if (!userId) throw new Error('userId manquant');

      const sql = `
      SELECT 
        i.id AS interventionId,
        i.numero AS interventionNumero,
        i.titre AS interventionTitre,
        i.description AS interventionDescription,
        i.type_id AS interventionTypeId,
        it.libelle AS interventionType,
        i.priorite AS interventionPriorite,
        i.etat AS interventionEtat,
        i.montant_intervention AS interventionMontant,
        i.duree_heures AS interventionDureeHeures,
        i.duree_minutes AS interventionDureeMinutes,
        i.date_debut_intervention,
        i.heure_debut_intervention_h,
        i.heure_debut_intervention_min,
        i.date_fin_intervention,
        i.heure_fin_intervention_h,
        i.heure_fin_intervention_min,
        c.id AS clientId,
        c.numero AS clientNumero,
        c.compte AS clientCompte,
        COALESCE(p.nom_complet, a.nom_agence, o.nom_entreprise) AS clientNom,
        CASE
          WHEN p.id IS NOT NULL THEN 'particulier'
          WHEN a.id IS NOT NULL THEN 'agence'
          WHEN o.id IS NOT NULL THEN 'organisation'
          ELSE 'inconnu'
        END AS typeClient,
        z.id AS zoneId,
        z.nom AS zoneNom,
        ad.adresse AS zoneAdresse,
        ad.ville AS zoneVille,
        ad.code_postal AS zoneCodePostal,
        ad.province AS zoneProvince,
        ad.pays AS zonePays
      FROM intervention i
      LEFT JOIN intervention_type it ON it.id = i.type_id
      LEFT JOIN client c ON c.id = i.client_id
      LEFT JOIN particulier p ON p.client_id = c.id
      LEFT JOIN agence a ON a.client_id = c.id
      LEFT JOIN organisation o ON o.client_id = c.id
      LEFT JOIN secteur z ON z.id = i.zone_intervention_client_id
      LEFT JOIN adresse ad ON ad.id = z.adresse_id
      WHERE i.createur_id = ?
      ORDER BY 
        i.date_debut_intervention ASC,
        i.heure_debut_intervention_h ASC,
        i.heure_debut_intervention_min ASC
    `;

      const [rows] = await pool.execute(sql, [userId]);

      const events = rows.map(row => {

        // =========================
        // DATE DEBUT
        // =========================
        let start = null;

        if (row.date_debut_intervention) {

          const year = row.date_debut_intervention.getFullYear();
          const month = String(row.date_debut_intervention.getMonth() + 1).padStart(2, '0');
          const day = String(row.date_debut_intervention.getDate()).padStart(2, '0');

          const hour = String(row.heure_debut_intervention_h || 0).padStart(2, '0');
          const min = String(row.heure_debut_intervention_min || 0).padStart(2, '0');

          start = `${year}-${month}-${day}T${hour}:${min}:00`;
        }

        // =========================
        // DATE FIN
        // =========================
        let end = null;

        if (row.date_fin_intervention) {

          const year = row.date_fin_intervention.getFullYear();
          const month = String(row.date_fin_intervention.getMonth() + 1).padStart(2, '0');
          const day = String(row.date_fin_intervention.getDate()).padStart(2, '0');

          const hour = String(row.heure_fin_intervention_h || 0).padStart(2, '0');
          const min = String(row.heure_fin_intervention_min || 0).padStart(2, '0');

          end = `${year}-${month}-${day}T${hour}:${min}:00`;
        }

        // Si pas de date fin mais start existe → +1h
        if (!end && start) {
          const startDate = new Date(start);
          const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
          end = endDate.toISOString().slice(0, 19);
        }

        return {
          id: row.interventionId,
          title: `#${row.interventionNumero} - ${row.interventionTitre}`,
          start,
          end,
          allDay: false,
          backgroundColor: '#79b7f2',
          borderColor: '#79b7f2',
          textColor: '#fff',
          extendedProps: {
            description: row.interventionDescription,
            type: row.interventionType,
            priorite: row.interventionPriorite,
            etat: row.interventionEtat,
            montant: row.interventionMontant,
            dureeHeures: row.interventionDureeHeures,
            dureeMinutes: row.interventionDureeMinutes,
            client: row.clientId
              ? {
                id: row.clientId,
                numero: row.clientNumero,
                compte: row.clientCompte,
                nom: row.clientNom,
                type: row.typeClient
              }
              : null,
            zone_intervention: row.zoneId
              ? {
                id: row.zoneId,
                nom: row.zoneNom,
                adresse: row.zoneAdresse,
                ville: row.zoneVille,
                codePostal: row.zoneCodePostal,
                province: row.zoneProvince,
                pays: row.zonePays
              }
              : null
          }
        };
      });

      return events;

    } catch (err) {
      console.error("Erreur PlanningService.getAllByUser:", err);
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