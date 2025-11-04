const AdresseService = require("../services/adresses.services");

class Adresse {

    static async apiCreate(req, res) {
      try {
        const { adresse, codePostal, ville, province, pays, etage, appartementLocal, batiment, interphoneDigicode, escalier, porteEntree } = req.body;
        if (!adresse || !codePostal || !ville || !province || !pays || !etage || !appartementLocal || !batiment || !interphoneDigicode || !escalier || !porteEntree)
            return res.status(400).json({ error: "numero and compte are required" });

        const record = { adresse, codePostal, ville, province, pays, etage, appartementLocal, batiment, interphoneDigicode, escalier, porteEntree };
        const response = await AdresseService.createRecord(record);

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
            const { adresse, codePostal, ville, province, pays, etage, appartementLocal, batiment, interphoneDigicode, escalier, porteEntree } = req.body;
        if (!adresse || !codePostal || !ville || !province || !pays || !etage || !appartementLocal || !batiment || !interphoneDigicode || !escalier || !porteEntree)
            return res.status(400).json({ error: "numero and compte are required" });

            const record = { adresse, codePostal, ville, province, pays, etage, appartementLocal, batiment, interphoneDigicode, escalier, porteEntree, id };
            const response = await AdresseService.updateRecordById(record);
            res.json(response);
        } catch (error) {
            console.error(error.message);
            res.status(204).send();
        }
    }

    static async apiDeleteById(req, res) {
        try {
            const { id } = req.params;

            await AdresseService.deleteRecordById(id);
            res.send();

        } catch (error) {
            console.log(error.message);
            res.status(500).send();
        }
    }


    static async apiGetAll(req, res) {
        try {
            const response = await AdresseService.getAllRecords();
            res.json(response);
          
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    

    static async apiGetById(req, res) {
        try {
            const { id } = req.params;

            const response = await AdresseService.getRecordById(id);
            if (!response) return res.status(404).send();

            res.json(response);
        } catch (error) {
            console.error(error.message);
            res.status(500).send();
        }
    }

}

module.exports = Adresse;