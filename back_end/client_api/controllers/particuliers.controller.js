const ParticulierService = require("../services/particuliers.services");

class Particulier {

    static async apiCreate(req, res) {
        try {
            
            const { nomComplet, email, telephone, idAdresse, idClient } = req.body;
            if (!nomComplet || !email || !telephone || !idAdresse || !idClient)
                return res.status(400).json({ error: "nomComplet, email, telephone, idAdresse and idClient are required" });

            const record = { nomComplet, email, telephone, idAdresse, idClient };
            const response = await ParticulierService.createRecord(record);

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
            const { nomComplet, email, telephone, idAdresse, idClient } = req.body;
            if (!nomComplet || !email || !telephone || !idAdresse || !idClient)
                return res.status(400).json({ error: "nomComplet, email, telephone, idAdresse and idClient are required" });

            const record = { nomComplet, email, telephone, idAdresse, idClient, id };
            const response = await ParticulierService.updateRecordById(record);
            res.json(response);
        } catch (error) {
            console.error(error.message);
            res.status(204).send();
        }
    }

    static async apiDeleteById(req, res) {
        try {
            const { id } = req.params;

            await ParticulierService.deleteRecordById(id);
            res.send();

        } catch (error) {
            console.log(error.message);
            res.status(500).send();
        }
    }


    static async apiGetAll(req, res) {
        try {
            const response = await ParticulierService.getAllRecords();
            res.json(response);

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }



    static async apiGetById(req, res) {
        try {
            const { id } = req.params;

            const response = await ParticulierService.getRecordById(id);
            if (!response) return res.status(404).send();

            res.json(response);
        } catch (error) {
            console.error(error.message);
            res.status(500).send();
        }
    }

}

module.exports = Particulier;