const AgenceService = require("../services/agences.services");

class Agence {

    static async apiCreate(req, res) {
        try {
            const { idClient, nomAgence, idAdresse } = req.body;
            if (!idClient || !nomAgence || !idAdresse)
                return res.status(400).json({ error: "idClient, nomAgence and idAdresse are required" });

            const record = { idClient, nomAgence, idAdresse };
            const response = await AgenceService.createRecord(record);

            res.status(201).json({ success: true, data: response });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    }

    static async apiUpdateById(req, res) {
        try {
            const { id } = req.params;
            const { idClient, nomAgence, idAdresse } = req.body;

            if (!idClient || !nomAgence || !idAdresse)
                return res.status(400).json({ error: "idClient, nomAgence and idAdresse are required" });

            const record = { idClient, nomEntreprise, id };
            const response = await AgenceService.updateRecordById(record);
            res.json(response);
        } catch (error) {
            console.error(error.message);
            res.status(204).send();
        }
    }

    static async apiDeleteById(req, res) {
        try {
            const { id } = req.params;

            await AgenceService.deleteRecordById(id);
            res.send();

        } catch (error) {
            console.log(error.message);
            res.status(500).send();
        }
    }


    static async apiGetAll(req, res) {
        try {
            const response = await AgenceService.getAllRecords();
            res.json(response);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    static async apiGetById(req, res) {
        try {
            const { id } = req.params;

            const response = await AgenceService.getRecordById(id);
            if (!response) return res.status(404).send();

            res.json(response);
        } catch (error) {
            console.error(error.message);
            res.status(500).send();
        }
    }

}

module.exports = Agence;