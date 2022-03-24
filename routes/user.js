const express = require('express');
const validPass = require('../middleware/validPass');
const router = express.Router();

const userCtrl = require('../controllers/user');

router.post('/signup', validPass, userCtrl.signup);
router.post('/login', userCtrl.login);


module.exports = router;