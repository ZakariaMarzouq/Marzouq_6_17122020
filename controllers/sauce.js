const Sauce = require("../models/sauce"); //Importation du modèles Sauce
const fs = require("fs"); //Importation du package fs, qui permet entre autres de supprimer des fichiers

//ROUTE - Ajout produit:
exports.createSauce = (req, res, next) => {
  const sauceObjet = JSON.parse(req.body.sauce);
  delete sauceObjet._id;
  const sauce = new Sauce({
    ...sauceObjet,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  });
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Sauce enregistrée !" }))
    .catch((error) => res.status(400).json({ error }));
};

//ROUTE - Affichage de produit unique:
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id,
  })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

//ROUTE - Affichage de tous les produits:
exports.getAllSauce = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

//ROUTE - Modification Produit:
exports.modifySauce = (req, res, next) => {
  const sauceObjet = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  const sauce = new Sauce({
    ...sauceObjet,
  });
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObjet, _id: req.params.id })
    .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
    .catch((error) => res.status(400).json({ error }));
};

//ROUTE Suppression Produit:
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Sauce supprimée !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

//Like et desliked des sauces
//L' "$pull" opérateur supprime d'un tableau existant toutes les instances d'une valeur ou des valeurs qui correspondent à une condition spécifiée.
exports.likeSauce = (req, res, next) => {
  switch (req.body.like) {
    // Défault = 0
    // Vérification que l'utilisateur n'a pas déjà like la sauce
    case 0:
      //Si le user reclique sur like ou dislike, annulation du like ou du dislike précédent
      console.log("ça annule le like ou le dislike !");
      Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
          console.log(sauce);
          if (sauce.usersLiked.find((user) => user === req.body.userId)) {
            Sauce.updateOne(
              { _id: req.params.id },
              {
                $inc: { likes: -1 },
                $pull: { usersLiked: req.body.userId },
                _id: req.params.id,
              }
            )
              .then(() => {
                res
                  .status(201)
                  .json({ message: "Ton avis a été pris en compte!" });
              })
              .catch((error) => {
                res.status(400).json({ error: error });
              });

            // Vérification que l'utilisateur n'a pas déjà disliked la sauce
          }
          if (sauce.usersDisliked.find((user) => user === req.body.userId)) {
            Sauce.updateOne(
              { _id: req.params.id },
              {
                $inc: { dislikes: -1 },
                $pull: { usersDisliked: req.body.userId },
                _id: req.params.id,
              }
            )
              .then(() => {
                res
                  .status(201)
                  .json({ message: "Ton avis a été pris en compte!" });
              })
              .catch((error) => {
                res.status(400).json({ error: error });
              });
          }
        })
        .catch((error) => {
          res.status(404).json({ error: error });
        });
      break;

    //Si le user a cliqué sur like, on met à jour le produit sauce en incrémentant les likes de 1 et en intégrand l'id du user dans le tableau usersLiked
    case 1:
      console.log("J'aime cette sauce !");
      Sauce.updateOne(
        { _id: req.params.id },
        {
          $inc: { likes: 1 },
          $push: { usersLiked: req.body.userId },
          _id: req.params.id,
        }
      )
        .then(() => {
          res
            .status(201)
            .json({ message: 'Ton "J\'aime" a été pris en compte!' });
        })
        .catch((error) => {
          res.status(400).json({ error: error });
        });
      break;

    //Si le user a cliqué sur dislike, on met à jour le produit sauce en incrémentant les dislikes de 1 et en intégrant l'id du user dans le tableau usersDisliked
    case -1:
      console.log("Je n'aime pas cette sauce !");
      Sauce.updateOne(
        { _id: req.params.id },
        {
          $inc: { dislikes: 1 },
          $push: { usersDisliked: req.body.userId },
          _id: req.params.id,
        }
      )
        .then(() => {
          res
            .status(201)
            .json({ message: 'Ton "J\'aime pas" a été pris en compte !' });
        })
        .catch((error) => {
          res.status(400).json({ error: error });
        });
      break;
    default:
      console.error("mauvaise requête");
  }
};
