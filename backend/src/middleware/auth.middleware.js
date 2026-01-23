module.exports = function authenticate(req, res, next) {
  // TEMPORARY simple pass-through middleware
  // Allows development to continue

  // If you already attach user somewhere else, keep it
  if (!req.user) {
    req.user = { id: 1 }; // TEMP user id for testing
  }

  next();
};
