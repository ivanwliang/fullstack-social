const { Model } = require("objection");

class Profile extends Model {
  static get tableName() {
    return "profile";
  }

  static get relationMappings() {
    const User = require("./User");
    const WorkExperience = require("./WorkExperience");
    const Education = require("./Education");
    const Skill = require("./Skill");
    return {
      users: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "profile.user_id",
          to: "users.user_id"
        }
      },
      workExperiences: {
        relation: Model.HasManyRelation,
        modelClass: WorkExperience,
        join: {
          from: "profile.id",
          to: "workExperiences.profile_id"
        }
      },
      education: {
        relation: Model.HasManyRelation,
        modelClass: Education,
        join: {
          from: "profile.id",
          to: "education.profile_id"
        }
      },
      skills: {
        relation: Model.HasManyRelation,
        modelClass: Skill,
        join: {
          from: "profile.id",
          to: "skills.profile_id"
        }
      }
    };
  }
}

module.exports = Profile;
