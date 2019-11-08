const express = require("express");
const router = express.Router();
const secured = require("../../middleware/secured");

const User = require("../../models/User");
const Profile = require("../../models/Profile");

// @route   GET api/profiles/:user_id
// @desc    Get current user's profile
// @access  Private
router.get("/:user_id", secured(), async (req, res) => {
  try {
    // Grab user's profile by their user_id -> profile.id
    // Also grab the nickname and avatar of the user from Users table
  } catch (error) {
    res.status(500).send("Server Error");
  }
});

module.exports = router;
