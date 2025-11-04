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
/** **/

const controllerReferent = require('./controllers/referents.controller.js');

/*** Referent ***/
app.put(uri + '/:id', controllerReferent.apiUpdateById);
app.get(uri + '/:id', controllerReferent.apiGetById);
app.delete(uri + '/:id', controllerReferent.apiDeleteById);
app.get(uri + '', controllerReferent.apiGetAll);
app.post(uri + '', controllerReferent.apiCreate);

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});