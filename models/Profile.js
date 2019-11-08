const { Model } = require("objection");

class Profile extends Model {
  static get tableName() {
    return "profile";
  }

  static get relationMappings() {
    const User = require("./User");
    const WorkExperience = require("./WorkExperience");
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "profile.user_id",
          to: "user.user_id"
        }
      },
      workExperiences: {
        relation: Model.HasManyRelation,
        modelClass: WorkExperience,
        join: {
          from: "profile.id",
          to: "workExperiences.profile_id"
        }
      }
    };
  }
}

module.exports = Profile;
