const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');  // Assuming you are sending token in the Authorization header
  
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Use your secret key here
    req.user = decoded;  // Attach the decoded user data to the request
    next();  // Pass control to the next middleware or route handler
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = auth;
