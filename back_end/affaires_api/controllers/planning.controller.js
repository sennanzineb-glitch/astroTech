const PlanningService = require('../services/palnning.services');

class PlanningController {

  // ➕ Ajouter une planification
  static async addPlanning(req, res) {
    try {
      const interventionId = req.params.interventionId;
      const { date, heure } = req.body;
      const result = await PlanningService.addPlanning(interventionId, { date, heure });
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // 📜 Récupérer toutes les planifications
 // controllers/planning.controller.js
static async getAll(req, res) {
  try {
    const userId = req.user?.id; // injecté par authenticateToken

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Utilisateur non authentifié'
      });
    }

    const data = await PlanningService.getAllByUser(userId);

    res.json({
      success: true,
      data
    });

  } catch (err) {
    console.error('Erreur getAll planning:', err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
}


  // ✏️ Modifier une planification
  static async updatePlanning(req, res) {
    try {
      const id = req.params.id;
      const { date, heure } = req.body;
      const result = await PlanningService.updatePlanning(id, { date, heure });
      res.json({ success: true, data: result });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // ❌ Supprimer une planification
  static async deletePlanning(req, res) {
    try {
      const id = req.params.id;
      const deleted = await PlanningService.deletePlanning(id);
      if (!deleted) return res.status(404).json({ success: false, message: 'Planification non trouvée' });
      res.json({ success: true, message: 'Planification supprimée' });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}

module.exports = PlanningController;
