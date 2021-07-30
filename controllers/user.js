/*LOGIQUE METIER POUR CE QUI CONCERNE L'AUTHENTIFICATION DES USERS */

const User = require("../models/user"); //Importation du modèles user
const bcrypt = require("bcrypt"); //Importation du package de cryptage des mots de passe
const jwt = require("jsonwebtoken"); //Importation du package qui permet de créer et de vérifier les tokens d'authentification
require("dotenv").config(); //Plugin dotenv (masquage des données de connexion
const CryptoJS = require("crypto-js");
const SHA256 = require("crypto-js/sha256");

//Fonction permettant la création d'un nouveau compte utilisateur :
exports.signup = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: CryptoJS.SHA256(req.body.email),
        password: hash,
      });
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) =>
          res
            .status(400)
            .json({ message: "L'utilisateur n'a pas pu être créé :" + error })
        );
    })
    .catch((error) => res.status(400).json({ error }));
};

//Fonction permettant la connextion d'un utilisateur existant en base de donnée :
exports.login = (req, res, next) => {
  User.findOne({
    email: CryptoJS.SHA256(req.body.email).toString(CryptoJS.enc.Hex),
  })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non trouvé !" });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect !" });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign(
              // Fonction d'encodage d'un nouveau token
              { userId: user._id },
              process.env.TOKEN,
              { expiresIn: "24h" }
            ),
          });
        })
        .catch((error) => res.status(600).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
