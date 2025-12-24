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
app.post(`${URI}/equipe/`, authenticateToken, controllerEquipeTechnicien.apiCreate);
app.put(`${URI}/equipe/:id`, authenticateToken, controllerEquipeTechnicien.apiUpdateById);
app.delete(`${URI}/equipe/:id`, authenticateToken, controllerEquipeTechnicien.apiDeleteById);
app.get(`${URI}/equipe/`, authenticateToken, controllerEquipeTechnicien.apiGetAll);
app.get(`${URI}/equipe/:id`, authenticateToken, controllerEquipeTechnicien.apiGetById);
app.put(`${URI}/equipe/:id/ajouter-technicien`, authenticateToken, controllerEquipeTechnicien.apiAddTechnicien);
app.put(`${URI}/equipe/retirer-technicien/:technicienId`, authenticateToken, controllerEquipeTechnicien.apiRemoveTechnicien);
app.put(`${URI}/equipe/:id/change-chef`, authenticateToken, controllerEquipeTechnicien.apiChangeChef);

// === Technicien ===
// Toutes les routes sécurisées
app.get(`${URI}`, authenticateToken, controllerTechnicien.apiGetAll);
app.get(`${URI}/:id`, authenticateToken, controllerTechnicien.apiGetById);
app.post(`${URI}`, authenticateToken, controllerTechnicien.apiCreate);
app.put(`${URI}/:id`, authenticateToken, controllerTechnicien.apiUpdateById);
app.delete(`${URI}/:id`, authenticateToken, controllerTechnicien.apiDeleteById);

// Démarrage du serveur
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});
