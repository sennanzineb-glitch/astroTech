const db = require("../db");

class StatsService {
    /**
     * Regroupe les résultats de calcul pour l'ensemble des widgets d'un tableau de bord
     */
    async calculateStatsForWidgets(widgets) {
        const statsResults = {};
        for (const widget of widgets) {
            statsResults[widget.id] = await this.getWidgetData(widget);
        }
        return statsResults;
    }

    /**
     * Calcule les données précises d'un widget selon son axe (data_type)
     */
    async getWidgetData(widget) {
        const { category, display_type, data_type, filters } = widget;

        // 1. GESTION DES COMPTEURS NUMÉRIQUES (Nombre)
        if (display_type === 'number') {
            let query = '';
            const queryParams = [];

            // COMPTEUR : Nombre total de techniciens uniques
            if (data_type === 'technicien' || data_type === 'technicien_prevu') {
                query = `
                    SELECT COUNT(DISTINCT id) as total 
                    FROM users 
                    WHERE role = 'technicien' OR role = 'user'
                `;
            } 
            // COMPTEUR PAR DÉFAUT : Interventions
            else {
                query = `SELECT COUNT(*) as total FROM intervention WHERE 1=1`;
                
                if (category === 'intervention' && data_type && !['all', 'intervention', 'zone', 'etat'].includes(data_type)) {
                    query += ` AND type_id = ?`; 
                    queryParams.push(data_type);
                }
                if (filters && filters.status) {
                    query += ` AND etat = ?`;
                    queryParams.push(filters.status);
                }
            }

            const [rows] = await db.execute(query, queryParams);
            return { value: rows[0].total };
        }

        // 2. GESTION DES GRAPHIQUES (Pie, Bar, Line)
        if (category === 'intervention' && display_type !== 'number') {
            let query = '';
            
            switch (data_type) {
                case 'client':
                    query = `
                        SELECT IFNULL(o.nom_entreprise, 'Particuliers / Inconnus') as label, COUNT(i.id) as value
                        FROM intervention i
                        LEFT JOIN organisation o ON i.client_id = o.client_id
                        GROUP BY i.client_id, o.nom_entreprise
                    `;
                    break;

                case 'zone':
                    query = `
                        SELECT a.nom_agence as label, COUNT(i.id) as value 
                        FROM intervention i
                        JOIN agence a ON i.zone_intervention_client_id = a.id
                        GROUP BY a.id, a.nom_agence
                    `;
                    break;

                case 'technicien':
                    query = `
                        SELECT e.nom as label, COUNT(i.id) as value 
                        FROM intervention i
                        JOIN equipe_technicien e ON i.equipe_id = e.id
                        GROUP BY e.id, e.nom
                    `;
                    break;

                case 'technicien_prevu':
                    query = `
                        SELECT u.full_name as label, COUNT(it.id_intervention) as value
                        FROM intervention_technicien it
                        JOIN users u ON it.id_technicien = u.id
                        GROUP BY u.id, u.full_name
                    `;
                    break;

                case 'referent':
                    query = `
                        SELECT CONCAT(r.nom, ' ', r.prenom) as label, COUNT(ir.intervention_id) as value
                        FROM intervention_referent ir
                        JOIN referent r ON ir.referent_id = r.id
                        GROUP BY r.id, r.nom, r.prenom
                    `;
                    break;

                case 'createur':
                    query = `
                        SELECT u.full_name as label, COUNT(i.id) as value
                        FROM intervention i
                        JOIN users u ON i.createur_id = u.id
                        GROUP BY u.id, u.full_name
                    `;
                    break;

                case 'type':
                    query = `
                        SELECT t.libelle as label, COUNT(i.id) as value
                        FROM intervention i
                        JOIN intervention_type t ON i.type_id = t.id
                        GROUP BY t.id, t.libelle
                    `;
                    break;

                case 'date_creation':
                    // CORRIGÉ : On groupe exactement par la même fonction DATE_FORMAT ou l'alias de colonne
                    query = `
                        SELECT DATE_FORMAT(date_creation, '%Y-%m-%d') as label, COUNT(id) as value
                        FROM intervention
                        GROUP BY DATE_FORMAT(date_creation, '%Y-%m-%d')
                        ORDER BY label ASC
                    `;
                    break;

                case 'date_intervention':
                    // CORRIGÉ : Harmonisation entre SELECT et GROUP BY pour éviter l'erreur ONLY_FULL_GROUP_BY
                    query = `
                        SELECT DATE_FORMAT(date_debut_intervention, '%Y-%m-%d') as label, COUNT(id) as value
                        FROM intervention
                        WHERE date_debut_intervention IS NOT NULL
                        GROUP BY DATE_FORMAT(date_debut_intervention, '%Y-%m-%d')
                        ORDER BY label ASC
                    `;
                    break;

                case 'date_prevue':
                    query = `
                        SELECT DATE_FORMAT(date_prevue, '%Y-%m-%d') as label, COUNT(id) as value
                        FROM intervention
                        WHERE date_prevue IS NOT NULL
                        GROUP BY DATE_FORMAT(date_prevue, '%Y-%m-%d')
                        ORDER BY label ASC
                    `;
                    break;

                case 'etat':
                default:
                    query = `
                        SELECT IFNULL(etat, 'Non spécifié') as label, COUNT(id) as value 
                        FROM intervention 
                        GROUP BY etat
                    `;
                    break;
            }

            const [rows] = await db.execute(query);
            return rows; 
        }

        return { value: 0 };
    }
}

module.exports = new StatsService();