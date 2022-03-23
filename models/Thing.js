const mongoose = require('mongoose');

//nous créons un schéma de données qui contient les champs souhaités pour chaque Thing, 
//indique leur type ainsi que leur caractère (obligatoire ou non)
const thingSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    userId: { type: String, required: true },
    price: { type: Number, required: true },
  });
  
  // nous exportons ce schéma en tant que modèle Mongoose appelé "Thing "
  //La méthode  model  transforme ce modèle en un modèle utilisable. 
  module.exports = mongoose.model('Thing', thingSchema);
