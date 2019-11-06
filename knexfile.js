// Update with your config settings.
require("dotenv").config({ path: __dirname + "/config/.env" });
module.exports = {
  development: {
    client: "pg",
    connection: process.env.PG_CONNECTION_STRING,
    migrations: {
      directory: "./db/migrations"
    },
    seeds: {
      directory: "./db/seeds/dev"
    },
    useNullAsDefault: true
  }
  // production: {
  //   client: "postgresql",
  //   connection: {
  //     database: "my_db",
  //     user: "username",
  //     password: "password"
  //   },
  //   pool: {
  //     min: 2,
  //     max: 10
  //   },
  //   migrations: {
  //     tableName: "knex_migrations"
  //   }
  // }
};
