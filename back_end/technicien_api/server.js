// server.js
const express = require("express");
const app = express();
require("dotenv").config();
const bodyParser = require('body-parser');
const cors = require('cors');

const PORT = process.env.PORT || 3000;
const URI = process.env.URI || "/api/v1"; // préfixe général pour techniciens et équipes

// Middleware global
app.disable('x-powered-by');
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// === Auth ===
const { register, login, me } = require('./controllers/_auth.controller');
const { authenticateToken } = require('./middlewares/auth.js');

// Routes publiques (Auth)
app.post('/api/v1/auth/register', register);
app.post('/api/v1/auth/login', login);

// Route sécurisée (Auth)
app.get('/api/v1/auth/me', authenticateToken, me);

// === Controllers ===
const controllerTechnicien = require('./controllers/techniciens.controller');
const controllerEquipeTechnicien = require("./controllers/equipe_technicien.controller.js");

// === Equipe Technicien ===
// Toutes les routes sécurisées
// ===== GET =====
app.get(`${URI}/equipe/all`, authenticateToken, controllerEquipeTechnicien.apiGetAll);                // Tous les enregistrements
app.get(`${URI}/equipe`, authenticateToken, controllerEquipeTechnicien.apiGetAllWithPaginated);      // Pagination
app.get(`${URI}/equipe/:id`, authenticateToken, controllerEquipeTechnicien.apiGetById);               // Détail d'une équipe
// ===== POST =====
app.post(`${URI}/equipe/`, authenticateToken, controllerEquipeTechnicien.apiCreate);                 // Créer une équipe
// ===== PUT =====
app.put(`${URI}/equipe/:id`, authenticateToken, controllerEquipeTechnicien.apiUpdateById);           // Modifier une équipe
app.put(`${URI}/equipe/:id/ajouter-technicien`, authenticateToken, controllerEquipeTechnicien.apiAddTechnicien); // Ajouter un technicien
app.put(`${URI}/equipe/retirer-technicien/:technicienId`, authenticateToken, controllerEquipeTechnicien.apiRemoveTechnicien); // Retirer un technicien
app.put(`${URI}/equipe/:id/change-chef`, authenticateToken, controllerEquipeTechnicien.apiChangeChef); // Changer le chef
// ===== DELETE =====
app.delete(`${URI}/equipe/:id`, authenticateToken, controllerEquipeTechnicien.apiDeleteById);        // Supprimer une équipe


// === Technicien ===
// Toutes les routes sécurisées
// Routes Technicien
app.get(`${URI}/all`, authenticateToken, controllerTechnicien.apiGetAll); // tous les techniciens (sans pagination)
app.get(`${URI}`, authenticateToken, controllerTechnicien.apiGetAllWithPaginated); // techniciens paginés
app.get(`${URI}/:id`, authenticateToken, controllerTechnicien.apiGetById); // technicien par ID
app.post(`${URI}`, authenticateToken, controllerTechnicien.apiCreate); // créer technicien
app.put(`${URI}/:id`, authenticateToken, controllerTechnicien.apiUpdateById); // mettre à jour
app.delete(`${URI}/:id`, authenticateToken, controllerTechnicien.apiDeleteById); // supprimer


// Démarrage du serveur
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});
