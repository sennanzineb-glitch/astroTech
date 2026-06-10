const UserService = require("../services/user.service");
const bcrypt = require('bcrypt'); // Requis pour sécuriser les mots de passe à la création
const SALT_ROUNDS = 10;

class UserController {

    // GET - Récupérer la liste complète
    static async apiGetUsers(req, res) {
        try {
            const users = await UserService.getAllUsers();
            res.status(200).json({ success: true, data: users });
        } catch (error) {
            res.status(500).json({ success: false, error: "Impossible de récupérer les utilisateurs." });
        }
    }

    // GET - Récupérer uniquement les simples utilisateurs (clients)
    static async apiGetOnlyUsers(req, res) {
        try {
            const users = await UserService.getOnlyUsers();
            res.status(200).json({ success: true, data: users });
        } catch (error) {
            res.status(500).json({ success: false, error: "Erreur lors de la récupération des clients." });
        }
    }

    /**
     * AJOUTÉ : GET - Récupérer un utilisateur unique par son ID
     * URL attendue : GET /api/v1/users/:id
     */
    static async apiGetUserById(req, res) {
        try {
            const { id } = req.params;
            const user = await UserService.getUserById(id);
            
            if (user) {
                res.status(200).json({ success: true, user });
            } else {
                res.status(404).json({ success: false, error: "Utilisateur non trouvé." });
            }
        } catch (error) {
            console.error("Erreur apiGetUserById:", error);
            res.status(500).json({ success: false, error: "Erreur lors de la récupération de l'utilisateur." });
        }
    }

    // POST - Ajouter un utilisateur
    static async apiCreateUser(req, res) {
        try {
            const userData = req.body;

            if (!userData.password_hash) {
                return res.status(400).json({ success: false, error: "Le mot de passe est obligatoire." });
            }

            // Hachage automatique du mot de passe avant de l'envoyer au service
            userData.password_hash = await bcrypt.hash(userData.password_hash, SALT_ROUNDS);

            const userId = await UserService.createUser(userData);
            res.status(201).json({ success: true, message: "Utilisateur créé avec succès", userId });
        } catch (error) {
            console.error("Erreur apiCreateUser:", error);
            res.status(500).json({ success: false, error: "Erreur lors de la création." });
        }
    }

    // PUT - Modifier les informations de base
    static async apiUpdateUser(req, res) {
        try {
            const { id } = req.params;
            const updated = await UserService.updateUser(id, req.body);
            if (updated) {
                res.status(200).json({ success: true, message: "Utilisateur mis à jour." });
            } else {
                res.status(404).json({ success: false, error: "Utilisateur non trouvé." });
            }
        } catch (error) {
            res.status(500).json({ success: false, error: "Erreur lors de la modification." });
        }
    }

    // PATCH - Changer le statut (Activer/Bloquer via le Switch)
    static async apiToggleStatus(req, res) {
        try {
            const { id } = req.params;
            const { is_active } = req.body; // attend un booléen
            const updated = await UserService.toggleStatus(id, is_active);
            if (updated) {
                res.status(200).json({ success: true, message: "Statut mis à jour avec succès." });
            } else {
                res.status(404).json({ success: false, error: "Utilisateur introuvable." });
            }
        } catch (error) {
            res.status(500).json({ success: false, error: "Erreur lors du changement de statut." });
        }
    }

    // PATCH - Changer le mot de passe (Bouton MDP sans oldPassword)
    static async apiUpdatePassword(req, res) {
        try {
            const { newPassword } = req.body; // Reçoit uniquement newPassword
            const { id } = req.params;        // Récupère l'id depuis l'URL /api/v1/users/:id/password

            // Validation basique : on vérifie uniquement le nouveau mot de passe
            if (!newPassword) {
                return res.status(400).json({ success: false, message: "Le nouveau mot de passe est requis" });
            }

            // Appel de la couche Service (avec uniquement id et newPassword)
            const result = await UserService.updatePassword(id, newPassword);

            // Si la modification a échoué
            if (!result.success) {
                if (result.reason === 'USER_NOT_FOUND') {
                    return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
                }
                return res.status(400).json({ success: false, message: 'Impossible de modifier le mot de passe' });
            }

            // Si tout s'est bien passé
            return res.status(200).json({ success: true, message: 'Mot de passe modifié avec succès' });

        } catch (err) {
            console.error('Erreur globale dans apiUpdatePassword:', err);
            return res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
        }
    }

    // DELETE - Supprimer un utilisateur
    static async apiDeleteUser(req, res) {
        try {
            const { id } = req.params;
            const deleted = await UserService.deleteUser(id);
            if (deleted) {
                res.status(200).json({ success: true, message: "Utilisateur supprimé." });
            } else {
                res.status(404).json({ success: false, error: "Utilisateur non trouvé." });
            }
        } catch (error) {
            res.status(500).json({ success: false, error: "Erreur lors de la suppression." });
        }
    }

    // GET - Obtenir les données des encadrés de droite (Vue d'ensemble)
    static async apiGetStats(req, res) {
        try {
            const stats = await UserService.getStats();
            res.status(200).json({ success: true, data: stats });
        } catch (error) {
            res.status(500).json({ success: false, error: "Erreur lors du calcul des statistiques." });
        }
    }
}

module.exports = UserController;