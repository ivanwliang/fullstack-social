const express = require("express");
const session = require("express-session");
require("dotenv").config({ path: __dirname + "/config/.env" });

const PORT = process.env.PORT;
const app = express();

app.use(express.json());

// Configure pg database
const configuration = require("./knexfile")[process.env.NODE_ENV];
const knex = require("knex")(configuration);
const { Model } = require("objection");
Model.knex(knex);

// Configure express-session
const sess = {
  secret: process.env.SESSION_SECRET,
  cookie: {},
  resave: false,
  saveUninitialized: true
};
if (process.env.NODE_ENV === "production") {
  sess.cookie.secure = true;
  app.set("trust proxy", 1);
}
app.use(session(sess));

// Define routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/posts"));

app.get("/", (req, res) => res.send("Hello world"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
