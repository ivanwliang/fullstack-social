exports.up = function(knex) {
  return knex.schema.table("users", function(table) {
    table.dropColumn("id");
    table.string("user_id").primary();
    table.dropColumn("name");
  });
};

exports.down = function(knex) {
  return knex.schema.table("users", function(table) {
    table.increments("id").primary();
    table.dropColumn("user_id");
    table.string("name").notNullable();
  });
};
