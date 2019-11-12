const express = require("express");
const router = express.Router();
const secured = require("../../middleware/secured");
const { check, validationResult } = require("express-validator");

const User = require("../../models/User");
const Profile = require("../../models/Profile");
const Skill = require("../../models/Skill");

// @route   GET api/profiles/me
// @desc    Get current user's profile
// @access  Private
router.get("/me", secured(), async (req, res) => {
  try {
    // Grab user's profile by their user_id -> profile.id
    // Also grab the nickname and avatar of the user from Users table
    const profile = await Profile.query()
      .where("user_id", req.user.user_id)
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

// @route   POST api/profiles/me
// @desc    Create new profile for current user
// @access  Private
router.post(
  "/me",
  [
    secured(),
    [
      check("role", "Role field is required")
        .not()
        .isEmpty(),
      check("skills", "Skills field is required")
        .not()
        .isEmpty()
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
      let profile = await Profile.query().where("user_id", req.user.user_id);

      if (profile && profile.length) {
        return res
          .status(400)
          .send("Profile already exists, use update instead.");
      }

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

      // Insert skills for user
      const formattedSkills = skills.split(",").map(skill => skill.trim());
      for (const skill of formattedSkills) {
        await profile.$relatedQuery("skills").insert({
          skill_description: skill
        });
      }

      return res.send(profile);
    } catch (error) {
      console.log(error.message);
      return res.status(500).send("Server Error");
    }
  }
);

// @route   PATCH api/profiles/me
// @desc    Update profile for current user
// @access  Private
router.put(
  "/me",
  [
    secured()
    // [
    //   check("role", "Role field is required")
    //     .not()
    //     .isEmpty(),
    // check("skills", "Skills field is required")
    //   .not()
    //   .isEmpty()
    // ]
  ],
  async (req, res) => {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.status(400).json({ errors: errors.array() });
    // }

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
      let profile = await Profile.query().where("user_id", req.user.user_id);

      if (profile) {
        // Update profile
        await Profile.query()
          .where("user_id", req.user.user_id)
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
        console.log(profile);
        // Update skills table for user
        if (skills) {
          console.log("skills hit");
          const formattedSkills = skills.split(",").map(skill => skill.trim());
          await Skill.query()
            .delete()
            .where("profile_id", 18);
          for (const skill of formattedSkills) {
            await profile.$relatedQuery("skills").insert({
              skill_description: skill
            });
          }
        }

        return res.status(200).send(profile);
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
