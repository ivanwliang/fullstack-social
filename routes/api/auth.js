const express = require("express");
const router = express.Router();
const passport = require("passport");
const url = require("url");
const util = require("util");
const querystring = require("querystring");
const User = require("../../models/User");

// @route   GET api/auth
// @desc    Authenticate user
// @access  Public
router.get(
  "/login",
  passport.authenticate("auth0", {
    scope: "openid email profile"
  }),
  (req, res) => res.redirect("/")
);

router.get("/callback", (req, res, next) => {
  passport.authenticate("auth0", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect("/login");
    }
    req.logIn(user, err => {
      if (err) {
        return next(err);
      }
      console.log(user);
      const { user_id, picture: avatar } = user;
      const email = user.emails[0].value;
      const name = `${user.name.givenName} ${user.name.familyName}`;
      User.query()
        .where("user_id", user_id)
        .then(existingUser => {
          console.log(existingUser);
          if (!(existingUser && existingUser.length)) {
            User.query()
              .insert({ user_id, email, name, avatar })
              .then(() => console.log("New user inserted"));
          }
        });
      const returnTo = req.session.returnTo;
      delete req.session.returnTo;
      res.redirect(returnTo || "/api/users/test");
    });
  })(req, res, next);
});

router.get("/logout", (req, res) => {
  req.logout();

  let returnTo = `${req.protocol}://${req.hostname}`;
  const port = req.connection.localPort;
  if (port !== undefined && port !== 80 && port !== 443) {
    returnTo += ":" + port;
  }
  let logoutURL = new url.URL(
    util.format("https://%s/v2/logout", process.env.AUTH0_DOMAIN)
  );
  const searchString = querystring.stringify({
    client_id: process.env.AUTH0_CLIENT_ID,
    returnTo: returnTo
  });
  logoutURL.search = searchString;

  res.redirect(logoutURL);
});

module.exports = router;
