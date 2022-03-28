const mongoose = require("mongoose");

//nous créons un schéma de données qui contient les champs souhaités pour chaque Sauces,
//indique leur type ainsi que leur caractère (obligatoire ou non)
const saucesSchema = mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  usersLiked: { type: Array, default: [] },
  usersDisliked: { type: Array, default: [] },
});

// nous exportons ce schéma en tant que modèle Mongoose appelé "Sauces "
//La méthode  model  transforme ce modèle en un modèle utilisable.
module.exports = mongoose.model("Sauce", saucesSchema);
