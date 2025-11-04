const TechnicienService = require("../services/techniciens.services");

class Technicien {

    static async apiCreate(req, res) {
        try {
            let {
                nom,
                prenom,
                dateNaissance,
                adresse,
                telephone,
                email,
                pwd,
                specialite,
                certifications,
                experience,
                zoneIntervention,
                dateEmbauche,
                typeContrat,
                salaire,
                statut
            } = req.body;

            // Validation des champs obligatoires
            if (!nom || !prenom || !telephone || !specialite) {
                return res.status(400).json({
                    error: "Les champs 'nom', 'prenom', 'telephone' et 'specialite' sont obligatoires"
                });
            }

            // Remplacer les champs optionnels vides par NULL
            dateNaissance = dateNaissance || null;
            adresse = adresse || null;
            email = email || null;
            pwd = pwd || null;
            certifications = certifications || null;
            experience = experience || null;
            zoneIntervention = zoneIntervention || null;
            dateEmbauche = dateEmbauche || null;
            typeContrat = typeContrat || null;
            salaire = salaire || null;
            statut = statut || null;

            const record = {
                nom,
                prenom,
                dateNaissance,
                adresse,
                telephone,
                email,
                pwd,
                specialite,
                certifications,
                experience,
                zoneIntervention,
                dateEmbauche,
                typeContrat,
                salaire,
                statut
            };

            const response = await TechnicienService.createRecord(record);
            res.status(201).json({ success: true, data: response });

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    }

    static async apiUpdateById(req, res) {
        try {
            const { id } = req.params;
            let {
                nom,
                prenom,
                dateNaissance,
                adresse,
                telephone,
                email,
                pwd,
                specialite,
                certifications,
                experience,
                zoneIntervention,
                dateEmbauche,
                typeContrat,
                salaire,
                statut
            } = req.body;

            // Validation des champs obligatoires
            if (!nom || !prenom || !telephone || !specialite) {
                return res.status(400).json({
                    error: "Les champs 'nom', 'prenom', 'telephone' et 'specialite' sont obligatoires"
                });
            }

            // Remplacer les champs optionnels vides par NULL
            dateNaissance = dateNaissance || null;
            adresse = adresse || null;
            email = email || null;
            pwd = pwd || null;
            certifications = certifications || null;
            experience = experience || null;
            zoneIntervention = zoneIntervention || null;
            dateEmbauche = dateEmbauche || null;
            typeContrat = typeContrat || null;
            salaire = salaire || null;
            statut = statut || null;

            const record = {
                nom,
                prenom,
                dateNaissance,
                adresse,
                telephone,
                email,
                pwd,
                specialite,
                certifications,
                experience,
                zoneIntervention,
                dateEmbauche,
                typeContrat,
                salaire,
                statut,
                id
            };

            const response = await TechnicienService.updateRecordById(record, id);
            res.json({ success: true, data: response });

        } catch (error) {
            console.error(error.message);
            res.status(500).json({ error: error.message });
        }
    }

    static async apiDeleteById(req, res) {
        try {
            const { id } = req.params;

            await TechnicienService.deleteRecordById(id);
            res.send();

        } catch (error) {
            console.log(error.message);
            res.status(500).send();
        }
    }


    static async apiGetAll(req, res) {
        try {
            const response = await TechnicienService.getAllRecords();
            res.json(response);

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }



    static async apiGetById(req, res) {
        try {
            const { id } = req.params;

            const response = await TechnicienService.getRecordById(id);
            if (!response) return res.status(404).send();

            res.json(response);
        } catch (error) {
            console.error(error.message);
            res.status(500).send();
        }
    }

}

module.exports = Technicien;