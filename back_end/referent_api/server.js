// server.js
const express = require("express");
const app = express();
require("dotenv").config();
const bodyParser = require('body-parser');
const cors = require('cors');

const PORT = process.env.PORT || 3000;
const URI = process.env.URI || "/api/v1/referents"; // préfixe par défaut pour referents

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

// === Referents ===
const controllerReferent = require('./controllers/referents.controller.js');

// 🔹 Toutes les routes referent sécurisées
// Routes référents
app.get(`${URI}/all`, authenticateToken, controllerReferent.apiGetAll); // Liste simple ou page d'accueil
app.get(`${URI}`, authenticateToken, controllerReferent.apiGetAllWithPaginated); // Liste paginée
app.get(`${URI}/:id`, authenticateToken, controllerReferent.apiGetById); // Récupérer un par ID
app.post(`${URI}`, authenticateToken, controllerReferent.apiCreate); // Créer
app.put(`${URI}/:id`, authenticateToken, controllerReferent.apiUpdateById); // Mettre à jour
app.delete(`${URI}/:id`, authenticateToken, controllerReferent.apiDeleteById); // Supprimer

// Démarrage du serveur
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});
