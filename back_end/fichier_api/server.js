// server.js
const express = require("express");
const app = express();
require("dotenv").config();
const path = require('path');   // ← important
const bodyParser = require('body-parser');
const cors = require('cors');

const PORT = process.env.PORT || 3000;
const URI = process.env.URI || "/api/v1/fichiers"; // préfixe pour les fichiers

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

// === Fichiers ===
const controllerFichier = require('./controllers/fichiers.controller.js');

// 🔹 Récupérer tous les fichiers (sécurisé)
app.get(`${URI}/`, authenticateToken, controllerFichier.apiGetAll);

// 🔹 Télécharger / uploader des fichiers (sécurisé)
app.post(`${URI}/upload`, authenticateToken, controllerFichier.apiUploadFiles);

// 🔹 Supprimer un fichier par id (sécurisé)
app.delete(`${URI}/:id`, authenticateToken, controllerFichier.apiDeleteById);

// 🔹 Récupérer tous les fichiers par référent (sécurisé)
app.get(`${URI}/referent/:id`, authenticateToken, controllerFichier.getRecordsByReferent);

// Rendre le dossier uploads accessible publiquement
const UPLOAD_DIR = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(UPLOAD_DIR));

// Démarrage du serveur
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});
