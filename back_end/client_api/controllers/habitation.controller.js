const HabitationService = require("../services/habitation.services");

class HabitationController {

    static async apiCreate(req, res) {
        try {
            const { reference, surface, adresse_id, secteur_id, agence_id, organisation_id, particulier_id } = req.body;
            if (!reference)
                return res.status(400).json({ error: "La référence de l'habitation est requise" });

            const record = { reference, surface, adresse_id, secteur_id, agence_id, organisation_id, particulier_id };
            const response = await HabitationService.createRecord(record);

            res.status(201).json({ success: true, data: response });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    }

    static async apiUpdateById(req, res) {
        try {
            const { id } = req.params;
            const { reference, surface, adresse_id, secteur_id, agence_id, organisation_id, particulier_id } = req.body;

            if (!reference)
                return res.status(400).json({ error: "La référence de l'habitation est requise" });

            const record = { id, reference, surface, adresse_id, secteur_id, agence_id, organisation_id, particulier_id };
            const response = await HabitationService.updateRecordById(record);
            res.json(response);
        } catch (error) {
            console.error(error.message);
            res.status(500).send();
        }
    }

    static async apiDeleteById(req, res) {
        try {
            const { id } = req.params;
            await HabitationService.deleteRecordById(id);
            res.send();
        } catch (error) {
            console.error(error.message);
            res.status(500).send();
        }
    }

    static async apiGetAll(req, res) {
        try {
            const response = await HabitationService.getAllRecords();
            res.json(response);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    static async apiGetById(req, res) {
        try {
            const { id } = req.params;
            const response = await HabitationService.getRecordById(id);
            if (!response) return res.status(404).send();
            res.json(response);
        } catch (error) {
            console.error(error.message);
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
            const result = await HabitationService.updateRecordNote(id, note);

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

        static async apiGetRecordDetails(req, res) {
        try {
            const { id } = req.params;

            // Appel de la fonction qui récupère les détails du client secteur
            const client = await HabitationService.getRecordDetails(id);

            if (!client) return res.status(404).send();

            res.json(client);
        } catch (error) {
            console.error('Erreur apiGetById Secteur:', error.message);
            res.status(500).send();
        }
    }

}

module.exports = HabitationController;
