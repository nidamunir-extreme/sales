const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
   next();
  // const token = req.headers['authorization']?.split(' ')[1];
  // if (!token) return res.status(403).send('No token provided');
  // jwt.verify(token, 'your-secret-key', (err, decoded) => {
  //   if (err) return res.status(403).send('Failed to authenticate token');
  //   req.user = decoded;
  //   next();
  // });
};
