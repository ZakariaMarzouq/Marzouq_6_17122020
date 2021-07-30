/*LOGIQUE ROUTE POUR CE QUI CONCERNE LES REQUETES SUR LES SAUCES */

const express = require("express");
const router = express.Router(); //Création d'un router Express qui contient toutes les routes des requêtes "Sauces"

const sauceCtrl = require("../controllers/sauce");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

//ROUTES PRODUIT :
router.post("/", auth, multer, sauceCtrl.createSauce); //Requête POST pour enregistrer une nouvelle sauce
router.get("/:id", auth, sauceCtrl.getOneSauce); //Requête GET pour récupérer une sauce en particulier
router.get("/", auth, sauceCtrl.getAllSauce); //Requête GET pour récupérer la liste des sauces
router.put("/:id", auth, multer, sauceCtrl.modifySauce); //Requête PUT pour modifier une sauce en particulier
router.delete("/:id", auth, sauceCtrl.deleteSauce); //Requête DELETE pour supprimer une sauce en particulier
router.post("/:id/like", auth, sauceCtrl.likeSauce); //Requête POST pour enregistrer un like/disklike

module.exports = router;
