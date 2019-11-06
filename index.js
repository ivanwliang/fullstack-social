const express = require("express");
require("dotenv").config({ path: __dirname + "/config/.env" });

const PORT = process.env.PORT;
const app = express();

// Configure pg database
const configuration = require("./knexfile")[process.env.NODE_ENV];
const knex = require("knex")(configuration);
const { Model } = require("objection");
Model.knex(knex);

app.get("/", (req, res) => res.send("Hello world"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
