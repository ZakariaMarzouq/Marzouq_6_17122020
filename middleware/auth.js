/*MIDDLEWARE D'AUTHENTIFICATION */

//Importation du package qui permet de créer et de vérifier les tokens d'authentification
const jwt = require("jsonwebtoken");
require("dotenv").config();

/** AUthentification **/

//Plugin dotenv pour le masquage de données
const TOKEN = process.env.TOKEN;

module.exports = (req, res, next) => {
  try {
    //Récupération du token contenu dans les headers
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, TOKEN);
    //Extraction de l'id contenu dans le token
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      throw "ID utilisateur n'est pas valide";
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({ error: new Error("Requête non authentifiée !") });
  }
};
