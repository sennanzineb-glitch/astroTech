const AdminService = require("../services/admin.services");

class Admin {

    // controllers/chat.controller.js
    static async apiGetAdmins(req, res) {
        try {
            const admins = await AdminService.getAllAdmins();
            res.status(200).json({ success: true, data: admins });
        } catch (error) {
            res.status(500).json({ error: "Erreur lors de la récupération des admins" });
        }
    }
}

module.exports = Admin;