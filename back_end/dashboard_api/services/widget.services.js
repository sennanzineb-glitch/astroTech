const db = require("../db");

class WidgetService {
    // Enregistrer les configurations du widget en base de données
    async createWidget(widgetData) {
        const { dashboardId, title, category, data_type, display_type, color, filters } = widgetData;
        
        const query = `
            INSERT INTO dashboard_widgets (dashboard_id, title, category, data_type, display_type, color, filters)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        
        // Sérialisation des filtres au format texte JSON pour MySQL
        const serializedFilters = filters ? JSON.stringify(filters) : null;
        const values = [dashboardId, title, category, data_type, display_type, color, serializedFilters];
        
        const [result] = await db.execute(query, values);
        return result;
    }

    // Récupérer les widgets d'un tableau de bord en désérialisant les filtres textuels en objets JS
    async getWidgetsByDashboardId(dashboardId) {
        const query = 'SELECT * FROM dashboard_widgets WHERE dashboard_id = ?';
        const [rows] = await db.execute(query, [dashboardId]);
        
        // Mapping pour s'assurer de la correspondance exacte des clés avec l'interface Angular
        return rows.map(row => ({
            id: row.id,
            dashboardId: row.dashboard_id,
            title: row.title,
            category: row.category,
            data_type: row.data_type,
            display_type: row.display_type,
            color: row.color,
            filters: row.filters ? JSON.parse(row.filters) : {},
            created_at: row.created_at
        }));
    }

    // Supprimer un widget de la table par son identifiant unique
    async deleteWidget(widgetId) {
        const query = 'DELETE FROM dashboard_widgets WHERE id = ?';
        const [result] = await db.execute(query, [widgetId]);
        return result;
    }
}

module.exports = new WidgetService();