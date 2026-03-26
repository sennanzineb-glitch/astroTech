const db = require('../db'); // connexion MySQL2/promise

class DashboardService {


  // static async getDashboardInterventions() {
  //   const sql = `
  //   SELECT
  //     ti.id AS type_id,
  //     ti.categorie,
  //     ti.libelle AS type,
  //     i.etat AS etat_original,
  //     i.date_debut_intervention,
  //     CASE
  //       WHEN LOWER(i.etat) LIKE 'terminee_avec_succes%' THEN 'TERMINE'
  //       WHEN LOWER(i.etat) LIKE '%cours%' THEN 'EN_COURS'
  //       ELSE 'AUTRE'
  //     END AS etat,
  //     COUNT(*) AS total
  //   FROM intervention i
  //   JOIN intervention_type ti ON ti.id = i.type_id
  //   WHERE ti.actif = 1
  //     AND i.archive = 0
  //   GROUP BY
  //     ti.id,
  //     ti.categorie,
  //     ti.libelle,
  //     i.etat,
  //     i.date_debut_intervention
  //   ORDER BY
  //     ti.categorie,
  //     ti.libelle;
  // `;

  //   const [rows] = await db.query(sql);

  //   const dashboard = {};

  //   for (const row of rows) {
  //     const { categorie, type, type_id, etat, total, etat_original, date_debut_intervention } = row;

  //     // ignorer les terminees avec interruption
  //     if (etat_original.toLowerCase().includes('interruption')) continue;

  //     // si date_debut_intervention est définie, considérer PLANIFIE
  //     const finalEtat = date_debut_intervention ? 'PLANIFIE' : etat;

  //     if (finalEtat === 'AUTRE') continue;

  //     if (!dashboard[categorie]) {
  //       dashboard[categorie] = {};
  //     }

  //     if (!dashboard[categorie][type]) {
  //       dashboard[categorie][type] = {
  //         type_id,
  //         PLANIFIE: 0,
  //         EN_COURS: 0,
  //         TERMINE: 0,
  //         etat_original: null
  //       };
  //     }

  //     dashboard[categorie][type][finalEtat] += total;

  //     // garder seulement la dernière valeur
  //     dashboard[categorie][type].etat_original = etat_original;
  //   }

  //   return dashboard;
  // }

  static async getDashboardInterventions() {

  const sql = `
    SELECT
      ti.id AS type_id,
      ti.categorie,
      ti.libelle AS type,

      SUM(CASE WHEN i.date_debut_intervention IS NOT NULL THEN 1 ELSE 0 END) AS PLANIFIE,
      SUM(CASE WHEN i.date_debut_intervention IS NULL AND LOWER(i.etat) LIKE '%cours%' THEN 1 ELSE 0 END) AS EN_COURS,
      SUM(CASE WHEN i.date_debut_intervention IS NULL AND LOWER(i.etat) LIKE 'terminee_avec_succes%' THEN 1 ELSE 0 END) AS TERMINE,
      COUNT(*) AS TOTAL

    FROM intervention i
    JOIN intervention_type ti ON ti.id = i.type_id

    WHERE ti.actif = 1
      AND i.archive = 0
      -- ignore "terminee_avec_interruption" seulement si date_debut_intervention IS NULL
      AND NOT (i.date_debut_intervention IS NULL AND LOWER(i.etat) LIKE 'terminee_avec_interruption%')

    GROUP BY ti.id, ti.categorie, ti.libelle
    ORDER BY ti.categorie, ti.libelle
  `;

  const [rows] = await db.query(sql);

  // Transformation pour Angular dashboard
  const dashboard = {};

  for (const row of rows) {
    const { categorie, type, type_id, PLANIFIE, EN_COURS, TERMINE, TOTAL } = row;

    if (!dashboard[categorie]) dashboard[categorie] = {};

    dashboard[categorie][type] = {
      type_id,
      PLANIFIE,
      EN_COURS,
      TERMINE,
      TOTAL
    };
  }

  return dashboard;
}
  

}

module.exports = DashboardService;