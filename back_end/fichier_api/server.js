const express = require("express");
const app = express();
app.use(express.json());
require("dotenv").config();
const path = require('path');   // ← important
const PORT = process.env.PORT || 3000;
const uri = process.env.URI;

const bodyParser = require('body-parser');
const cors = require('cors');

app.disable('x-powered-by');
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/** **/
const { register, login, me } = require('./controllers/_auth.controller');
const { authenticateToken } = require('./middlewares/auth.js');

app.use(cors());
app.use(bodyParser.json());

app.post('/api/v1/auth/register', register);
app.post('/api/v1/auth/login', login);
app.get('/api/v1/auth/me', authenticateToken, me);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server started on ${port}`));
/** **/

const controllerFichier = require('./controllers/fichiers.controller.js');

// 🔹 Récupérer tous les fichiers
app.get(uri +'/', controllerFichier.apiGetAll);

// 🔹 Télécharger / uploader des fichiers
app.post(uri +'/upload', controllerFichier.apiUploadFiles);

// 🔹 Supprimer un fichier par id
app.delete(uri +'/:id', controllerFichier.apiDeleteById);

// 🔹 Récupérer tous les fichiers by Referent
app.get(uri +'/referent/:id', controllerFichier.getRecordsByReferent);

const UPLOAD_DIR = path.join(__dirname, 'uploads');
// rendre le dossier uploads accessible publiquement
app.use('/uploads', express.static(UPLOAD_DIR));


// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});
