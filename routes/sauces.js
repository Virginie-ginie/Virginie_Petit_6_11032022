//La méthode "express.Router()""  vous permet de créer des routeurs séparés pour chaque route principale de votre application – 
//on y enregistrez ensuite les routes individuelles.

// création d'un routeur 
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const sauceCtrl = require('../controllers/sauces')


router.post('/', auth, multer,sauceCtrl.createSauce );
// la route pour "modifier"
router.put('/:id', auth, multer, sauceCtrl.modifySauce );
// la route pour "supprimer"
router.delete('/:id', auth, sauceCtrl.deleteSauce);
//nous utilisons la méthode get() pour répondre uniquement aux demandes GET à cet endpoint ;
//nous utilisons deux-points :(devant id) en face du segment dynamique de la route pour la rendre accessible en tant que paramètre ;
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.get('/', auth,sauceCtrl.getAllSauces );


  module.exports = router;