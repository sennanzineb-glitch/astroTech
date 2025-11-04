const ReferentService = require("../services/referents.services");

class Referent {

    static async apiCreate(req, res) {
        try {
            let { nom, prenom, telephone, email, dateNaissance, poste, adresse } = req.body;

            // Validation des champs obligatoires
            if (!nom || !prenom || !telephone || !email) {
                return res.status(400).json({
                    error: "Les champs 'nom', 'prenom', 'telephone' et 'email' sont obligatoires"
                });
            }

            // Remplacer les chaînes vides par NULL pour les champs optionnels
            dateNaissance = dateNaissance || null;
            poste = poste || null;
            adresse = adresse || null;

            const record = { nom, prenom, telephone, email, dateNaissance, poste, adresse };
            const response = await ReferentService.createRecord(record);

            res.status(201).json({ success: true, data: response });

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    }

    static async apiUpdateById(req, res) {
        try {
            const { id } = req.params;
            let { nom, prenom, telephone, email, dateNaissance, poste, adresse } = req.body;

            // Validation des champs obligatoires
            if (!nom || !prenom || !telephone || !email) {
                return res.status(400).json({
                    error: "Les champs 'nom', 'prenom', 'telephone' et 'email' sont obligatoires"
                });
            }

            // Remplacer les champs vides par NULL pour MySQL
            dateNaissance = dateNaissance || null;
            poste = poste || null;
            adresse = adresse || null;

            const record = { nom, prenom, telephone, email, dateNaissance, poste, adresse };

            // Mise à jour via le service
            const response = await ReferentService.updateRecordById(record, id);

            res.json({ success: true, data: response });

        } catch (error) {
            console.error(error.message);
            res.status(500).json({ error: error.message });
        }
    }

    static async apiDeleteById(req, res) {
        try {
            const { id } = req.params;

            await ReferentService.deleteRecordById(id);
            res.send();

        } catch (error) {
            console.log(error.message);
            res.status(500).send();
        }
    }


    static async apiGetAll(req, res) {
        try {
            const response = await ReferentService.getAllRecords();
            res.json(response);

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }



    static async apiGetById(req, res) {
        try {
            const { id } = req.params;

            const response = await ReferentService.getRecordById(id);
            if (!response) return res.status(404).send();

            res.json(response);
        } catch (error) {
            console.error(error.message);
            res.status(500).send();
        }
    }

}

module.exports = Referent;