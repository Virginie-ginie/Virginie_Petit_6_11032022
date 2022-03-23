
const Sauces = require('../models/Sauces');
const fs = require('fs');

// on export un fonction pour la création d'un objet
exports.createSauce = (req, res, next) => {
  const saucesObject = JSON.parse(req.body.sauces);
  delete saucesObject._id;
    const sauces = new Sauces({
      
      //L'opérateur spread ... est utilisé pour faire une copie de tous les éléments de req.body
      ...saucesObject,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    //La méthode save() renvoie une Promise,et qui enregistre simplement votre Thing dans la base de données.
    sauces.save()
    //dans notre bloc then() , nous renverrons une réponse de réussite avec un code 201 de réussite
      .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
      //Dans notre bloc catch() , nous renverrons une réponse avec l'erreur générée par Mongoose ainsi qu'un code d'erreur 400.
      .catch(error => res.status(400).json({ error }));
  };

   // la route pour "modifier"
  exports.modifySauce = (req, res, next) => {
    
   const saucesObject = req.file ?
   { 
     ...JSON.parse(req.body.sauces),
     imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
   }: { ...req.body};
    // la méthode updateOne() dans notre modèle Thing nous permet de mettre à jour le Thing qui correspond à l'objet que nous passons comme premier argument.
    // Nous utilisons aussi le paramètre id passé dans la demande, et le remplaçons par le Thing passé comme second argument.
    Sauces.updateOne({ _id: req.params.id }, { ...saucesObject, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Objet modifié !'}))
      .catch(error => res.status(400).json({ error }));
  };


// la route pour "supprimer"
exports.deleteSauce = (req, res, next) => {
  //on trouve l'objet dans la base de donnée
  Sauces.findOne({ _id: req.params.id })
  //on le trouve
    .then(sauces => {
      // on extrait le nom du fichier à supprimer
      const filename = sauces.imageUrl.split('/images/')[1];
      // on le supprime avec "unlink"
      fs.unlink(`images/${filename}`, () => {
        // on fais la suppression dans la base
        Sauces.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};
  
  // on recupere un seul objet
  exports.getOneSauce = (req, res, next) => {
    //nous utilisons ensuite la méthode findOne() dans notre modèle Thing pour trouver le Thing unique ayant le même _id que le paramètre de la requête ;
    Sauces.findOne({ _id: req.params.id })
    //ce Thing est ensuite retourné dans une Promise et envoyé au front-end ;
      .then(sauces => res.status(200).json(sauces))
      //si aucun Thing n'est trouvé ou si une erreur se produit, nous envoyons une erreur 404 au front-end, avec l'erreur générée.
      .catch(error => res.status(404).json({ error }));
  };
 //on recupere tt les objets
  exports.getAllSauces = (req, res, next) => {
    Sauces.find()
      .then(sauces => res.status(200).json(sauces))
      .catch(error => res.status(400).json({ error }));
  };