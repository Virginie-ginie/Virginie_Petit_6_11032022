//La méthode "express.Router()""  vous permet de créer des routeurs séparés pour chaque route principale de votre application – 
//on y enregistrez ensuite les routes individuelles.

// création d'un routeur 
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const stuffCtrl = require('../controllers/stuff')


router.post('/', auth, multer,stuffCtrl.createThing );
// la route pour "modifier"
router.put('/:id', auth, multer, stuffCtrl.modifyThing );
// la route pour "supprimer"
router.delete('/:id', auth, stuffCtrl.deleteThing);
//nous utilisons la méthode get() pour répondre uniquement aux demandes GET à cet endpoint ;
//nous utilisons deux-points :(devant id) en face du segment dynamique de la route pour la rendre accessible en tant que paramètre ;
router.get('/:id', auth, stuffCtrl.getOneThing);
router.get('/', auth,stuffCtrl.getAllThing );

  module.exports = router;