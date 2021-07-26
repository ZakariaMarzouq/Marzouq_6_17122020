/*LOGIQUE METIER POUR CE QUI CONCERNE L'AUTHENTIFICATION DES USERS */

const User = require('../models/user'); //Importation du modèles user 
const bcrypt = require('bcrypt'); //Importation du package de cryptage des mots de passe
const jwt = require('jsonwebtoken'); //Importation du package qui permet de créer et de vérifier les tokens d'authentification
require('dotenv').config(); //Plugin dotenv (masquage des données de connexion
const TOKEN = process.env.TOKEN

//Fonction permettant la création d'un nouveau compte utilisateur :
exports.signup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    res.status(400).send('Merci de fournir un email et un mot de passe ! ')
  }
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      //Création d'un nouvel utilisateur
      const user = new User({
        email: req.body.email,
        password: hash
      });
      //Enregistrement du new user dans la base de données
      user.save()
        .then(() => res.status(201).json({message:'Utilisateur Créé !'}))
        .catch(error => res.status(400).json({error}));
    })
    .catch(error => res.status(500).json({error}));
};


//Fonction permettant la connextion d'un utilisateur existant en base de donnée :
exports.login = (req, res, next) => {
  //Recherche de l'utilisateur dans la DB via son email (que l'on masque au passage avec Rot13 pour pouvoir le comparer aux emails stockés masqués)
  User.findOne({ email: req.body.email })
  .then(user => {
    if (!user) {
      return res.status(401).json({ error: 'Utilisateur non trouvé !' });
    }
    bcrypt.compare(req.body.password, user.password)
      .then(valid => {
        if (!valid) {
          return res.status(401).json({ error: 'Mot de passe incorrect !' });
        }
        res.status(200).json({
          userId: user._id,
          //Encodage d'un nouveau token
          token: jwt.sign(
              { userId: user._id },
              TOKEN,
              { expiresIn: '8h' }
          )
        });
      })
      .catch(error => res.status(500).json({ error }));
  })
  .catch(error => res.status(500).json({ error }));
};
