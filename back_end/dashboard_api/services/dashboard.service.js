const db = require("../db");

class DashboardService {
    // Insérer un nouveau tableau de bord
    async create(data) {
        console.log("**** Bonjour tous le monde ! ****");
        
        const query = 'INSERT INTO dashboards (user_id, name) VALUES (?, ?)';
        const [result] = await db.execute(query, [data.userId, data.name]);
        return result;
    }

    // Récupérer les tableaux de bord d'un utilisateur spécifié
    async getByUserId(userId) {
        const query = 'SELECT * FROM dashboards WHERE user_id = ? ORDER BY created_at DESC';
        const [rows] = await db.execute(query, [userId]);
        return rows;
    }

    // Supprimer un tableau de bord (La clé étrangère supprimera les widgets via ON DELETE CASCADE)
    async delete(id) {
        const query = 'DELETE FROM dashboards WHERE id = ?';
        const [result] = await db.execute(query, [id]);
        return result;
    }

    // ===================================================
    //  GESTION DES WIDGETS (VIGNETTES)
    // ===================================================

    // Insérer un nouveau widget dans la base de données
    async createWidget(widgetData) {
        const query = `
            INSERT INTO widgets (dashboard_id, title, category, display_type, color, data_type, filters) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.execute(query, [
            widgetData.dashboard_id,
            widgetData.title,
            widgetData.category,
            widgetData.display_type,
            widgetData.color || '#3f51b5',
            widgetData.data_type || widgetData.category,
            widgetData.filters || '{}'
        ]);
        return result;
    }

    // Récupérer l'ensemble des widgets liés à un tableau de bord spécifique
    async getWidgetsByDashboardId(dashboardId) {
        const query = 'SELECT * FROM widgets WHERE dashboard_id = ?';
        const [rows] = await db.execute(query, [dashboardId]);
        return rows;
    }
}

module.exports = new DashboardService();