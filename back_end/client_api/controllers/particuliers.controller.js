const ParticulierService = require("../services/particuliers.services");

class ParticulierController {

  // Créer un particulier
  static async apiCreate(req, res) {
    try {
      const { nom_complet, email, telephone, adresse_id, client_id } = req.body;

      if (!nom_complet || !client_id) {
        return res.status(400).json({ error: "nom_complet et client_id sont requis" });
      }

      const data = { nom_complet, email, telephone, adresse_id, client_id };
      const nouvelParticulier = await ParticulierService.apiCreate(data);

      res.status(201).json({ success: true, data: nouvelParticulier });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }

  // Mettre à jour un particulier
  static async apiUpdateById(req, res) {
    try {
      const { id } = req.params;
      const { nom_complet, email, telephone, adresse_id, client_id } = req.body;

      if (!nom_complet || !client_id) {
        return res.status(400).json({ error: "nom_complet et client_id sont requis" });
      }

      const data = { id, nom_complet, email, telephone, adresse_id, client_id };
      const updatedParticulier = await ParticulierService.apiUpdateById(data);

      res.json({ success: true, data: updatedParticulier });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }

  // Supprimer un particulier
  static async apiDeleteById(req, res) {
    try {
      const { id } = req.params;
      const result = await ParticulierService.apiDeleteById(id);
      res.json({ success: true, message: result.message });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }

  // Récupérer tous les particuliers
  static async apiGetAll(req, res) {
    try {
      const particuliers = await ParticulierService.apiGetAll();
      res.json({ success: true, data: particuliers });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }

  // Récupérer un particulier par ID
  static async apiGetById(req, res) {
    try {
      const { id } = req.params;
      const particulier = await ParticulierService.apiGetById(id);
      if (!particulier) return res.status(404).json({ error: "Particulier non trouvé" });
      res.json({ success: true, data: particulier });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }

  static async setRecordNote(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      const { note } = req.body;

      // Validation basique
      if (isNaN(id)) {
        return res.status(400).json({ message: 'ID invalide' });
      }

      if (!note || note.trim() === '') {
        return res.status(400).json({ message: 'La note ne peut pas être vide' });
      }

      // Appel du service
      const result = await ParticulierService.updateRecordNote(id, note);

      if (result.success) {
        return res.status(200).json({ message: 'Note mise à jour', affectedRows: result.affectedRows });
      } else {
        return res.status(500).json({ message: 'Erreur lors de la mise à jour', error: result.error });
      }

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  }

}

module.exports = ParticulierController;
