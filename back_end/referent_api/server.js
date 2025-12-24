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
app.get(`${URI}`, authenticateToken, controllerReferent.apiGetAll);
app.get(`${URI}/:id`, authenticateToken, controllerReferent.apiGetById);
app.post(`${URI}`, authenticateToken, controllerReferent.apiCreate);
app.put(`${URI}/:id`, authenticateToken, controllerReferent.apiUpdateById);
app.delete(`${URI}/:id`, authenticateToken, controllerReferent.apiDeleteById);

// Démarrage du serveur
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});
