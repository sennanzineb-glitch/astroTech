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

// === Admin ===
const controllerAdmin = require('./controllers/admin.controller.js');
const controllerUser = require('./controllers/user.controller.js');

// 🔹 Toutes les routes referent sécurisées
// Routes référents
app.get(`${URI}/admin/all`, authenticateToken, controllerAdmin.apiGetAdmins); // Liste simple

// --- LECTURE & STATS ---
// Liste complète pour le tableau (Remplace votre ancienne liste simple)
app.get(`${URI}/all`, authenticateToken, controllerUser.apiGetUsers); 
// Données de l'encadré de droite "Vue d'ensemble"
app.get(`${URI}/stats`, authenticateToken, controllerUser.apiGetStats); 

// Récupérer uniquement les membres ayant le rôle 'user'
app.get(`${URI}/clients`, authenticateToken, controllerUser.apiGetOnlyUsers);

// --- ACTIONS SUR UN UTILISATEUR UNIQUE ---
// Récupérer un utilisateur par son ID (Requis pour la page de modification)
app.get(`${URI}/:id`, authenticateToken, controllerUser.apiGetUserById);
// Bouton "Modifier" (Nom, Email, Rôle)
app.put(`${URI}/:id`, authenticateToken, controllerUser.apiUpdateUser); 
// Le Switch bleu (Activation / Blocage)
app.patch(`${URI}/:id/status`, authenticateToken, controllerUser.apiToggleStatus); 
// Bouton "MDP" (Modification du mot de passe)
app.patch(`${URI}/:id/password`, authenticateToken, controllerUser.apiUpdatePassword); 
// Bouton "Supprimer"
app.delete(`${URI}/:id`, authenticateToken, controllerUser.apiDeleteUser);
// Lié au bouton bleu "+ Ajouter un Utilisateur" de l'image
app.post(`${URI}/add`, authenticateToken, controllerUser.apiCreateUser);


// Démarrage du serveur
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});
