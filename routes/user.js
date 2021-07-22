/*LOGIQUE ROUTE POUR CE QUI CONCERNE L'AUTHENTIFICATION DES USERS */

const express = require('express');  //Ajout du frameWork "express":
const router = express.Router(); //Création d'un router Express qui contient toutes les routes des requêtes "Sauces"
const userCtrl = require('../controllers/user');
const verifyPassword = require('../middleware/verif-password');

router.post('/signup', verifyPassword, userCtrl.signup); //Requête POST créer un nouvelle utilisateur
router.post('/login', userCtrl.login); //Requête POST pour la connection d'un utilisateur existant

module.exports = router;
