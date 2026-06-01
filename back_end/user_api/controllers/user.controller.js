const UserService = require("../services/user.service");
// Note : Si vous chiffrez le mot de passe ici, importez bcrypt :
// const bcrypt = require('bcrypt');

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

    // POST - Ajouter un utilisateur
    static async apiCreateUser(req, res) {
        try {
            // Exemple basique. En production, pensez à hasher le mot de passe avant !
            const userId = await UserService.createUser(req.body);
            res.status(201).json({ success: true, message: "Utilisateur créé avec succès", userId });
        } catch (error) {
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


    // PATCH - Changer le mot de passe (Bouton MDP)
    static async apiUpdatePassword(req, res) {
        try {

            console.log("*** Bonjour tous le monde ! (controller) ***");
            

            const { id } = req.params;
            const { newPassword } = req.body; // Récupère le mot de passe en clair envoyé par Angular

            console.log(req.body);
            

            if (!newPassword || newPassword.trim() === '') {
                return res.status(400).json({ success: false, error: "Le nouveau mot de passe est requis." });
            }

            // On passe le mot de passe en clair au service qui va le hacher
            const updated = await UserService.updatePassword(id, newPassword);

            if (updated) {
                res.status(200).json({ success: true, message: "Mot de passe modifié." });
            } else {
                res.status(404).json({ success: false, error: "Utilisateur non trouvé." });
            }
        } catch (error) {
            console.error('Erreur dans apiUpdatePassword:', error);
            res.status(500).json({ success: false, error: "Erreur lors de la modification du mot de passe." });
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