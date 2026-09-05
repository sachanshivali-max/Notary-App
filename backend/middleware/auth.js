const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Contains id and role
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

const premium = (req, res, next) => {
  if (req.user && req.user.role === 'premium') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Premium users only' });
  }
};

module.exports = { auth, premium };
