// server.js
const express = require("express");
const app = express();
require("dotenv").config();
const bodyParser = require('body-parser');
const cors = require('cors');

// Configuration
const PORT = process.env.PORT || 3000;
const URI = process.env.URI || "/api/v1";

// Middleware global
app.disable('x-powered-by');
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// === Auth ===
const { register, login, me } = require('./controllers/_auth.controller');
const { authenticateToken } = require('./middlewares/auth.js');

app.post(`${URI}/auth/register`, register);
app.post(`${URI}/auth/login`, login);
app.get(`${URI}/auth/me`, authenticateToken, me);

// === Interventions ===
const InterventionController = require('./controllers/intervention.controller.js');
const PlanningController = require('./controllers/planning.controller.js');
const controllerAffaire = require('./controllers/affaires.controller.js');

// GET nextNumero avans GET by id
app.get(`${URI}/interventions/nextNumero`, authenticateToken, InterventionController.apiGetNextNumero);

// Routes interventions
app.post(`${URI}/interventions`, authenticateToken, InterventionController.apiCreate);
app.put(`${URI}/interventions/:id`, authenticateToken, InterventionController.apiUpdateById);
app.delete(`${URI}/interventions/:id`, authenticateToken, InterventionController.apiDeleteById);
app.get(`${URI}/interventions`, authenticateToken, InterventionController.apiGetAll);
app.get(`${URI}/interventions/:id`, authenticateToken, InterventionController.apiGetById);
app.post(`${URI}/interventions/:id/assign-techniciens`, authenticateToken, InterventionController.assignTechniciens);
app.post(`${URI}/interventions/:id/add-planning`, authenticateToken, InterventionController.addPlanning);

// ➕ Ajouter une planification pour une intervention
app.post(`${URI}/interventions/:interventionId/planning`, authenticateToken, PlanningController.addPlanning);
app.get(`${URI}/planning`, authenticateToken, PlanningController.getAll);
app.put(`${URI}/planning/:id`, authenticateToken, PlanningController.updatePlanning);
app.delete(`${URI}/planning/:id`, authenticateToken, PlanningController.deletePlanning);

// === Affaires ===
app.post(`${URI}`, authenticateToken, controllerAffaire.apiCreate);
app.get(`${URI}`, authenticateToken, controllerAffaire.apiGetAll);
app.get(`${URI}/:id`, authenticateToken, controllerAffaire.apiGetById);
app.put(`${URI}/:id`, authenticateToken, controllerAffaire.apiUpdateById);
app.delete(`${URI}/:id`, authenticateToken, controllerAffaire.apiDeleteById);

// === Start the server ===
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});
