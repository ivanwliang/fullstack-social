const express = require("express");
const router = express.Router();
const secured = require("../../middleware/secured");

router.get("/test", secured(), (req, res) => {
  res.send("You are authenticated!");
});

module.exports = router;
