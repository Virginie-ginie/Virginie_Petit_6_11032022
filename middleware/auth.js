const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
      //on recupere le tokken
    const token = req.headers.authorization.split(' ')[1];
    //on decode le tokken
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    //on recupere le user 
    const userId = decodedToken.userId;
    req.auth = { userId };  
    //on vérifie si le user id correspond a celui du corps de la requete 
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID';
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Requete non authentifiée!')
    });
  }
};