const db = require("../db");

class HabitationService {

    static async createRecord(record) {
        const query = `
            INSERT INTO habitation 
            (reference, surface, adresse_id, secteur_id, agence_id, organisation_id, particulier_id)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.execute(query, [
            record.reference, record.surface, record.adresse_id, record.secteur_id,
            record.agence_id, record.organisation_id, record.particulier_id
        ]);
        return { id: result.insertId, ...record };
    }

    static async updateRecordById(record) {
        const query = `
            UPDATE habitation SET 
                reference = ?, 
                surface = ?, 
                adresse_id = ?, 
                secteur_id = ?, 
                agence_id = ?, 
                organisation_id = ?, 
                particulier_id = ? 
            WHERE id = ?
        `;
        await db.execute(query, [
            record.reference, record.surface, record.adresse_id, record.secteur_id,
            record.agence_id, record.organisation_id, record.particulier_id,
            record.id
        ]);
        return { message: `Habitation ID ${record.id} mise à jour avec succès.` };
    }

    static async deleteRecordById(id) {
        const query = `DELETE FROM habitation WHERE id = ?`;
        await db.execute(query, [id]);
        return { message: `Habitation ID ${id} supprimé avec succès.` };
    }

    static async getAllRecords() {
        const query = `SELECT * FROM habitation`;
        const [rows] = await db.execute(query);
        return rows;
    }

    static async getRecordById(id) {
        const query = `SELECT * FROM habitation WHERE id = ?`;
        const [rows] = await db.execute(query, [id]);
        return rows[0];
    }

    static async updateRecordNote(id, note) {
        try {
            const [result] = await db.execute(
                `UPDATE habitation SET note = ?, date_modification = NOW() WHERE id = ?`,
                [note, id]
            );

            return {
                success: true,
                affectedRows: result.affectedRows
            };
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la note:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    static async getRecordDetails(id) {
        if (!id) return { data: null };

        try {
            // 🔹 Récupérer l'habitation avec son adresse
            const [rows] = await db.query(`
      SELECT
        h.id,
        h.reference,
        h.surface,
        h.note,
        h.adresse_id,
        h.secteur_id,
        h.agence_id,
        h.organisation_id,
        h.particulier_id,
        h.date_creation,
        h.date_modification,
        ad.adresse,
        ad.code_postal,
        ad.ville,
        ad.province,
        ad.pays,
        ad.etage,
        ad.appartement_local,
        ad.batiment,
        ad.interphone_digicode,
        ad.escalier,
        ad.porte_entree
      FROM habitation h
      LEFT JOIN adresse ad ON ad.id = h.adresse_id
      WHERE h.id = ?
    `, [id]);

            if (!rows.length) return { data: null };

            const h = rows[0];

            const data = {
                id: h.id,
                reference: h.reference,
                surface: h.surface,
                note: h.note,
                adresse_id: h.adresse_id,
                secteur_id: h.secteur_id,
                agence_id: h.agence_id,
                organisation_id: h.organisation_id,
                particulier_id: h.particulier_id,
                date_creation: h.date_creation,
                date_modification: h.date_modification,
                adresse: {
                    id: h.adresse_id,
                    adresse: h.adresse,
                    code_postal: h.code_postal,
                    ville: h.ville,
                    province: h.province,
                    pays: h.pays,
                    etage: h.etage,
                    appartement_local: h.appartement_local,
                    batiment: h.batiment,
                    interphone_digicode: h.interphone_digicode,
                    escalier: h.escalier,
                    porte_entree: h.porte_entree
                }
            };

            return { data }; // ✅ résultat dans "data"

        } catch (error) {
            console.error('Erreur lors de la récupération de l’habitation :', error);
            return { data: null, error: error.message };
        }
    }




}

module.exports = HabitationService;