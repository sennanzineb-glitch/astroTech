const OrganisationService = require("../services/organisations.services");

class Organisation {

    static async apiCreate(req, res) {
      try {
        const { client_id, nom_entreprise } = req.body;
        if (!client_id || !nom_entreprise)
            return res.status(400).json({ error: "client_id and nom_entreprise are required" });

        const record = { client_id, nom_entreprise };
        const response = await OrganisationService.createRecord(record);

        res.status(201).json({ success: true, data: response });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
    }

    static async apiUpdateById(req, res) {
        try {

            console.log("Request body:", req.body, req.params);

            const { id } = req.params;
            const { client_id, nom_entreprise } = req.body;

            if (!client_id || !nom_entreprise)
               return res.status(400).json({ error: "client_id and nom_entreprise are required" });

            const record = { client_id, nom_entreprise, id };
            const response = await OrganisationService.updateRecordById(record);
            res.json(response);
        } catch (error) {
            console.error(error.message);
            res.status(204).send();
        }
    }

    static async apiDeleteById(req, res) {
        try {
            const { id } = req.params;

            await OrganisationService.deleteRecordById(id);
            res.send();

        } catch (error) {
            console.log(error.message);
            res.status(500).send();
        }
    }


    static async apiGetAll(req, res) {
        try {
            const response = await OrganisationService.getAllRecords();
            res.json(response);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    static async apiGetById(req, res) {
        try {
            const { id } = req.params;

            const response = await OrganisationService.getRecordById(id);
            if (!response) return res.status(404).send();

            res.json(response);
        } catch (error) {
            console.error(error.message);
            res.status(500).send();
        }
    }

      static async setRecordNote(req, res) {
        try {
            const agenceId = parseInt(req.params.id, 10);
            const { note } = req.body;

            // Validation basique
            if (isNaN(agenceId)) {
                return res.status(400).json({ message: 'ID invalide' });
            }

            if (!note || note.trim() === '') {
                return res.status(400).json({ message: 'La note ne peut pas être vide' });
            }

            // Appel du service
            const result = await OrganisationService.updateRecordNote(agenceId, note);

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
            const result = await OrganisationService.updateRecordNote(id, note);

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

module.exports = Organisation;