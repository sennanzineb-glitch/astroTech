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


// const port = process.env.PORT || 3000;
// app.listen(port, () => console.log(`Server started on ${port}`));

/** **/


//const auth = require('./middlewares/auth');
const controllerClient = require('./controllers/clients.controller');
const controllerOrganisation = require('./controllers/organisations.controller');
const controllerAgence = require('./controllers/agences.controller');
const controllerParticulier = require('./controllers/particuliers.controller');
const controllerAdresse = require('./controllers/adresses.controller');
const controllerContact = require('./controllers/contacts.controller');
const controllerAdresseEmail = require('./controllers/adresse_email.controller');
const controllerNumTel = require('./controllers/num_tel.controller');

/*** num_tel ***/
app.get(uri + '/num_tel', controllerNumTel.apiGetAll);
app.post(uri + '/num_tel', controllerNumTel.apiCreate);
app.put(uri + '/num_tel/:id', controllerNumTel.apiUpdateById);
app.get(uri + '/num_tel/:id', controllerNumTel.apiGetById);
app.delete(uri + '/num_tel/:id', controllerNumTel.apiDeleteById);

/*** adresse_email ***/
app.get(uri + '/adresse_email', controllerAdresseEmail.apiGetAll);
app.post(uri + '/adresse_email', controllerAdresseEmail.apiCreate);
app.put(uri + '/adresse_email/:id', controllerAdresseEmail.apiUpdateById);
app.get(uri + '/adresse_email/:id', controllerAdresseEmail.apiGetById);
app.delete(uri + '/adresse_email/:id', controllerAdresseEmail.apiDeleteById);

/***contact ***/
app.get(uri + '/contact', controllerContact.apiGetAll);
app.post(uri + '/contact', controllerContact.apiCreate);
app.put(uri + '/contact/:id', controllerContact.apiUpdateById);
app.get(uri + '/contact/:id', controllerContact.apiGetById);
app.delete(uri + '/contact/:id', controllerContact.apiDeleteById);

/*** Adresse ***/
app.get(uri + '/adresse', controllerAdresse.apiGetAll);
app.post(uri + '/adresse', controllerAdresse.apiCreate);
app.put(uri + '/adresse/:id', controllerAdresse.apiUpdateById);
app.get(uri + '/adresse/:id', controllerAdresse.apiGetById);
app.delete(uri + '/adresse/:id', controllerAdresse.apiDeleteById);

/*** Particulier ***/
app.get(uri + '/particulier', controllerParticulier.apiGetAll);
app.post(uri + '/particulier', controllerParticulier.apiCreate);
app.put(uri + '/particulier/:id', controllerParticulier.apiUpdateById);
app.get(uri + '/particulier/:id', controllerParticulier.apiGetById);
app.delete(uri + '/particulier/:id', controllerParticulier.apiDeleteById);

/*** Agence ***/
app.get(uri + '/agence', controllerAgence.apiGetAll);
app.post(uri + '/agence', controllerAgence.apiCreate);
app.put(uri + '/agence/:id', controllerAgence.apiUpdateById);
app.get(uri + '/agence/:id', controllerAgence.apiGetById);
app.delete(uri + '/agence/:id', controllerAgence.apiDeleteById);

/*** Organisations ***/
app.get(uri + '/organisation', controllerOrganisation.apiGetAll);
app.post(uri + '/organisation', controllerOrganisation.apiCreate);
app.put(uri + '/organisation/:id', controllerOrganisation.apiUpdateById);
app.get(uri + '/organisation/:id', controllerOrganisation.apiGetById);
app.delete(uri + '/organisation/:id', controllerOrganisation.apiDeleteById);

/*** Clients ***/
app.get(uri + '', controllerClient.apiGetAll);
app.get(uri + '/contacts', controllerClient.apigetAllClientsWithContacts);
app.post(uri + '', controllerClient.apiCreate);
app.put(uri + '/:id', controllerClient.apiUpdateById);
app.get(uri + '/:id', controllerClient.apiGetById);
app.get(uri + '/details/:id', controllerClient.getRecordDetails);
app.delete(uri + '/:id', controllerClient.apiDeleteById);


// Start the server
// app.listen(PORT, () => {
//     console.log(`Server running at http://localhost:${PORT}`);
// });

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});
