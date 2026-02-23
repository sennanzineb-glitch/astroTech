const TechnicienService = require("../services/techniciens.services");
const bcrypt = require('bcrypt');
const db = require('../db');

class Technicien {

    static async apiCreate(req, res) {
        try {
            let {
                nom,
                prenom,
                dateNaissance,
                adresse,
                telephone,
                email,
                pwd,
                specialite,
                certifications,
                experience,
                zoneIntervention,
                dateEmbauche,
                typeContrat,
                salaire,
                statut,
                createur_id = req.user.id
            } = req.body;

            // Validation des champs obligatoires
            if (!nom || !prenom || !telephone || !specialite) {
                return res.status(400).json({
                    error: "Les champs 'nom', 'prenom', 'telephone' et 'specialite' sont obligatoires"
                });
            }

            // Remplacer les champs optionnels vides par NULL
            dateNaissance = dateNaissance || null;
            adresse = adresse || null;
            email = email || null;
            pwd = pwd || null;
            certifications = certifications || null;
            experience = experience || null;
            zoneIntervention = zoneIntervention || null;
            dateEmbauche = dateEmbauche || null;
            typeContrat = typeContrat || null;
            salaire = salaire || null;
            statut = statut || null;
            createur_id = createur_id || null;

            const record = {
                nom,
                prenom,
                dateNaissance,
                adresse,
                telephone,
                email,
                pwd,
                specialite,
                certifications,
                experience,
                zoneIntervention,
                dateEmbauche,
                typeContrat,
                salaire,
                statut,
                createur_id
            };

            const response = await TechnicienService.createRecord(record);

            // Create corresponding user account if email and password are provided
            if (email && pwd) {
                try {
                    // Hash the password
                    const hashedPassword = await bcrypt.hash(pwd, 10);

                    // Create user account for mobile app login
                    const userQuery = `
                        INSERT INTO users (email, password_hash, full_name, role)
                        VALUES (?, ?, ?, 'technician')
                        ON DUPLICATE KEY UPDATE password_hash = ?
                    `;
                    const fullName = `${prenom} ${nom}`;
                    await db.execute(userQuery, [email, hashedPassword, fullName, hashedPassword]);

                    console.log(`User account created for technician: ${email}`);
                } catch (userError) {
                    console.error('Error creating user account:', userError);
                    // Don't fail the whole request if user creation fails
                }
            }

            res.status(201).json({ success: true, data: response });

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    }

    static async apiUpdateById(req, res) {
        try {
            const { id } = req.params;
            let {
                nom,
                prenom,
                dateNaissance,
                adresse,
                telephone,
                email,
                pwd,
                specialite,
                certifications,
                experience,
                zoneIntervention,
                dateEmbauche,
                typeContrat,
                salaire,
                statut
            } = req.body;

            // Validation des champs obligatoires
            if (!nom || !prenom || !telephone || !specialite) {
                return res.status(400).json({
                    error: "Les champs 'nom', 'prenom', 'telephone' et 'specialite' sont obligatoires"
                });
            }

            // Remplacer les champs optionnels vides par NULL
            dateNaissance = dateNaissance || null;
            adresse = adresse || null;
            email = email || null;
            pwd = pwd || null;
            certifications = certifications || null;
            experience = experience || null;
            zoneIntervention = zoneIntervention || null;
            dateEmbauche = dateEmbauche || null;
            typeContrat = typeContrat || null;
            salaire = salaire || null;
            statut = statut || null;

            const record = {
                nom,
                prenom,
                dateNaissance,
                adresse,
                telephone,
                email,
                pwd,
                specialite,
                certifications,
                experience,
                zoneIntervention,
                dateEmbauche,
                typeContrat,
                salaire,
                statut,
                id
            };

            const response = await TechnicienService.updateRecordById(record, id);
            res.json({ success: true, data: response });

        } catch (error) {
            console.error(error.message);
            res.status(500).json({ error: error.message });
        }
    }

    static async apiDeleteById(req, res) {
        try {
            const { id } = req.params;

            await TechnicienService.deleteRecordById(id);
            res.send();

        } catch (error) {
            console.log(error.message);
            res.status(500).send();
        }
    }

    static async apiGetAll(req, res) {
        try {
            const response = await TechnicienService.getAllRecords();
            res.json(response);

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    // 📄 GET /techniciens
    static async apiGetAllWithPaginated(req, res) {
        try {
            let { page = 1, limit = 10, search = '' } = req.query;
            const userId = req.user?.id || null;

            page = Number(page);
            limit = Number(limit);

            const result = await TechnicienService.getAllRecordsPaginated({
                page,
                limit,
                search,
                userId
            });

            res.status(200).json({
                success: true,
                page,
                limit,
                total: result.total,
                data: result.data
            });

        } catch (err) {
            console.error('Erreur apiGetAllWithPaginated:', err);
            res.status(500).json({
                success: false,
                error: 'Internal Server Error'
            });
        }
    }


    static async apiGetById(req, res) {
        try {
            const { id } = req.params;

            const response = await TechnicienService.getRecordById(id);
            if (!response) return res.status(404).send();

            res.json(response);
        } catch (error) {
            console.error(error.message);
            res.status(500).send();
        }
    }

}

module.exports = Technicien;