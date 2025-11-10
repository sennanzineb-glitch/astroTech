const NumTelService = require("../services/num_tel.services");

class NumTel {

    static async apiCreate(req, res) {
        try {
            const { tel, type, idContact } = req.body;
            if (!tel || !type || !idContact)
                return res.status(400).json({ error: "tel, type and idContact are required" });

            const record = { tel, type, idContact };
            const response = await NumTelService.createRecord(record);

            res.status(201).json({ success: true, data: response });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    }

    static async apiUpdateById(req, res) {
        try {
            const { id } = req.params;
            const { tel, type, idContact } = req.body;

            if (!tel || !type || !idContact)
                return res.status(400).json({ error: "tel, type and idContact are required" });

            const record = { tel, nomEntreprise, id };
            const response = await NumTelService.updateRecordById(record);
            res.json(response);
        } catch (error) {
            console.error(error.message);
            res.status(204).send();
        }
    }

    static async apiDeleteById(req, res) {
        try {
            const { id } = req.params;

            await NumTelService.deleteRecordById(id);
            res.send();

        } catch (error) {
            console.log(error.message);
            res.status(500).send();
        }
    }


    static async apiGetAll(req, res) {
        try {
            const response = await NumTelService.getAllRecords();
            res.json(response);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    static async apiGetById(req, res) {
        try {
            const { id } = req.params;

            const response = await NumTelService.getRecordById(id);
            if (!response) return res.status(404).send();

            res.json(response);
        } catch (error) {
            console.error(error.message);
            res.status(500).send();
        }
    }

      // 🔍 Vérifier si un téléphone existe déjà pour un contact
  static async apiGetByTelAndContact(req, res) {
    try {
      const { idContact } = req.params;
      const { tel } = req.query;

      if (!idContact || !tel) {
        return res.status(400).json({
          success: false,
          message: "Paramètres manquants : idContact ou tel.",
        });
      }

      const existing = await NumTelService.getByTelAndContact(idContact, tel);

      if (existing) {
        return res.json({ success: true, data: existing });
      } else {
        return res.json({ success: false, data: null });
      }
    } catch (err) {
      console.error("Erreur apiGetByTelAndContact:", err);
      res.status(500).json({
        success: false,
        message: "Erreur interne du serveur",
      });
    }
  }

}

module.exports = NumTel;