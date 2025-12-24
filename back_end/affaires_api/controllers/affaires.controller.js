const AffaireService = require("../services/affaires.services");

class Affaire {

    // ➕ Créer une nouvelle affaire
    static async apiCreate(req, res) {
        try {
            const {
                reference, titre, zoneIntervention, description, clientId,
                etatLogement, technicienId, equipeTechnicienId, referents,
                dateDebut, dateFin, motsCles, dureePrevueHeures, dureePrevueMinutes,
                memo, memoPiecesJointes, adresse_id, client_adresse_id, type_client_adresse
            } = req.body;

            // Vérification basique
            if (!reference || !titre || !clientId)
                return res.status(400).json({ error: "reference, titre et clientId sont requis" });

            const record = {
                reference,
                titre,
                zoneIntervention,
                description,
                clientId,
                etatLogement,
                technicienId,
                equipeTechnicienId,
                referents,
                dateDebut,
                dateFin,
                motsCles,
                dureePrevueHeures,
                dureePrevueMinutes,
                memo,
                memoPiecesJointes,
                adresse_id,
                client_adresse_id,
                type_client_adresse
            };

            const response = await AffaireService.apiCreate(record);
            res.status(201).json({ success: true, data: response });

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    }


    // ✏️ Modifier une affaire par ID
    static async apiUpdateById(req, res) {
        try {
            const { id } = req.params;
            const {
                reference, titre, zoneIntervention, description, clientId,
                etatLogement, technicienId, equipeTechnicienId, referents, memo, memoPiecesJointes,
                dateDebut, dateFin, motsClesId, dureePrevueHeures, dureePrevueMinutes, adresse_id, client_adresse_id, type_client_adresse
            } = req.body;

            if (!reference || !titre || !clientId)
                return res.status(400).json({ error: "reference, titre et clientId sont requis" });

            const record = {
                reference, titre, zoneIntervention, description, clientId,
                etatLogement, technicienId, equipeTechnicienId, referents, memo, memoPiecesJointes,
                dateDebut, dateFin, motsClesId, dureePrevueHeures, dureePrevueMinutes, adresse_id, client_adresse_id,type_client_adresse, id
            };

            const response = await AffaireService.updateAffaire(record, id);
            res.json(response);

        } catch (error) {
            console.error(error.message);
            res.status(500).send();
        }
    }

    // ❌ Supprimer une affaire par ID
    static async apiDeleteById(req, res) {
        try {
            const { id } = req.params;
            await AffaireService.apiDeleteById(id);
            res.send();
        } catch (error) {
            console.error(error.message);
            res.status(500).send();
        }
    }

    // 📜 Récupérer toutes les affaires
    static async apiGetAll(req, res) {
        try {
            const response = await AffaireService.apiGetAll();
            res.json(response);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    // 🔍 Récupérer une affaire par ID
    static async apiGetById(req, res) {
        try {
            const { id } = req.params;
            const response = await AffaireService.apiGetById(id);
            if (!response) return res.status(404).send();
            res.json(response);
        } catch (error) {
            console.error(error.message);
            res.status(500).send();
        }
    }
}

module.exports = Affaire;