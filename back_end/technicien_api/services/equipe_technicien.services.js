const db = require('../db'); // Connexion MySQL (mysql2/promise)

class EquipeTechnicienService {

  // 🟨 Mettre à jour une équipe
  static async updateEquipeById({ id, nom, description, chefId }) {
    await db.execute(
      `UPDATE equipe_technicien 
       SET nom = ?, description = ?, chefId = ? 
       WHERE id = ?`,
      [nom, description || null, chefId || null, id]
    );
    return { id, nom, description, chefId };
  }

  // 🟥 Supprimer une équipe
  static async deleteEquipeById(id) {
    // Supprimer les liens avec technicien_equipe avant de supprimer l'équipe
    await db.execute(`DELETE FROM technicien_equipe WHERE equipeId = ?`, [id]);
    await db.execute(`DELETE FROM equipe_technicien WHERE id = ?`, [id]);
  }

  /** Liste toutes les équipes avec leurs techniciens et chef */
  static async getAllEquipes() {
    const [rows] = await db.query(`
      SELECT 
        eq.id AS equipeId, 
        eq.nom, 
        eq.description, 
        eq.chefId,
        chef.nom AS chefNom,
        chef.prenom AS chefPrenom,
        te.technicienId,
        t.nom AS technicienNom,
        t.prenom AS technicienPrenom,
        te.dateAffectation
      FROM equipe_technicien eq
      LEFT JOIN technicien_equipe te ON te.equipeId = eq.id
      LEFT JOIN technicien t ON t.id = te.technicienId
      LEFT JOIN technicien chef ON chef.id = eq.chefId
      ORDER BY eq.id, t.nom
    `);

    const equipes = [];

    rows.forEach(row => {
      let equipe = equipes.find(e => e.id === row.equipeId);
      if (!equipe) {
        equipe = {
          id: row.equipeId,
          nom: row.nom,
          description: row.description,
          chef: row.chefId
            ? { id: row.chefId, nom: row.chefNom, prenom: row.chefPrenom }
            : null,
          techniciens: []
        };
        equipes.push(equipe);
      }

      if (row.technicienId && row.technicienId !== row.chefId) {
        equipe.techniciens.push({
          id: row.technicienId,
          nom: row.technicienNom,
          prenom: row.technicienPrenom,
          dateAffectation: row.dateAffectation
        });
      }
    });

    return equipes;
  }

  // 🔹 Récupérer les équipes avec pagination + search + filtrage user
  static async getAllEquipesPaginated({ page = 1, limit = 10, search = '', userId = null }) {
    try {
      page = Number(page);
      limit = Number(limit);

      if (!Number.isInteger(page) || page < 1) page = 1;
      if (!Number.isInteger(limit) || limit < 1) limit = 10;

      const offset = (page - 1) * limit;

      /* ===================== WHERE ===================== */
      let whereClause = 'WHERE 1=1';
      const params = [];

      if (search && search.trim() !== '') {
        whereClause += `
        AND (
          e.nom LIKE ?
          OR e.description LIKE ?
        )
      `;
        const keyword = `%${search}%`;
        params.push(keyword, keyword);
      }

      if (userId) {
        whereClause += ' AND e.createur_id = ?';
        params.push(userId);
      }

      /* ===================== EQUIPES ===================== */
      const sqlEquipes = `
      SELECT SQL_CALC_FOUND_ROWS
        e.id,
        e.nom,
        e.description,
        e.chefId,
        e.createur_id,
        e.date_creation,
        e.date_modification
      FROM equipe_technicien e
      ${whereClause}
      ORDER BY e.id DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

      const [equipes] = await db.query(sqlEquipes, params);

      /* ===================== TOTAL ===================== */
      const [[{ total }]] = await db.query(
        'SELECT FOUND_ROWS() AS total'
      );

      if (equipes.length === 0) {
        return { total, data: [] };
      }

      /* ===================== TECHNICIENS ===================== */
      const equipeIds = equipes.map(e => e.id);

      const sqlTechniciens = `
      SELECT
        te.equipeId,
        t.id,
        t.nom,
        t.prenom,
        te.dateAffectation
      FROM technicien_equipe te
      JOIN technicien t ON t.id = te.technicienId
      WHERE te.equipeId IN (?)
      ORDER BY t.nom
    `;

      const [techniciens] = await db.query(sqlTechniciens, [equipeIds]);

      /* ===================== GROUPING ===================== */
      const techMap = {};

      techniciens.forEach(t => {
        if (!techMap[t.equipeId]) {
          techMap[t.equipeId] = [];
        }

        techMap[t.equipeId].push({
          id: t.id,
          nom: t.nom,
          prenom: t.prenom,
          dateAffectation: t.dateAffectation
        });
      });

      const data = equipes.map(e => ({
        ...e,
        techniciens: techMap[e.id] || []
      }));

      return {
        total,
        data
      };

    } catch (err) {
      console.error('Erreur getAllEquipesPaginated:', err);
      throw err;
    }
  }

  /** Récupère une équipe par ID */
  static async getEquipeById(id) {
    const [rows] = await db.query(`
      SELECT eq.id AS equipeId, eq.nom, eq.description, eq.chefId,
             te.technicienId, t.nom AS technicienNom, t.prenom AS technicienPrenom,
             te.dateAffectation
      FROM equipe_technicien eq
      LEFT JOIN technicien_equipe te ON te.equipeId = eq.id
      LEFT JOIN technicien t ON t.id = te.technicienId
      WHERE eq.id = ?
    `, [id]);

    if (rows.length === 0) return null;

    const equipe = {
      id: rows[0].equipeId,
      nom: rows[0].nom,
      description: rows[0].description,
      chef: null,
      techniciens: []
    };

    rows.forEach(row => {
      if (row.technicienId) {
        const tech = {
          id: row.technicienId,
          nom: row.technicienNom,
          prenom: row.technicienPrenom,
          dateAffectation: row.dateAffectation
        };
        if (row.technicienId === row.chefId) equipe.chef = tech;
        else equipe.techniciens.push(tech);
      }
    });

    return equipe;
  }

  /** Crée une nouvelle équipe */
  static async createEquipe({ nom, description, chefId, createur_id }) {
    const [result] = await db.query(
      'INSERT INTO equipe_technicien (nom, description, chefId, createur_id) VALUES (?, ?, ?, ?)',
      [nom, description, chefId, createur_id]
    );
    return { id: result.insertId, nom, description, chefId, createur_id };
  }

  /** Service : ajoute un technicien à une équipe avec date d'affectation */
  static async addTechnicienToEquipe(equipeId, { technicienId, createur_id }) {
    // Insertion avec dateAffectation automatique et createur_id
    await db.query(
      `INSERT INTO technicien_equipe (technicienId, equipeId, createur_id, dateAffectation) 
     VALUES (?, ?, ?, CURRENT_TIMESTAMP)
     ON DUPLICATE KEY UPDATE dateAffectation = CURRENT_TIMESTAMP`,
      [technicienId, equipeId, createur_id]
    );

    return { technicienId, equipeId, createur_id };
  }

  /** Retire un technicien d’une équipe */
  static async removeTechnicienFromEquipe(technicienId, equipeId) {
    await db.query(
      'DELETE FROM technicien_equipe WHERE technicienId = ? AND equipeId = ?',
      [technicienId, equipeId]
    );
    return { technicienId, equipeId };
  }

  /** Change le chef d’une équipe */
  static async changeChef(equipeId, chefId) {
    await db.query(
      'UPDATE equipe_technicien SET chefId = ? WHERE id = ?',
      [chefId, equipeId]
    );
    return { equipeId, chefId };
  }

}

module.exports = EquipeTechnicienService;