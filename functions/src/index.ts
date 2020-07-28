//import libraries
import * as functions from 'firebase-functions';
import * as express from 'express';
import * as bodyParser from 'body-parser';
const cors = require('cors')({ origin: true });
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors);

//Declare your API
var globalcontroller = require('./controller/UserController')();
app.use('/api', globalcontroller);

export const webApi = functions.https.onRequest(app);
