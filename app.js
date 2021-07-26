/********* App.js fait appel aux différentes fonctions implémentées dans l'APi : **********/

const express = require('express'); //Ajout du frameWork "express":
const bodyParser = require('body-parser'); // Ajout de body-parser ce qui permet la conversion au format JSON:
const mongoose = require('mongoose'); //Importation de mongoose pour utiliser la BDD Mongo DB.
const path = require('path'); //Plugin qui sert dans l'upload des images et permet de travailler avec les répertoires et chemin de fichier


/*Importation des packages de sécurité pour être aux normes OWASP*/

const helmet = require('helmet'); // import helmet: aider à sécuriser les applications Express en définissant divers en-têtes HTTP.
const rateLimit = require('express-rate-limit'); // comme son nom l'indique: on va fixer un taux limite pour les requêtes.
const mongoSanitize = require('express-mongo-sanitize'); //Package mongo-express-sanitize : validation des données, enlève les données qui commencent par $, qui peuvent être utilisées par des hackers

require('dotenv').config(); //Plugin dotenv (masquage des données de connextion à la DBbase via un fichier dotenv et une création de variables pour le nom du user et le password)


/***********************************************************************************/
const app = express(); //UTILISATION D'EXPRESS

//Connexion à MongoBD et masquage d'USER, MPD, LINK avec DOTENV
const USER = process.env.USER;
const MDP = process.env.MDP;
const LINK = process.env.LINK

//Déclaration de la mise en connection à la base de donnée mongooseDB :
mongoose.connect(`mongodb+srv://${USER}:${MDP}@${LINK}`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


//CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});


/*SECURITE : lancement des middlewares et plugins de sécurité*/

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);
app.use(helmet());
app.use(mongoSanitize());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

//Déclaration et définition des routes des deux routeurs "Sauce"/"User" ainsi que pour les images téléchargées

const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;