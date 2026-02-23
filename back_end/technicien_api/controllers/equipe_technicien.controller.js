const EquipeTechnicienService = require("../services/equipe_technicien.services");

class EquipeTechnicien {

  // 🟩 Créer une nouvelle équipe
  static async apiCreate(req, res) {
    try {
      const {
        nom,
        description,
        chefId,
        createur_id = req.user.id
      } = req.body;

      if (!nom) {
        return res.status(400).json({ error: "Le nom de l'équipe est requis" });
      }

      const record = { nom, description, chefId, createur_id };
      console.log("***", record);

      const response = await EquipeTechnicienService.createEquipe(record);

      res.status(201).json({ success: true, data: response });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }

  // 🟨 Mettre à jour une équipe par ID
  static async apiUpdateById(req, res) {
    try {
      const { id } = req.params;
      const { nom, description, chefId } = req.body;

      if (!nom) {
        return res.status(400).json({ error: "Le nom de l'équipe est requis" });
      }

      const record = { nom, description, chefId, id };
      const response = await EquipeTechnicienService.updateEquipeById(record, id);

      res.json({ success: true, data: response });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: error.message });
    }
  }

  // 🟥 Supprimer une équipe
  static async apiDeleteById(req, res) {
    try {
      const { id } = req.params;
      await EquipeTechnicienService.deleteEquipeById(id);
      res.sendStatus(204);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: error.message });
    }
  }

  // 🟦 Obtenir toutes les équipes
  static async apiGetAll(req, res) {
    try {
      const response = await EquipeTechnicienService.getAllEquipes();
      res.json({ success: true, data: response });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erreur interne du serveur" });
    }
  }

  static async apiGetAllWithPaginated(req, res) {
    try {
      let { page = 1, limit = 10, search = '' } = req.query;
      const userId = req.user?.id || null;

      page = Number(page);
      limit = Number(limit);

      const result = await EquipeTechnicienService.getAllEquipesPaginated({
        page,
        limit,
        search,
        userId
      });

      res.status(200).json({
        success: true,
        page,
        limit,
        total: result.total,
        data: result.data
      });

    } catch (error) {
      console.error("Erreur apiGetAllWithPaginated Equipes:", error);
      res.status(500).json({
        success: false,
        error: "Erreur interne du serveur"
      });
    }
  }

  // 🟪 Obtenir une équipe par ID
  static async apiGetById(req, res) {
    try {
      const { id } = req.params;
      const response = await EquipeTechnicienService.getEquipeById(id);

      if (!response) return res.status(404).json({ error: "Équipe non trouvée" });

      res.json({ success: true, data: response });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: error.message });
    }
  }

  // 🟧 Ajouter un technicien à une équipe
  static async apiAddTechnicien(req, res) {
    try {
      const { id } = req.params; // id de l'équipe
      const { technicienId } = req.body;

      if (!technicienId) {
        return res.status(400).json({ error: "L'ID du technicien est requis" });
      }

      // Récupérer l'ID de l'utilisateur connecté depuis req.user
      const createur_id = req.user?.id;

      const record = { technicienId, createur_id };

      // Appel au service
      const result = await EquipeTechnicienService.addTechnicienToEquipe(id, record);
      res.json({ success: true, data: result });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: error.message });
    }
  }

  // 🟫 Retirer un technicien de l'équipe
  static async apiRemoveTechnicien(req, res) {
    try {
      const { technicienId } = req.params;
      const result = await EquipeTechnicienService.removeTechnicienFromEquipe(technicienId);
      res.json({ success: true, data: result });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: error.message });
    }
  }

  // ⚪ Changer le chef d'équipe
  static async apiChangeChef(req, res) {
    try {
      const { id } = req.params;
      const { chefId } = req.body;

      if (!chefId) {
        return res.status(400).json({ error: "L'ID du chef est requis" });
      }

      const result = await EquipeTechnicienService.changeChef(id, chefId);
      res.json({ success: true, data: result });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: error.message });
    }
  }

}

module.exports = EquipeTechnicien;