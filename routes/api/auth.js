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
  passport.authenticate("auth0", async (err, user, info) => {
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
      let existingUser = await User.query().where('id', user.Profile.user_id);
      if (!existingUser) { 
        // Create new user in database with auth0 user id
      } else {
        // Update user with new fields
      }
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

router.get("/", (req, res) => res.send("Success!"));

module.exports = router;
