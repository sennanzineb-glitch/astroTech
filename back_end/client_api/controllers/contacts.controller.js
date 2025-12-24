const ContactService = require("../services/contacts.services");

class Contact {

  // Créer un contact
  static async apiCreate(req, res) {
    try {
      const { nom_complet, poste, date_du, date_au, memo_note, client_id, secteur_id, habitation_id } = req.body;
      if (!nom_complet)
        return res.status(400).json({ error: "nomComplet is required" });

      const record = { nom_complet, poste, date_du, date_au, memo_note, client_id, secteur_id, habitation_id };
      const response = await ContactService.createRecord(record);

      res.status(201).json({ success: true, data: response });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }

  // Mettre à jour un contact par ID
  static async apiUpdateById(req, res) {
    try {
      const { id } = req.params;
      const { nom_complet, poste, date_du, date_au, memo_note, client_id } = req.body;

      if (!nom_complet || !client_id)
        return res.status(400).json({ error: "nom_complet and client_id are required" });

      const record = { id, nom_complet, poste, date_du, date_au, memo_note, client_id };
      const response = await ContactService.updateRecordById(record);

      res.json({ success: true, data: response });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }

  // Supprimer un contact
  static async apiDeleteById(req, res) {
    try {
      const { id } = req.params;
      await ContactService.deleteRecordById(id);
      res.json({ success: true, message: `Contact ${id} supprimé` });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }

  // Récupérer tous les contacts
  static async apiGetAll(req, res) {
    try {
      const rows = await ContactService.getAllRecords();
      res.json({ success: true, data: rows });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }

  // Récupérer un contact par ID
  static async apiGetById(req, res) {
    try {
      const { id } = req.params;
      const record = await ContactService.getRecordById(id);
      if (!record) return res.status(404).json({ error: "Contact non trouvé" });
      res.json({ success: true, data: record });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }


  // GET /clients/contact/byNameAndPoste
static async apiGetByNameAndPoste(req, res) {
  try {
    const { type, id, nom_complet, poste } = req.query;

    // Vérification des paramètres obligatoires
    if (!type || !id || !nom_complet || !poste) {
      return res.status(400).json({
        message: "Paramètres manquants : type, id, nom_complet, poste sont obligatoires."
      });
    }

    // Appel du service
    const contact = await ContactService.getByNameAndPoste(type, id, nom_complet, poste);

    return res.status(200).json({
      exists: !!contact,
      data: contact || null
    });

  } catch (error) {
    console.error("Erreur controller getByNameAndPoste :", error);
    return res.status(500).json({
      message: "Erreur interne du serveur",
      error: error.message
    });
  }
}


}

module.exports = Contact;
