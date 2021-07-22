/*LOGIQUE METIER POUR CE QUI CONCERNE L'AUTHENTIFICATION DES USERS */

const User = require('../models/user'); //Importation du modèles Sauce 
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
              { expiresIn: '24h' }
          )
        });
      })
      .catch(error => res.status(500).json({ error }));
  })
  .catch(error => res.status(500).json({ error }));
};





/* 

**************CONGIF 1 (faite avec JILAN)
exports.signup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  console.log(req)
  console.log(email)
  console.log(password)
  if (!email || !password) {
    res.status(400).send('Merci de fournir un email et un mot de passe ! ')
  }
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      user.save()
        .then(() => res.status(201).json({message:'Utilisateur Créé !'}))
        .catch(error => res.status(400).json({error}));
    })
    .catch(error => res.status(500).json({error}));
};



**************CONGIF 2
//const sha256 = require("crypto-js/sha256");
//console.log(sha256);

const regExEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const regExMdp = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.{6,})/;

//Fonction permettant la création d'un nouveau compte utilisateur :
exports.signup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!regExEmail.test(email) || !regExMdp.test(password)) {
    res
      .status(400)
      .send(
         "Merci de fournir une adresse email valide et un mot de passe contenant une Lettre majuscule, une minuscule et au moins 1 chiffre (6 caractères min) !"
      );
  }; 
  
  
  -------------------------------------------------
  **************CONGIF 3
  exports.signup = (req, res, next) => {
  // Password is not acceptable
  if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.{6,})/.test(req.body.password)) {   // Test password strength
    return res.status(401).json({ error: 'Le mot de passe doit contenir une lettre majuscule, une minuscule et au moins 1 chiffre (6 caractères min)' });
  } else {
    // Password is acceptable, hash it
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        const user = new User({
          email: req.body.email,
          password: hash
        })
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  }
};
  */