const dashboardService = require('../services/dashboard.service');

// Créer un nouveau tableau de bord
exports.createDashboard = async (req, res) => {
    try {
        const { name } = req.body;
        const userId = req.user ? req.user.id : 1; // Simulation ou récupération de l'ID utilisateur connecté

        if (!name) {
            return res.status(400).json({ message: "Le nom du tableau de bord est obligatoire." });
        }

        const result = await dashboardService.create({ userId, name });
        return res.status(201).json({ id: result.insertId, message: "Tableau de bord créé avec succès." });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Récupérer tous les tableaux de bord de l'utilisateur connecté
exports.getUserDashboards = async (req, res) => {
    try {
        console.log("*** Bonjour c'est controller! ***");
        
        const userId = req.user ? req.user.id : 1;
        const dashboards = await dashboardService.getByUserId(userId);
        return res.status(200).json(dashboards);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Supprimer un tableau de bord
exports.deleteDashboard = async (req, res) => {
    try {
        const { id } = req.params;
        await dashboardService.delete(parseInt(id));
        return res.status(200).json({ message: "Tableau de bord supprimé avec succès." });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// ===================================================
//  CONTROLLER DES WIDGETS (VIGNETTES)
// ===================================================

// Créer un nouveau widget à l'intérieur d'un tableau de bord défini
exports.createWidget = async (req, res) => {
    try {
        const dashboardId = parseInt(req.params.id); // Récupération de l'ID depuis l'URL : /dashboard/:id/widgets
        const { title, category, display_type, color, data_type, filters } = req.body;

        // Validation stricte des données requises
        if (!title || !display_type || !category) {
            return res.status(400).json({ message: "Le titre, la catégorie et le type d'affichage sont obligatoires." });
        }

        const result = await dashboardService.createWidget({
            dashboard_id: dashboardId,
            title,
            category,
            display_type,
            color,
            data_type,
            filters: filters ? JSON.stringify(filters) : '{}'
        });

        // Retourne le widget nouvellement créé avec son ID SQL généré pour Angular
        return res.status(201).json({
            id: result.insertId,
            dashboard_id: dashboardId,
            title,
            category,
            display_type,
            color
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Récupérer tous les widgets d'un tableau de bord spécifique
exports.getDashboardWidgets = async (req, res) => {
    try {
        const dashboardId = parseInt(req.params.id);
        const widgets = await dashboardService.getWidgetsByDashboardId(dashboardId);
        return res.status(200).json(widgets);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};