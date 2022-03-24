const Sauces = require("../models/Sauces");
const fs = require("fs");

// on export un fonction pour la création d'un objet
exports.createSauce = (req, res, next) => {
  const saucesObject = JSON.parse(req.body.sauce);
  delete saucesObject._id;
  const sauces = new Sauces({
    //L'opérateur spread ... est utilisé pour faire une copie de tous les éléments de req.body
    ...saucesObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    likes: 0,
    dislikes: 0,
  });
  //La méthode save() renvoie une Promise,et qui enregistre simplement votre Thing dans la base de données.
  sauces
    .save()
    //dans notre bloc then() , nous renverrons une réponse de réussite avec un code 201 de réussite
    .then(() => res.status(201).json({ message: "Objet enregistré !" }))
    //Dans notre bloc catch() , nous renverrons une réponse avec l'erreur générée par Mongoose ainsi qu'un code d'erreur 400.
    .catch((error) => res.status(400).json({ error }));
};

// la route pour "modifier"
exports.modifySauce = (req, res, next) => {
  const saucesObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  // la méthode updateOne() dans notre modèle Thing nous permet de mettre à jour le Thing qui correspond à l'objet que nous passons comme premier argument.
  // Nous utilisons aussi le paramètre id passé dans la demande, et le remplaçons par le Thing passé comme second argument.
  Sauces.updateOne(
    { _id: req.params.id },
    { ...saucesObject, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: "Objet modifié !" }))
    .catch((error) => res.status(400).json({ error }));
};

// la route pour "supprimer"
exports.deleteSauce = (req, res, next) => {
  //on trouve l'objet dans la base de donnée
  Sauces.findOne({ _id: req.params.id })
    //on le trouve
    .then((sauces) => {
      // on extrait le nom du fichier à supprimer
      const filename = sauces.imageUrl.split("/images/")[1];
      // on le supprime avec "unlink"
      fs.unlink(`images/${filename}`, () => {
        // on fais la suppression dans la base
        Sauces.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Objet supprimé !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

// on recupere un seul objet
exports.getOneSauce = (req, res, next) => {
  //nous utilisons ensuite la méthode findOne() dans notre modèle Thing pour trouver le Thing unique ayant le même _id que le paramètre de la requête ;
  Sauces.findOne({ _id: req.params.id })
    //ce Thing est ensuite retourné dans une Promise et envoyé au front-end ;
    .then((sauces) => res.status(200).json(sauces))
    //si aucun Thing n'est trouvé ou si une erreur se produit, nous envoyons une erreur 404 au front-end, avec l'erreur générée.
    .catch((error) => res.status(404).json({ error }));
};
//on recupere tt les objets
exports.getAllSauces = (req, res, next) => {
  Sauces.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

/**
 * LIKE / DISLIKE UNE SAUCE
 */
exports.likeSauce = (req, res, next) => {
  const userId = req.body.userId;
  const like = req.body.like;
  const sauceId = req.params.id;
  Sauces.findOne({ _id: sauceId })
    .then((sauces) => {
      // nouvelles valeurs à modifier
      const newValues = {
        usersLiked: sauces.usersLiked,
        usersDisliked: sauces.usersDisliked,
        likes: 0,
        dislikes: 0,
      };
      // Différents cas:
      switch (like) {
        case 1: // CAS: sauce liked
          newValues.usersLiked.push(userId);
          break;
        case -1: // CAS: sauce disliked
          newValues.usersDisliked.push(userId);
          break;
        case 0: // CAS: Annulation du like/dislike
          if (newValues.usersLiked.includes(userId)) {
            // si on annule le like
            const index = newValues.usersLiked.indexOf(userId);
            newValues.usersLiked.splice(index, 1);
          } else {
            // si on annule le dislike
            const index = newValues.usersDisliked.indexOf(userId);
            newValues.usersDisliked.splice(index, 1);
          }
          break;
      }
      // Calcul du nombre de likes / dislikes
      newValues.likes = newValues.usersLiked.length;
      newValues.dislikes = newValues.usersDisliked.length;
      // Mise à jour de la sauce avec les nouvelles valeurs
      sauces
        .updateOne({ _id: sauceId }, newValues)
        .then(() => res.status(200).json({ message: "Sauce notée !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
