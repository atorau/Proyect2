module.exports = {
  setCurrentUser: function(req, res, next) {
    if (req.isAuthenticated()) {
      res.locals.currentUser = req.user;
      res.locals.isUserLoggedIn = true;

    } else {
      res.locals.isUserLoggedIn = false;
    }
    next();
  },
  checkRoles: (role, redirectPath = "/") => {
    return (req, res, next) => {
      if (req.isAuthenticated() && req.user.role === role) {
        return next();
      } else {
        res.redirect(redirectPath);
      }
    };
  },
  ensureLoggedIn: (redirectPath) => {
    return (req, res, next) => {
      if (req.isAuthenticated()) {
        next();
      } else {
        res.redirect(redirectPath);
      }
    };
  },
  ifAlreadyLoggedIn: (redirectPath) => {
    return (req, res, next) => {
      if (req.isAuthenticated()) {
        res.redirect(redirectPath);
      } else {
        next();
      }
    };
  },
};
