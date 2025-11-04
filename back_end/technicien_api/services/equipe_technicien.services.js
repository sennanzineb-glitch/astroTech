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
  static async createEquipe({ nom, description, chefId }) {
    const [result] = await db.query(
      'INSERT INTO equipe_technicien (nom, description, chefId) VALUES (?, ?, ?)',
      [nom, description, chefId]
    );
    return { id: result.insertId, nom, description, chefId };
  }

  /** Ajoute un technicien à une équipe avec date affectation */
  static async addTechnicienToEquipe(equipeId, technicienId) {
    await db.query(
      `INSERT INTO technicien_equipe (technicienId, equipeId) 
       VALUES (?, ?) 
       ON DUPLICATE KEY UPDATE dateAffectation = CURRENT_TIMESTAMP`,
      [technicienId, equipeId]
    );
    return { technicienId, equipeId };
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