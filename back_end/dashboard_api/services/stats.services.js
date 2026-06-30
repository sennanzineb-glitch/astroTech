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

        // =========================================================================
        // 1. GESTION DES COMPTEURS NUMÉRIQUES (Nombre)
        // =========================================================================
        if (display_type === 'number') {
            let query = '';
            const queryParams = [];

            // --- SOUS-CATÉGORIE : AFFAIRE ---
            if (category === 'affaire') {
                if (data_type === 'technicien') {
                    // COMPTEUR : Nombre total de techniciens uniques assignés à des affaires
                    query = `
                        SELECT COUNT(DISTINCT id) as total 
                        FROM users 
                        WHERE role = 'technicien' OR role = 'user'
                    `;
                } else {
                    // Compteur global de secours pour les affaires
                    query = `SELECT COUNT(*) as total FROM affaire WHERE 1=1`;
                }
            } 
            // --- SOUS-CATÉGORIE : INTERVENTION ---
            else {
                if (data_type === 'technicien' || data_type === 'technicien_prevu') {
                    query = `
                        SELECT COUNT(DISTINCT id) as total 
                        FROM users 
                        WHERE role = 'technicien' OR role = 'user'
                    `;
                } else {
                    query = `SELECT COUNT(*) as total FROM intervention WHERE 1=1`;
                    
                    if (data_type && !['all', 'intervention', 'zone', 'etat'].includes(data_type)) {
                        query += ` AND type_id = ?`; 
                        queryParams.push(data_type);
                    }
                    if (filters && filters.status) {
                        query += ` AND etat = ?`;
                        queryParams.push(filters.status);
                    }
                }
            }

            const [rows] = await db.execute(query, queryParams);
            return { value: rows[0].total };
        }

        // =========================================================================
        // 2. GESTION DES GRAPHIQUES POUR LES INTERVENTIONS (Pie, Bar, Line)
        // =========================================================================
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
                    query = `
                        SELECT DATE_FORMAT(date_creation, '%Y-%m-%d') as label, COUNT(id) as value
                        FROM intervention
                        GROUP BY DATE_FORMAT(date_creation, '%Y-%m-%d')
                        ORDER BY label ASC
                    `;
                    break;

                case 'date_intervention':
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

        // =========================================================================
        // 3. CODE BACKEND : GRAPHIQUES POUR LES AFFAIRES (Pie, Bar, Line)
        // =========================================================================
        if (category === 'affaire' && display_type !== 'number') {
            let query = '';

            switch (data_type) {
                case 'client':
                    // Volume d'affaires par entreprise / organisation associée
                    query = `
                        SELECT IFNULL(o.nom_entreprise, 'Sans Organisation') as label, COUNT(a.id) as value
                        FROM affaire a
                        LEFT JOIN organisation o ON a.client_id = o.client_id
                        GROUP BY a.client_id, o.nom_entreprise
                    `;
                    break;

                case 'etat':
                    // Volume d'affaires regroupé par Statut / État
                    query = `
                        SELECT IFNULL(a.etat, 'Non spécifié') as label, COUNT(a.id) as value 
                        FROM affaire a
                        GROUP BY a.etat
                    `;
                    break;

                case 'date_cloture_estime':
                    // Évolution ou répartition par date de clôture estimée
                    query = `
                        SELECT DATE_FORMAT(a.date_cloture_estime, '%Y-%m-%d') as label, COUNT(a.id) as value
                        FROM affaire a
                        WHERE a.date_cloture_estime IS NOT NULL
                        GROUP BY DATE_FORMAT(a.date_cloture_estime, '%Y-%m-%d')
                        ORDER BY label ASC
                    `;
                    break;

                case 'referent':
                    // Volume d'affaires par référent / chargé d'affaires
                    query = `
                        SELECT CONCAT(r.nom, ' ', r.prenom) as label, COUNT(ar.affaire_id) as value
                        FROM affaire_referent ar
                        JOIN referent r ON ar.referent_id = r.id
                        GROUP BY r.id, r.nom, r.prenom
                    `;
                    break;

                case 'createur':
                    // Volume d'affaires par utilisateur créateur
                    query = `
                        SELECT u.full_name as label, COUNT(a.id) as value
                        FROM affaire a
                        JOIN users u ON a.createur_id = u.id
                        GROUP BY u.id, u.full_name
                    `;
                    break;

                case 'date_creation':
                    // Flux d'affaires selon la date de création de l'enregistrement
                    query = `
                        SELECT DATE_FORMAT(a.date_creation, '%Y-%m-%d') as label, COUNT(a.id) as value
                        FROM affaire a
                        GROUP BY DATE_FORMAT(a.date_creation, '%Y-%m-%d')
                        ORDER BY label ASC
                    `;
                    break;

                default:
                    // Fallback par défaut si l'axe n'est pas identifié
                    query = `SELECT IFNULL(a.etat, 'Global') as label, COUNT(a.id) as value FROM affaire a GROUP BY a.etat`;
                    break;
            }

            const [rows] = await db.execute(query);
            return rows;
        }

        return { value: 0 };
    }
}

module.exports = new StatsService();