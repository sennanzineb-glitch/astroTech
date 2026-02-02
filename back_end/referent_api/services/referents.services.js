const db = require('../db');

class ReferentService {

  static async createRecord(record) {

    const query = `
      INSERT INTO referent 
      (nom, prenom, telephone, email, dateNaissance, poste, adresse, createur_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.execute(query, [
      record.nom,
      record.prenom,
      record.telephone,
      record.email,
      record.dateNaissance,
      record.poste,
      record.adresse,
      record.createur_id
    ]);
    return { id: result.insertId, ...record };
  }

  static async apiGetAllWithPaginated({ page = 1, limit = 10, search = '', userId = null }) {
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
          r.nom LIKE ?
          OR r.prenom LIKE ?
          OR r.email LIKE ?
        )
      `;
        const keyword = `%${search}%`;
        params.push(keyword, keyword, keyword);
      }

      if (userId) {
        whereClause += ' AND r.createur_id = ?';
        params.push(userId);
      }

      /* ===================== QUERY REFERENTS ===================== */
      const referentsSql = `
      SELECT r.id AS referentId,
             r.nom,
             r.prenom,
             r.email,
             r.telephone
      FROM referent r
      ${whereClause}
      ORDER BY r.id DESC
      LIMIT ? OFFSET ?
    `;

      const referentsParams = [...params, limit, offset];
      const [referentRows] = await db.query(referentsSql, referentsParams);

      // Si aucun référent, retourner vide
      if (referentRows.length === 0) return { total: 0, data: [] };

      const referentIds = referentRows.map(r => r.referentId);

      /* ===================== QUERY FICHIERS ===================== */
      const fichiersSql = `
      SELECT id AS fichierId, nom AS fichierNom, chemin AS fichierChemin, idReferent
      FROM fichier
      WHERE idReferent IN (?)
    `;
      const [fichierRows] = await db.query(fichiersSql, [referentIds]);

      /* ===================== TOTAL ===================== */
      const [[{ total }]] = await db.query(
        `SELECT COUNT(*) AS total FROM referent r ${whereClause}`, params
      );

      /* ===================== ASSEMBLER ===================== */
      const referentsMap = new Map();

      referentRows.forEach(r => {
        referentsMap.set(r.referentId, {
          id: r.referentId,
          nom: r.nom,
          prenom: r.prenom,
          email: r.email,
          telephone: r.telephone,
          fichiers: []
        });
      });

      fichierRows.forEach(f => {
        const ref = referentsMap.get(f.idReferent);
        if (ref) {
          ref.fichiers.push({
            id: f.fichierId,
            nom: f.fichierNom,
            chemin: f.fichierChemin
          });
        }
      });

      return {
        total,
        data: Array.from(referentsMap.values())
      };

    } catch (err) {
      console.error('Erreur apiGetAllWithPaginated:', err);
      throw err;
    }
  }


  static async updateRecordById(record, id) {
    const query = `
      UPDATE referent 
      SET nom = ?, prenom = ?, telephone = ?, email = ?, dateNaissance = ?, adresse = ?, poste = ?
      WHERE id = ?
    `;
    await db.execute(query, [
      record.nom,
      record.prenom,
      record.telephone,
      record.email,
      record.dateNaissance,
      record.adresse,
      record.poste,
      id,
    ]);
    return { message: `Référent (${id}) mis à jour avec succès.` };
  }

  static async deleteRecordById(id) {
    const query = `DELETE FROM referent WHERE id = ?`;
    await db.execute(query, [id]);
    return { message: `L'identifiant (${id}) est supprimé avec succès.` };
  }

  static async getAllRecords() {
    // 1️⃣ Récupérer référents et fichiers avec LEFT JOIN
    const query = `
    SELECT r.id AS referentId, r.nom, r.prenom, r.email, r.telephone,
           f.id AS fichierId, f.nom AS fichierNom, f.chemin AS fichierChemin
    FROM referent r
    LEFT JOIN fichier f ON f.idReferent = r.id
    ORDER BY r.id, f.id
  `;
    const [rows] = await db.execute(query);

    // 2️⃣ Organiser les fichiers par référent
    const referentsMap = new Map();
    rows.forEach(row => {
      if (!referentsMap.has(row.referentId)) {
        referentsMap.set(row.referentId, {
          id: row.referentId,
          nom: row.nom,
          prenom: row.prenom,
          email: row.email,
          telephone: row.telephone,
          fichiers: []
        });
      }

      if (row.fichierId) {
        referentsMap.get(row.referentId).fichiers.push({
          id: row.fichierId,       // ✅ Ajouter l’ID du fichier
          nom: row.fichierNom,
          chemin: row.fichierChemin
        });
      }
    });

    // 3️⃣ Retourner le résultat sous forme de tableau
    return Array.from(referentsMap.values());
  }

  static async getRecordById(id) {
    const query = `SELECT * FROM referent WHERE id = ?`;
    const [rows] = await db.execute(query, [id]);
    return rows[0] || null;
  }

}

module.exports = ReferentService;
