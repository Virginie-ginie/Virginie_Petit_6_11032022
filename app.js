const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const helmet = require("helmet");
const saucesRoutes = require("./routes/sauces");
const userRoutes = require("./routes/user");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
});

app.use(limiter);
app.use(helmet({
  // crossOriginEmbedderPolicy: false,
  
    crossOriginResourcePolicy: false
  
}));

mongoose
  .connect(process.env.MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

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

app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/sauces", saucesRoutes);
app.use("/api/auth", userRoutes);

//on export notre application 'app'
module.exports = app;
