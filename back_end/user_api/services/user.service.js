const db = require('../db');

class UserService {

  // Récupérer tous les utilisateurs avec toutes les infos du tableau
  static async getAllUsers() {
    try {
      const query = `
        SELECT id, full_name, email, role, is_active, is_online, 
               DATE_FORMAT(derniere_connexion, '%d-%m-%Y %H:%i') AS derniere_connexion 
        FROM users
      `;
      const [rows] = await db.execute(query);
      return rows;
    } catch (error) {
      console.error('Erreur SQL getAllUsers:', error);
      throw error;
    }
  }

  /**
 * Récupère UNIQUEMENT les lignes où le rôle est 'user'
 */
  static async getOnlyUsers() {
    try {
      const query = `
      SELECT 
        id, 
        full_name, 
        email, 
        role, 
        is_active, 
        is_online, 
        DATE_FORMAT(derniere_connexion, '%d-%m-%Y %H:%i') AS derniere_connexion 
      FROM users 
      WHERE role = 'user'
    `;
      const [rows] = await db.execute(query);
      return rows;
    } catch (error) {
      console.error('Erreur SQL getOnlyUsers:', error);
      throw error;
    }
  }

  // Bouton "Ajouter un Utilisateur"
  static async createUser(userData) {
    try {
      const { email, password_hash, full_name, role } = userData;
      const query = `
        INSERT INTO users (email, password_hash, full_name, role, is_active, is_online) 
        VALUES (?, ?, ?, ?, 1, 0)
      `;
      const [result] = await db.execute(query, [email, password_hash, full_name, role || 'user']);
      return result.insertId;
    } catch (error) {
      console.error('Erreur SQL createUser:', error);
      throw error;
    }
  }

  // Bouton "Modifier" (Nom, Email, Rôle)
  static async updateUser(id, updateData) {
    try {
      const { full_name, email, role } = updateData;
      const query = `
        UPDATE users 
        SET full_name = ?, email = ?, role = ? 
        WHERE id = ?
      `;
      const [result] = await db.execute(query, [full_name, email, role, id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Erreur SQL updateUser:', error);
      throw error;
    }
  }

  // Bouton "Bloquer" / "Activer" (Le switch de statut)
  static async toggleStatus(id, isActive) {
    try {
      // isActive doit être un booléen ou 0/1 envoyé par le front-end
      const query = `UPDATE users SET is_active = ? WHERE id = ?`;
      const [result] = await db.execute(query, [isActive ? 1 : 0, id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Erreur SQL toggleStatus:', error);
      throw error;
    }
  }

  /**
   * Réinitialise directement le mot de passe d'un utilisateur par un administrateur
   * @param {number|string} id - L'identifiant de l'utilisateur cible
   * @param {string} newPassword - Le nouveau mot de passe en clair à hacher
   */
  static async updatePassword(id, newPassword) {
    try {
      console.log("*** Bonjour nous sommes dans service ***");
      
      // 1. Hacher directement le nouveau mot de passe de manière sécurisée
      const newPasswordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);

      // 2. Mettre à jour la base de données avec le nouveau hash
      const query = `UPDATE users SET password_hash = ? WHERE id = ?`;
      const [result] = await db.execute(query, [newPasswordHash, id]);

      // Retourne true si une ligne a bien été modifiée, false sinon
      return result.affectedRows > 0;

    } catch (error) {
      console.error('Erreur SQL dans UserService.updatePassword:', error);
      throw error;
    }
  }

  // Bouton "Supprimer"
  static async deleteUser(id) {
    try {
      const query = `DELETE FROM users WHERE id = ?`;
      const [result] = await db.execute(query, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Erreur SQL deleteUser:', error);
      throw error;
    }
  }

  // En-cadré de Droite : "Vue d'ensemble" (Statistiques)
  static async getStats() {
    try {
      const queryActifs = `SELECT COUNT(*) AS actifs FROM users WHERE is_active = 1`;
      const queryBloques = `SELECT COUNT(*) AS bloques FROM users WHERE is_active = 0`;

      const [[resActifs]] = await db.execute(queryActifs);
      const [[resBloques]] = await db.execute(queryBloques);

      return {
        comptesActifs: resActifs.actifs,
        comptesBloques: resBloques.bloques
      };
    } catch (error) {
      console.error('Erreur SQL getStats:', error);
      throw error;
    }
  }
}

module.exports = UserService;