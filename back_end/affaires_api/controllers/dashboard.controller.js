const DashboardService = require('../services/dashboard.services');

class DashboardController {

  static async getInterventionsDashboard(req, res) {
    try {
      const data = await DashboardService.getDashboardInterventions();
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erreur dashboard interventions' });
    }
  }
}

module.exports = DashboardController;
