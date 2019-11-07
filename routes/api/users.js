const { check, validationResult } = require("express-validator");
const express = require("express");
const gravatar = require("gravatar");
const router = express.Router();
const User = require("../../models/User");

// @route   POST api/users
// @desc    Register new user
// @access  Public
router.post(
  "/",
  [
    check("name", "Name is required")
      .not()
      .isEmpty(),
    check("email", "Please include a valid email").isEmail()
  ],
  async (req, res) => {
    const { name, email } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let user = await User.query().where("email", email);
      if (user.length > 0) {
        return res
          .status(400)
          .json({ errors: [{ message: "User already exists" }] });
      }

      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm"
      });

      user = await User.query().insert({ name, email, avatar });
      res.send("User created");
    } catch (error) {
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
