const jwt = require('jsonwebtoken');
const { pool } = require("../config/db.config");

const roleAuthorization = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authorization token missing' });
      }

      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Check if role is allowed (support both string and number checks)
      const roleId = decoded.employee_role;
      
      if (!allowedRoles.some(r => 
        r.toString() === roleId.toString()
      )) {
        return res.status(403).json({ 
          error: `Access denied. Required roles: ${allowedRoles.join(', ')}` 
        });
      }

      req.user = decoded;
      next();
    } catch (error) {
      console.error('Authorization error:', error);
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  };
};

module.exports = roleAuthorization;