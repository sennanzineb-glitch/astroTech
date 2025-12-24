const ClientService = require("../services/clients.services");

class Client {

    static async apiCreate(req, res) {
        try {
            const { numero, compte, parent_id } = req.body;
            if (!numero || !compte)
                return res.status(400).json({ error: "numero and compte are required" });

            console.log(parent_id);
            const record = { numero, compte, parent_id };
            console.log(record);

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

    // DELETE /clients/delete?type=agence&id=84

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


    // Récupérer client + children par parent_id
    static async getClientsByParentWithDetails(req, res) {
        try {
            console.log("Request params:", req.params);

            const { parentId } = req.params;
            if (!parentId || isNaN(parseInt(parentId, 10))) {
                return res.status(400).json({ error: "parentId invalide" });
            }

            const clients = await ClientService.getClientsByParentWithDetails(parseInt(parentId, 10));

            res.status(200).json(clients);
        } catch (error) {
            console.error("Erreur apiGetByParentId:", error.message);
            res.status(500).json({ error: "Erreur serveur" });
        }
    }

}

module.exports = Client;