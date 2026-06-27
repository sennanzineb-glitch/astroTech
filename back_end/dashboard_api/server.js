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

// === Import des Contrôleurs et Middlewares ===
const { register, login, me } = require('./controllers/_auth.controller');
const { authenticateToken } = require('./middlewares/auth.js');

const dashboardController = require('./controllers/dashboard.controller.js');
const widgetController = require('./controllers/widget.controller.js');

// ==========================================
// 🔐 AUTHENTIFICATION
// ==========================================
app.post(`${URI}/auth/register`, register);
app.post(`${URI}/auth/login`, login);
app.get(`${URI}/auth/me`, authenticateToken, me);

// ==========================================
// 📊 DASHBOARD & WIDGETS
// ==========================================
// تأكد من حماية هذه المسارات بـ authenticateToken إذا كان ذلك مطلوباً في نظامك

// --- مسارات لوحات التحكم (Dashboards) ---
app.post(`${URI}/`, authenticateToken, dashboardController.createDashboard);
app.get(`${URI}/`, authenticateToken, dashboardController.getUserDashboards);
app.delete(`${URI}/:id`, authenticateToken, dashboardController.deleteDashboard);

// --- Routes des Vignettes et Statistiques (Widgets & Stats) ---
app.post(`${URI}/:dashboardId/widgets`, authenticateToken, widgetController.createWidget);
app.get(`${URI}/:dashboardId/widgets`, authenticateToken, widgetController.getWidgetsByDashboard);
app.get(`${URI}/:dashboardId/stats`, authenticateToken, widgetController.getDashboardStats);
app.delete(`${URI}/:dashboardId/widgets/:widgetId`, authenticateToken, widgetController.deleteWidget);


// Gestion globale des erreurs 404
app.use((req, res) => {
    res.status(404).json({ error: "Route non trouvée." });
});

// ==========================================
// 🚀 LANCEMENT DU SERVEUR
// ==========================================
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ AstroTech Server running at http://localhost:${PORT}`);
    console.log(`🌐 API Base URL: ${URI}`);
});