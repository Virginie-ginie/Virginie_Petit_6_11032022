//on importe express
const express = require("express");
const bodyParser = require('body-parser');

// on importe mongoose
const mongoose = require("mongoose");
const path = require('path');

const stuffRoutes = require('./routes/stuff');
const userRoutes = require('./routes/user');

mongoose.connect(
  "mongodb+srv://Ginie:logelbach@cluster0.3wjg1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));
  
  // on crée une const pour notre application
  const app = express();

//********************************middleware*******************************************
// on intercepte toutes les requetes qui continenne du JSON et
// met a disposition le continu de la requet ds req.body
app.use(express.json());

//La méthode app.use() vous permet d'attribuer un middleware à une route spécifique de votre application.

app.use((req, res, next) => {
  //d'accéder à notre API depuis n'importe quelle origine ( '*' ) ;
  res.setHeader("Access-Control-Allow-Origin", "*");
  //d'ajouter les headers mentionnés aux requêtes envoyées vers notre API (Origin , X-Requested-With , etc.) ;
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  //d'envoyer des requêtes avec les méthodes mentionnées ( GET ,POST , etc.).
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/stuff', stuffRoutes);
app.use('/api/auth', userRoutes);

//on export notre application 'app'
module.exports = app;

//***************************INFO DU COURS *******************************

//Le CORS définit comment les serveurs et les navigateurs interagissent, en spécifiant
//quelles ressources peuvent être demandées de manière légitime – par défaut, les requêtes AJAX sont interdites.

//Pour permettre des requêtes cross-origin (et empêcher des erreurs CORS),
//des headers spécifiques de contrôle d'accès doivent être précisés pour tous vos objets de réponse.

//Les méthodes de votre modèle Thing permettent d'interagir avec la base de données :

      // save()  – enregistre un Thing ;

      // find()  – retourne tous les Things ;

      // findOne()  – retourne un seul Thing basé sur la fonction de comparaison qu'on lui passe (souvent pour récupérer un Thing par son identifiant unique).

// La méthode  app.get()  permet de réagir uniquement aux requêtes de type GET.

//votre application implémente le CRUD complet :

      // create (création de ressources) ;

      // read (lecture de ressources) ;

      // update (modification de ressources) ;

      // delete (suppression de ressources).