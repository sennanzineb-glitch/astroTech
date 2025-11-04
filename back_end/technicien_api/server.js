const express = require("express");
const app = express();
app.use(express.json());
require("dotenv").config();
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

const controllerTechnicien = require('./controllers/techniciens.controller');
const controllerEquipeTechnicien = require("./controllers/equipe_technicien.controller.js");

app.post(uri + "/equipe/", controllerEquipeTechnicien.apiCreate);
app.put(uri + "/equipe/:id", controllerEquipeTechnicien.apiUpdateById);
app.delete(uri + "/equipe/:id", controllerEquipeTechnicien.apiDeleteById);
app.get(uri + "/equipe/", controllerEquipeTechnicien.apiGetAll);
app.get(uri + "/equipe/:id", controllerEquipeTechnicien.apiGetById);
app.put(uri + "/equipe/:id/ajouter-technicien", controllerEquipeTechnicien.apiAddTechnicien);
app.put(uri + "/equipe/retirer-technicien/:technicienId", controllerEquipeTechnicien.apiRemoveTechnicien);
app.put(uri + "/equipe/:id/change-chef", controllerEquipeTechnicien.apiChangeChef);


/*** technicien ***/
app.put(uri + '/:id', controllerTechnicien.apiUpdateById);
app.get(uri + '/:id', controllerTechnicien.apiGetById);
app.delete(uri + '/:id', controllerTechnicien.apiDeleteById);
app.get(uri + '', controllerTechnicien.apiGetAll);
app.post(uri + '', controllerTechnicien.apiCreate);

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});