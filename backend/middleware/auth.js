function requireLogin(req, res, next) {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({ message: "Not logged in" });
    }
    next();
  }
  
  function requireAdmin(req, res, next) {
    if (!req.session || req.session.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }
    next();
  }
  
  module.exports = { requireLogin, requireAdmin };