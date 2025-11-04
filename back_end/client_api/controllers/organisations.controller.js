const OrganisationService = require("../services/organisations.services");

class Organisation {

    static async apiCreate(req, res) {
      try {
        const { idClient, nomEntreprise } = req.body;
        if (!idClient || !nomEntreprise)
            return res.status(400).json({ error: "idClient and nomEntreprise are required" });

        const record = { idClient, nomEntreprise };
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
            const { idClient, nomEntreprise } = req.body;

            if (!idClient || !nomEntreprise)
               return res.status(400).json({ error: "idClient and nomEntreprise are required" });

            const record = { idClient, nomEntreprise, id };
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

}

module.exports = Organisation;