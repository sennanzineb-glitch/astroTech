const ContactService = require("../services/contacts.services");

class Contact {

    static async apiCreate(req, res) {
        try {

            const { nomComplet, poste, dateDu, dateAu, memoNote, idClient } = req.body;
            if (!nomComplet || !poste || !dateDu || !dateAu || !memoNote || !idClient)
                return res.status(400).json({ error: "nomComplet, poste, dateDu, dateAu, memoNote and idClient are required" });

            const record = { nomComplet, poste, dateDu, dateAu, memoNote, idClient };
            const response = await ContactService.createRecord(record);

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
            const { nomComplet, poste, dateDu, dateAu, memoNote, idClient } = req.body;
            if (!nomComplet || !poste || !dateDu || !dateAu || !memoNote || !idClient)
                return res.status(400).json({ error: "nomComplet, poste, dateDu, dateAu, memoNote and idClient are required" });

            const record = { nomComplet, poste, dateDu, dateAu, memoNote, idClient, id };
            const response = await ContactService.updateRecordById(record);
            res.json(response);
        } catch (error) {
            console.error(error.message);
            res.status(204).send();
        }
    }

    static async apiDeleteById(req, res) {
        try {
            const { id } = req.params;

            await ContactService.deleteRecordById(id);
            res.send();

        } catch (error) {
            console.log(error.message);
            res.status(500).send();
        }
    }


    static async apiGetAll(req, res) {
        try {
            const response = await ContactService.getAllRecords();
            res.json(response);

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }



    static async apiGetById(req, res) {
        try {
            const { id } = req.params;

            const response = await ContactService.getRecordById(id);
            if (!response) return res.status(404).send();

            res.json(response);
        } catch (error) {
            console.error(error.message);
            res.status(500).send();
        }
    }

    static async apiGetByNameAndPoste(req, res) {
        try {
            const { idClient } = req.params;
            const { nomComplet, poste } = req.query;

            console.log(idClient,nomComplet,poste);
            

            // Vérifier les entrées
            if (!idClient || !nomComplet || !poste) {
                return res.status(400).json({
                    success: false,
                    message: "Champs manquants : idClient, nomComplet ou poste.",
                });
            }

            const contact = await ContactService.getByNameAndPoste(
                idClient,
                nomComplet,
                poste
            );

            if (contact) {
                return res.json({ success: true, data: contact });
            } else {
                return res.json({ success: false, data: null });
            }
        } catch (err) {
            console.error("Erreur apiGetByNameAndPoste:", err);
            res.status(500).json({
                success: false,
                message: "Erreur interne du serveur",
            });
        }
    }


}

module.exports = Contact;