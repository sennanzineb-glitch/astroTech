const SecteurService = require("../services/secteur.services");

class SecteurController {

    static async apiCreate(req, res) {
        try {
            const { reference, nom, description, adresse_id, agence_id, organisation_id, parent_id } = req.body;
            if (!reference)
                return res.status(400).json({ error: "La référence du secteur est requise" });

            const record = { reference, nom, description, adresse_id, agence_id, organisation_id, parent_id };
            const response = await SecteurService.createRecord(record);

            res.status(201).json({ success: true, data: response });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    }

    static async apiUpdateById(req, res) {
        try {
            const { id } = req.params;
            const { reference, nom, description, adresse_id, agence_id, organisation_id, parent_id } = req.body;

            if (!reference)
                return res.status(400).json({ error: "La référence du secteur est requise" });

            const record = { id, reference, nom, description, adresse_id, agence_id, organisation_id, parent_id };
            const response = await SecteurService.updateRecordById(record);
            res.json(response);
        } catch (error) {
            console.error(error.message);
            res.status(500).send();
        }
    }

    static async apiDeleteById(req, res) {
        try {
            const { id } = req.params;
            await SecteurService.deleteRecordById(id);
            res.send();
        } catch (error) {
            console.error(error.message);
            res.status(500).send();
        }
    }

    static async apiGetAll(req, res) {
        try {
            const response = await SecteurService.getAllRecords();
            res.json(response);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    static async apiGetById(req, res) {
        try {
            const { id } = req.params;
            const response = await SecteurService.getRecordById(id);
            if (!response) return res.status(404).send();
            res.json(response);
        } catch (error) {
            console.error(error.message);
            res.status(500).send();
        }
    }

     static async apiGetRecordDetails(req, res) {
    try {
      const { id } = req.params;

      // Appel de la fonction qui récupère les détails du client secteur
      const client = await SecteurService.getRecordDetails(id);

      if (!client) return res.status(404).send();

      res.json(client);
    } catch (error) {
      console.error('Erreur apiGetById Secteur:', error.message);
      res.status(500).send();
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
      const result = await SecteurService.updateRecordNote(id, note);

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

module.exports = SecteurController;
