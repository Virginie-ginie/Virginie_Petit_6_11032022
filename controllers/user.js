const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.signup = (req, res, next) => {
    //on crypte le mot de passe
        bcrypt.hash(req.body.password, 10)
          .then(hash => {
              // on prend le mot de passe crypté et on crée un nouvel utilisateur
            const user = new User({
              email: req.body.email,
              password: hash
            });
            //pour enregistrer ds la base de donné
            console.log(user , ' utilisateur créé');
            user.save()
              .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
              .catch(error => res.status(400).json({ error }));
          })
          .catch(error => res.status(500).json({ error }));
      };

exports.login = (req, res, next) => {
//on recupère l'utilisateur de la base qui correspond à l'adresse mail entrée
        User.findOne({ email: req.body.email })
          .then(user => {
              // si l'email n'est pas bon on renvoi une erreur 
            if (!user) {
              return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            // on compare le mot de passe entré avec le hash qui est gardé dans la base de données
            bcrypt.compare(req.body.password, user.password)
              .then(valid => {
                  //si la comparaison n'est pas bonne on envoiune erreur 
                if (!valid) {
                  return res.status(401).json({ error: 'Mot de passe incorrect !' });
                }
                // la comparaison est bonne on lui renvoi son id et sont token
                res.status(200).json({
                  userId: user._id,
                  // on appel la fonction sign
                  token: jwt.sign(
                      //on veut encoder l'user et la clé
                      // on encode le user id pour qu'un objet enregisrter ne peux pas etre modifier par quelqu'un d'autre
                    { userId: user._id },
                    'RANDOM_TOKEN_SECRET',
                    // on applique un expiration pour le tokken
                    { expiresIn: '24h' }
                  )
                });
                console.log(user);

              })
              .catch(error => res.status(500).json({ error }));
          })
          .catch(error => res.status(500).json({ error }));
      };
