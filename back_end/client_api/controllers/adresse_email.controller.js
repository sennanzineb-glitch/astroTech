const AdresseEmailService = require("../services/adresse_email.services");

class AdresseEmail {

    // 🔹 CREATE
    static async apiCreate(req, res) {
        try {
            
            const { email, type, contact_id, createur_id = req.user.id } = req.body;

            if (!email || !contact_id)
                return res.status(400).json({ error: "email et contact_id sont obligatoires" });

            const record = { email, type, contact_id, createur_id };
            const response = await AdresseEmailService.createRecord(record);

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
            const { email, type, contact_id} = req.body;

            if (!email || !contact_id)
                return res.status(400).json({ error: "email et contact_id sont obligatoires" });

            const record = { id, email, type, contact_id };

            await AdresseEmailService.updateRecordById(record);

            res.json({ success: true, message: "Mise à jour effectuée" });

        } catch (error) {
            console.error(error.message);
            res.status(500).json({ error: "Erreur serveur" });
        }
    }

    // 🔹 DELETE
    static async apiDeleteById(req, res) {
        try {
            const { id } = req.params;

            await AdresseEmailService.deleteRecordById(id);

            res.json({ success: true, message: "Supprimé avec succès" });

        } catch (error) {
            console.log(error.message);
            res.status(500).send();
        }
    }

    // 🔹 GET ALL
    static async apiGetAll(req, res) {
        try {
            const response = await AdresseEmailService.getAllRecords();
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

            const response = await AdresseEmailService.getRecordById(id);
            if (!response) return res.status(404).json({ error: "Not Found" });

            res.json(response);

        } catch (error) {
            console.error(error.message);
            res.status(500).send();
        }
    }

    // 🔹 GET BY email + contact_id
    static async apiGetByEmailAndContact(req, res) {
        try {
            
            console.log(req.params);
            

            const { contact_id } = req.params;
            const { email } = req.query;

            console.log("***" ,contact_id, email);
            
            if (!contact_id || !email) {
                return res.status(400).json({
                    success: false,
                    message: "Paramètres manquants : contact_id ou email.",
                });
            }

            const existing = await AdresseEmailService.getByEmailAndContact(contact_id, email);

            return res.json({
                success: true,
                exists: !!existing,
                data: existing || null
            });

        } catch (err) {
            console.error("Erreur apiGetByEmailAndContact:", err);
            res.status(500).json({
                success: false,
                message: "Erreur interne du serveur",
            });
        }
    }

}

module.exports = AdresseEmail;