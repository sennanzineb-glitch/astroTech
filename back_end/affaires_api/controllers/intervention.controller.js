const InterventionService = require("../services/intervention.service");

class Intervention {

    // ➕ Créer une nouvelle intervention
// Controller
// Controller
static async apiCreate(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Utilisateur non authentifié" });
    }

    const {
      numero,
      titre,
      type,
      description,

      client_id,
      adresse_facturation_id,  // ✅ nom correct
      client_adresse_id,
      type_client_adresse,

      priorite,
      etat,
      date_butoir_realisation,
      date_cloture_estimee,
      motsCles,

      montant_intervention,
      montant_main_oeuvre,
      montant_fournitures,

      referents
    } = req.body;

    if (!titre || !type || numero == null) {
      return res.status(400).json({ error: "Les champs titre, type et numero sont obligatoires" });
    }

    const parseDate = (d) => {
      if (!d || d === '' || typeof d !== 'string') return null;
      const date = new Date(d);
      return isNaN(date.getTime()) ? null : date.toISOString().split('T')[0];
    };

    const record = {
      numero,
      titre,
      type,
      description,

      client_id: Number(client_id || 0),
      adresse_facturation_id: Number(adresse_facturation_id || 0), // ✅ utilisé correctement
      client_adresse_id: Number(client_adresse_id || 0),
      type_client_adresse: type_client_adresse || '',

      priorite: priorite || '',
      etat: etat || '',

      date_butoir_realisation: parseDate(date_butoir_realisation),
      date_cloture_estimee: parseDate(date_cloture_estimee),

      mots_cles: Array.isArray(motsCles) ? motsCles.join(',') : (motsCles || ''),

      montant_intervention: Number(montant_intervention || 0),
      montant_main_oeuvre: Number(montant_main_oeuvre || 0),
      montant_fournitures: Number(montant_fournitures || 0),

      referents: Array.isArray(referents) ? referents.map(Number) : [],

      createur_id: userId
    };

    const response = await InterventionService.apiCreate(record);

    return res.status(201).json({
      success: true,
      message: "Intervention créée avec succès",
      data: response
    });

  } catch (error) {
    console.error("❌ Controller apiCreate intervention:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}



    // ✏️ Modifier une intervention par ID
    static async apiUpdateById(req, res) {
        try {
            const { id } = req.params;
            const data = req.body;

            if (!data.titre || !data.description || !data.numero)
                return res.status(400).json({ error: "titre, description et numero sont requis" });

            const response = await InterventionService.updateIntervention(id, data);
            res.json(response);

        } catch (error) {
            console.error(error.message);
            res.status(500).send();
        }
    }

    // ❌ Supprimer une intervention par ID
    static async apiDeleteById(req, res) {
        try {
            const { id } = req.params;
            const deleted = await InterventionService.apiDeleteById(id);
            if (!deleted) return res.status(404).json({ error: "Intervention non trouvée" });
            res.send();
        } catch (error) {
            console.error(error.message);
            res.status(500).send();
        }
    }

    // 📜 Récupérer toutes les interventions
    static async apiGetAll(req, res) {
        try {
            const response = await InterventionService.apiGetAll();
            res.json(response);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    // 🔍 Récupérer une intervention par ID
    static async apiGetById(req, res) {
        try {
            const { id } = req.params;
            const response = await InterventionService.apiGetAll(); // tu peux créer apiGetById si nécessaire
            const intervention = response.find(i => i.id === Number(id));
            if (!intervention) return res.status(404).send();
            res.json(intervention);
        } catch (error) {
            console.error(error.message);
            res.status(500).send();
        }
    }

    // 🔹 Endpoint pour récupérer le prochain numéro
    static async apiGetNextNumero(req, res) {
        try {
            const nextNumero = await InterventionService.getNextNumero();
            res.json({ nextNumero });
        } catch (error) {
            res.status(500).json({ message: "Erreur serveur" });
        }
    }

    // Assigner des techniciens à une intervention
    static async assignTechniciens(req, res) {
        try {
            const interventionId = req.params.id; // ID de l'intervention
            const { techniciens } = req.body; // tableau d'IDs de techniciens
            if (!Array.isArray(techniciens) || techniciens.length === 0) {
                return res.status(400).json({ message: 'Aucun technicien fourni' });
            }
            // Appeler le service pour assigner les techniciens
            const result = await InterventionService.assignTechniciens(interventionId, techniciens);
            res.status(200).json({
                message: 'Techniciens affectés avec succès',
                data: result
            });

        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Erreur lors de l’affectation des techniciens' });
        }
    }

    static async addPlanning(req, res) {
        try {
            const interventionId = req.params.id;
            const { date, heure } = req.body;

            if (!date || !heure) {
                return res.status(400).json({ message: 'Date et heure sont obligatoires' });
            }

            const result = await InterventionService.addPlanning(interventionId, { date, heure });

            res.status(200).json({
                message: 'Planning ajouté avec succès',
                data: result
            });

        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Erreur lors de l’ajout du planning' });
        }
    }


}

module.exports = Intervention;