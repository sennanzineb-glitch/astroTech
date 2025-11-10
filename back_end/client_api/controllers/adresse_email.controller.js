const AdresseEmailService = require("../services/adresse_email.services");

class AdresseEmail {

    static async apiCreate(req, res) {
        try {
            const { email, type, idContact } = req.body;
            if (!email || !type ||  !idContact)
                return res.status(400).json({ error: "email, type and idContact are required" });

            const record = { email, type, idContact };
            const response = await AdresseEmailService.createRecord(record);

            res.status(201).json({ success: true, data: response });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    }

    static async apiUpdateById(req, res) {
        try {
            const { id } = req.params;
            const { email, type, idContact } = req.body;

            if (!email || !type ||  !idContact)
                return res.status(400).json({ error: "email, type and idContact are required" });

            const record = { email, nomEntreprise, id };
            const response = await AdresseEmailService.updateRecordById(record);
            res.json(response);
        } catch (error) {
            console.error(error.message);
            res.status(204).send();
        }
    }

    static async apiDeleteById(req, res) {
        try {
            const { id } = req.params;

            await AdresseEmailService.deleteRecordById(id);
            res.send();

        } catch (error) {
            console.log(error.message);
            res.status(500).send();
        }
    }


    static async apiGetAll(req, res) {
        try {
            const response = await AdresseEmailService.getAllRecords();
            res.json(response);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    static async apiGetById(req, res) {
        try {
            const { id } = req.params;

            const response = await AdresseEmailService.getRecordById(id);
            if (!response) return res.status(404).send();

            res.json(response);
        } catch (error) {
            console.error(error.message);
            res.status(500).send();
        }
    }

    // 🔍 Vérifier si un email existe déjà pour un contact
  static async apiGetByEmailAndContact(req, res) {
    try {
      const { idContact } = req.params;
      const { email } = req.query;

      if (!idContact || !email) {
        return res.status(400).json({
          success: false,
          message: "Paramètres manquants : idContact ou email.",
        });
      }

      const existing = await AdresseEmailService.getByEmailAndContact(idContact, email);

      if (existing) {
        return res.json({ success: true, data: existing });
      } else {
        return res.json({ success: false, data: null });
      }
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