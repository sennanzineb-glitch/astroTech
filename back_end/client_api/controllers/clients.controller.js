const ClientService = require("../services/clients.services");

class Client {

    static async apiCreate(req, res) {
        try {
            const { numero, compte, parent_id, createur_id = req.user.id } = req.body;
            if (!numero || !compte)
                return res.status(400).json({ error: "numero and compte are required" });

            console.log(parent_id);
            const record = { numero, compte, parent_id, createur_id };

            const response = await ClientService.createRecord(record);

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
            const { numero, compte } = req.body;

            if (!numero || !compte)
                return res.status(400).json({ error: "numero and compte are required" });

            const record = { numero, compte, id };
            const response = await ClientService.updateRecordById(record);
            res.json(response);
        } catch (error) {
            console.error(error.message);
            res.status(204).send();
        }
    }

    static async apiDeleteById(req, res) {
        try {
            const { id } = req.params;

            await ClientService.deleteRecordById(id);
            res.send();

        } catch (error) {
            console.log(error.message);
            res.status(500).send();
        }
    }

    static async apiDeleteRecordByType(req, res) {
        try {
            const { type, id } = req.query;

            // 1️⃣ Vérification des paramètres
            if (!type || !id) {
                return res.status(400).json({
                    success: false,
                    message: "Paramètres manquants : type et id sont obligatoires."
                });
            }

            // 2️⃣ Appel du service
            const result = await ClientService.deleteRecordByType(type, id);

            // 3️⃣ Retour au front-end
            return res.status(200).json({
                success: true,
                message: result.message
            });

        } catch (error) {
            console.error("❌ Erreur apiDeleteRecordByType :", error);

            return res.status(500).json({
                success: false,
                message: "Erreur interne du serveur",
                error: error.message
            });
        }
    }

    static async apiGetAll(req, res) {
        try {
            const response = await ClientService.getAllRecords();
            res.json(response);

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    static async apiGetById(req, res) {
        try {
            const { id } = req.params;

            const response = await ClientService.getRecordById(id);
            if (!response) return res.status(404).send();

            res.json(response);
        } catch (error) {
            console.error(error.message);
            res.status(500).send();
        }
    }

    // 🔹 Clients avec contacts (pagination + recherche)
    static async getAllClientsWithContactsPaginated(req, res) {
        try {
            // paramètres query
            let { page = 1, limit = 10, search = '' } = req.query;

            page = parseInt(page, 10);
            limit = parseInt(limit, 10);

            if (page < 1) page = 1;
            if (limit < 1) limit = 10;

            const userId = req.user?.id; // utilisateur connecté

            // appel service
            const result = await ClientService.getAllClientsWithContactsPaginated({
                page,
                limit,
                search,
                userId
            });

            // réponse standardisée
            res.status(200).json({
                success: true,
                page,
                limit,
                total: result.total,
                data: result.data
            });

        } catch (err) {
            console.error('Erreur getAllClientsWithContactsPaginated:', err);
            res.status(500).json({
                success: false,
                message: 'Internal Server Error'
            });
        }
    }

    static async apigetAllClientsWithContacts(req, res) {
        try {
            const response = await ClientService.getAllClientsWithContacts();
            res.json(response);

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    static async getRecordDetails(req, res) {
        try {
            const id = req.params.id;
            const client = await ClientService.getRecordDetails(id);
            if (!client)
                return res.status(404).json({ success: false, message: 'Client non trouvé' });

            res.json({ success: true, data: client });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // controllers/ClientController.js
    static async getClientsByParentWithDetails(req, res) {
        try {
            const { parentId } = req.params;
            const { parentType } = req.query; // 👈 NOUVEAU

            if (!parentId || isNaN(parseInt(parentId, 10))) {
                return res.status(400).json({ error: "parentId invalide" });
            }

            if (!parentType) {
                return res.status(400).json({ error: "parentType requis" });
            }

            // Pagination
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 10;
            const offset = (page - 1) * limit;

            // Recherche
            const search = req.query.search ? req.query.search.trim() : "";

            // User connecté
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ error: "Utilisateur non authentifié" });
            }

            const result = await ClientService.getClientsByParentWithDetails({
                parentId: parseInt(parentId, 10),
                parentType, // 👈 ENVOYÉ AU SERVICE
                page,
                limit,
                offset,
                search,
                userId
            });

            res.status(200).json({
                success: true,
                page,
                limit,
                parentId,
                parentType, // 👈 RENVOYÉ AU FRONT
                data: result.data
            });

        } catch (error) {
            console.error("Erreur getClientsByParentWithDetails:", error);
            res.status(500).json({ error: "Erreur serveur" });
        }
    }


    // 🔹 Récupérer interventions d'un client avec pagination et recherche
    static async getClientInterventions(req, res) {
        try {
            const { clientId } = req.params;
            const { page = 1, limit = 10, search = '' } = req.query;
            const userId = req.user?.id; // utilisateur connecté

            if (!clientId || isNaN(parseInt(clientId, 10))) {
                return res.status(400).json({ error: "clientId invalide" });
            }

            const result = await ClientService.getInterventionsByClient({
                clientId: parseInt(clientId, 10),
                page: parseInt(page, 10),
                limit: parseInt(limit, 10),
                search: search.trim(),
                userId
            });

            res.status(200).json({
                success: true,
                page: parseInt(page, 10),
                limit: parseInt(limit, 10),
                total: result.total,
                data: result.data
            });
        } catch (err) {
            console.error("Erreur getClientInterventions:", err);
            res.status(500).json({
                error: "Internal Server Error",
                details: err.message
            });
        }
    }

}

module.exports = Client;