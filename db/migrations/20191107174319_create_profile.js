exports.up = function(knex) {
  return knex.schema
    .createTable("profile", table => {
      table.increments("id").primary();
      table.string("user_id");
      table.foreign("user_id").references("users.user_id");
      table.string("employer");
      table.string("website");
      table.string("location");
      table.string("role").notNullable();
      table.string("bio");
      table.string("github_username");
      table.string("youtube_url");
      table.string("twitter_url");
      table.string("facebook_url");
      table.string("linkedin_url");
      table.string("instagram_url");
      table.timestamps(true, true);
    })
    .createTable("skills", table => {
      table.increments("id").primary();
      table.integer("profile_id").unsigned();
      table.foreign("profile_id").references("profile.id");
      table.string("skill_description").notNullable();
    })
    .createTable("work_experience", table => {
      table.increments("id").primary();
      table.integer("profile_id").unsigned();
      table.foreign("profile_id").references("profile.id");
      table.string("job_title").notNullable();
      table.string("employer").notNullable();
      table.string("job_location");
      table.date("start_date").notNullable();
      table.date("end_date");
      table.boolean("current_role").defaultTo(false);
      table.string("job_description");
    })
    .createTable("education", table => {
      table.increments("id").primary();
      table.integer("profile_id").unsigned();
      table.foreign("profile_id").references("profile.id");
      table.string("school").notNullable();
      table.string("degree");
      table.string("field_of_study");
      table.date("start_date").notNullable();
      table.date("end_date").notNullable();
      table.string("description");
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTable("education")
    .dropTable("work_experience")
    .dropTable("skills")
    .dropTable("profile");
};
