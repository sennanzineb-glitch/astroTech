const widgetService = require('../services/widget.services');
const statsService = require('../services/stats.services');

// Créer un widget à l'intérieur d'un tableau de bord défini
exports.createWidget = async (req, res) => {
    try {
        const { dashboardId } = req.params;
        const { title, category, data_type, display_type, color, filters } = req.body;
        
        // Validation des champs obligatoires requis par le formulaire Angular
        if (!title || !category || !display_type) {
            return res.status(400).json({ message: "Champs obligatoires manquants." });
        }

        // Insertion du widget via le service
        const result = await widgetService.createWidget({
            dashboardId: parseInt(dashboardId), 
            title, 
            category, 
            data_type: data_type || 'all', // Valeur 'all' par défaut si non spécifiée
            display_type, 
            color: color || '#3f51b5', 
            filters
        });
        
        // Retourne le format attendu par Angular pour l'insertion immédiate dans la liste
        return res.status(201).json({ 
            id: result.insertId, 
            dashboard_id: parseInt(dashboardId),
            title,
            category,
            data_type: data_type || 'all',
            display_type,
            color: color || '#3f51b5',
            message: "Vignette ajoutée avec succès." 
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Récupérer la structure et la configuration des widgets d'un tableau de bord
exports.getWidgetsByDashboard = async (req, res) => {
    try {
        const { dashboardId } = req.params;
        const widgets = await widgetService.getWidgetsByDashboardId(parseInt(dashboardId));
        return res.status(200).json(widgets);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Récupérer les statistiques réelles et dynamiques de chaque widget
exports.getDashboardStats = async (req, res) => {
    try {
        const { dashboardId } = req.params;
        
        // 1. Récupération des configurations et filtres de tous les widgets de la base
        const widgets = await widgetService.getWidgetsByDashboardId(parseInt(dashboardId));

        // 2. Calcul des valeurs ou des données graphiques (Pie, Bar, Line) via le service de statistiques
        const dashboardStats = await statsService.calculateStatsForWidgets(widgets);

        return res.status(200).json(dashboardStats);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


// Supprimer un widget spécifique
exports.deleteWidget = async (req, res) => {
    try {
        const { widgetId } = req.params;

        if (!widgetId) {
            return res.status(400).json({ message: "L'identifiant du widget est manquant." });
        }

        const result = await widgetService.deleteWidget(parseInt(widgetId));

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Widget introuvable." });
        }

        return res.status(200).json({ message: "Widget supprimé avec succès." });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};