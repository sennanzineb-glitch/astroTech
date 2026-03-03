const PlanningService = require('../services/palnning.services');

class PlanningController {

  // ➕ Ajouter une planification
  static async addPlanning(req, res) {
    try {
      const interventionId = req.params.id;

      const {
        date_debut_intervention,
        heure_debut_intervention_h = 0,
        heure_debut_intervention_min = 0,
        date_fin_intervention,
        heure_fin_intervention_h = 0,
        heure_fin_intervention_min = 0,
        temps_trajet_estime_heures = 0,
        temps_trajet_estime_minutes = 0
      } = req.body;

      console.log("** controller **", req.params);


      if (!date_debut_intervention) {
        return res.status(400).json({ message: 'La date de début est obligatoire' });
      }

      const result = await PlanningService.addPlanning(interventionId, {
        date_debut_intervention,
        heure_debut_intervention_h,
        heure_debut_intervention_min,
        date_fin_intervention,
        heure_fin_intervention_h,
        heure_fin_intervention_min,
        temps_trajet_estime_heures,
        temps_trajet_estime_minutes
      });

      res.status(200).json({
        message: 'Planning ajouté avec succès',
        data: result
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erreur lors de l’ajout du planning', error: err.message });
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
