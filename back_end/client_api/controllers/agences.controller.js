const AgenceService = require("../services/agences.services");

class Agence {

    // 🔹 CREATE
    static async apiCreate(req, res) {
        try {
            const { client_id, nom_agence, adresse_id } = req.body;

            if (!nom_agence)
                return res.status(400).json({ error: "nom_agence est obligatoire." });

            const record = { client_id, nom_agence, adresse_id };
            const response = await AgenceService.createRecord(record);

            res.status(201).json({ success: true, data: response });

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    }

    // 🔹 UPDATE
    static async apiUpdateById(req, res) {
        try {
            const { id } = req.params;
            const { nom_agence, client_id, adresse_id } = req.body;

            if (!nom_agence)
                return res.status(400).json({ error: "nom_agence est obligatoire." });

             const record = { id, client_id, nom_agence, adresse_id };

            await AgenceService.updateRecordById(record);

            res.json({ success: true, message: "Agence mise à jour avec succès." });

        } catch (error) {
            console.error(error.message);
            res.status(500).json({ error: "Erreur serveur" });
        }
    }

    // 🔹 DELETE
    static async apiDeleteById(req, res) {
        try {
            const { id } = req.params;

            await AgenceService.deleteRecordById(id);

            res.json({ success: true, message: "Agence supprimée avec succès." });

        } catch (error) {
            console.log(error.message);
            res.status(500).send();
        }
    }

    // 🔹 GET ALL
    static async apiGetAll(req, res) {
        try {
            const response = await AgenceService.getAllRecords();
            res.json(response);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    // 🔹 GET BY ID
    static async apiGetById(req, res) {
        try {
            const { id } = req.params;

            const response = await AgenceService.getRecordById(id);

            if (!response) return res.status(404).json({ error: "Agence introuvable." });

            res.json(response);

        } catch (error) {
            console.error(error.message);
            res.status(500).send();
        }
    }

    //
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
            const result = await AgenceService.updateRecordNote(id, note);

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

module.exports = Agence;
