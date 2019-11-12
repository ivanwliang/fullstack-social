const express = require("express");
const router = express.Router();
const secured = require("../../middleware/secured");
const { check, validationResult } = require("express-validator");

const User = require("../../models/User");
const Profile = require("../../models/Profile");

// @route   GET api/profiles/:user_id
// @desc    Get current user's profile
// @access  Private
router.get("/:userId", secured(), async (req, res) => {
  try {
    // Grab user's profile by their user_id -> profile.id
    // Also grab the nickname and avatar of the user from Users table
    const profile = await Profile.query()
      .where("user_id", req.params.userId)
      .eager("users");

    if (!(profile && profile.length)) {
      return res.status(400).send("No profile exists for this user");
    }

    res.send(profile);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});

// @route   POST api/profiles/:user_id
// @desc    Create new profile for current user
// @access  Private
router.post(
  "/:userId",
  [
    secured(),
    [
      check("role", "Role field is required")
        .not()
        .isEmpty()
      // check("skills", "Skills field is required")
      //   .not()
      //   .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      employer,
      website,
      location,
      role,
      bio,
      githubUsername,
      skills,
      youtubeURL,
      facebookURL,
      twitterURL,
      instagramURL,
      linkedinURL
    } = req.body;

    // const formattedSkills = skills.split(",").map(skill => skill.trim());
    // console.log(formattedSkills);
    // res.send("created profile");

    try {
      let profile = await Profile.query()
        .where("user_id", req.params.userId)
        .eager("users");

      // Create new profile
      profile = await Profile.query().insert({
        user_id: req.user.user_id,
        employer,
        website,
        location,
        role,
        bio,
        github_username: githubUsername,
        youtube_url: youtubeURL,
        facebook_url: facebookURL,
        twitter_url: twitterURL,
        linkedin_url: linkedinURL,
        instagram_url: instagramURL
      });
      return res.send(profile);
    } catch (error) {
      console.log(error.message);
      return res.status(500).send("Server Error");
    }
  }
);

// @route   PATCH api/profiles/:user_id
// @desc    Update profile for current user
// @access  Private
router.patch(
  "/:userId",
  [
    secured(),
    [
      check("role", "Role field is required")
        .not()
        .isEmpty()
      // check("skills", "Skills field is required")
      //   .not()
      //   .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      employer,
      website,
      location,
      role,
      bio,
      githubUsername,
      skills,
      youtubeURL,
      facebookURL,
      twitterURL,
      instagramURL,
      linkedinURL
    } = req.body;

    try {
      let profile = await Profile.query()
        .where("user_id", req.params.userId)
        .eager("users");

      if (profile) {
        // Update profile
        profile = await Profile.query()
          .where("user_id", req.params.userId)
          .patch({
            user_id: req.user.user_id,
            employer,
            website,
            location,
            role,
            bio,
            github_username: githubUsername,
            youtube_url: youtubeURL,
            facebook_url: facebookURL,
            twitter_url: twitterURL,
            linkedin_url: linkedinURL,
            instagram_url: instagramURL
          });
        // TODO Update skills table for user
        return res.send(profile);
      } else {
        return res.status(404).send("No such user exists");
      }
    } catch (error) {
      console.log(error.message);
      return res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
