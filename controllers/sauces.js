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

exports.modifySauce = async (req, res, next) => {
	//On cherche la sauce à modifier
	const sauceDB = await Sauces.findOne({ _id: req.params.id });
	if (sauceDB == null) {
		return res.status(404).json({ message: "Sauce introuvable." });
	}

	//Vérification de l'autorisation de l'utilisateur
	if (sauceDB.userId !== req.auth.userId) {
		return res.status(403).json({
			message: "Vous n'êtes pas autorisé à effectuer cette action.",
		});
	}

	//s'il y a un fichier image dans la req : supprimer l'image actuelle
	if (req.file) {
		try {
			//récupérer le nom du fichier image
			const filename = sauceDB.imageUrl.split("/images/")[1];
			//effacer le fichier image
			fs.unlink(`images/${filename}`, (error) => {
				if (error) throw error;
			});
		} catch (error) {
			return res
				.status(500)
				.json({
					error: error,
					message: "Impossible de remplacer l/'image.",
				});
		}
	}

	//mettre à jour la sauce en gérant avec fichier ou sans fichier
	try {
		//est-ce qu'il y a un fichier image dans la req ?   ?=oui   :=non
		const saucesObject = req.file ? {
					...JSON.parse(req.body.sauce),
					imageUrl: `${req.protocol}://${req.get("host")}/images/${
						req.file.filename
					}`,
			  }
			: { ...req.body };
		await Sauces.updateOne(
			{ _id: req.params.id },
			{ ...saucesObject, _id: req.params.id }
		);
		return res.status(200).json({ message: "La sauce a été modifiée." });
	} catch (error) {
		return res.status(500).json({
			error: error,
			message: "Impossible de modifier la sauce.",
		});
	}
};



exports.deleteSauce = async (req, res, next) => {
	//trouver la sauce à supprimer dans la DB pour suppprimer aussi le fichier correspondant sur le serveur
	try {
		const sauce = await Sauces.findOne({ _id: req.params.id });

		//vérification que userId connecté est identique au userId qui a créé la sauce
		if (sauce.userId !== req.auth.userId) {
			return res.status(403).json({
				error: error,
				message: "Vous n'êtes pas autorisé à effectuer cette action.",
			});
		}

		const filename = sauce.imageUrl.split("/images/")[1];
		fs.unlink(`images/${filename}`, async () => {
			try {
				//supprimer la sauce (fonction callback de unlink)
				await Sauces.deleteOne({ _id: req.params.id });
				return res
					.status(200)
					.json({ message: "La sauce a été supprimée." });
			} catch (error) {
				return res.status(400).json({
					error: error,
					message: "Impossible de supprimer la sauce.",
				});
			}
		});
	} catch (error) {
		return res
			.status(500)
			.json({ error: error, message: "Action impossible." });
	}
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

//Like/Dislike une sauce :
exports.likeSauce = (req, res, next) => {
  // On récupère les informations de la sauce
  Sauces.findOne({ _id: req.params.id })
 .then(sauces => {

     // Selon la valeur recue pour 'like' dans la requête :
     switch (req.body.like) {
         //Si +1 dislike :
         case -1:
             Sauces.updateOne({ _id: req.params.id }, {
                 $inc: {dislikes:1},
                 $push: {usersDisliked: req.body.userId},
                 _id: req.params.id
             })
                 .then(() => res.status(201).json({ message: 'Dislike ajouté !'}))
                 .catch( error => res.status(400).json({ error }));
             break;
         
         //Si -1 Like ou -1 Dislike :
         case 0:
             //Cas -1 Like :
             if (sauces.usersLiked.find(user => user === req.body.userId)) {
                 Sauces.updateOne({ _id : req.params.id }, {
                     $inc: {likes:-1},
                     $pull: {usersLiked: req.body.userId},
                     _id: req.params.id
                 })
                     .then(() => res.status(201).json({message: ' Like retiré !'}))
                     .catch( error => res.status(400).json({ error }));
             }

             //Cas -1 dislike :
             if (sauces.usersDisliked.find(user => user === req.body.userId)) {
                 Sauces.updateOne({ _id : req.params.id }, {
                     $inc: {dislikes:-1},
                     $pull: {usersDisliked: req.body.userId},
                     _id: req.params.id
                 })
                     .then(() => res.status(201).json({message: ' Dislike retiré !'}))
                     .catch( error => res.status(400).json({ error }));
             }
             break;
         
         //Cas +1 Like :
         case 1:
             Sauces.updateOne({ _id: req.params.id }, {
                 $inc: { likes:1},
                 $push: { usersLiked: req.body.userId},
                 _id: req.params.id
             })
                 .then(() => res.status(201).json({ message: 'Like ajouté !'}))
                 .catch( error => res.status(400).json({ error }));
             break;
         default:
             return res.status(500).json({ error });
     }
 })
 .catch(error => res.status(500).json({ error }));
};





