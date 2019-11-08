const { Model } = require("objection");

class WorkExperience extends Model {
  static get tableName() {
    return "work_experience";
  }

  static get relationMappings() {
    const Profile = require("./Profile");
    return {
      profile: {
        relation: Model.BelongsToOneRelation,
        modelClass: Profile,
        join: {
          from: "work_experience.profile_id",
          to: "profile.id"
        }
      }
    };
  }
}

module.exports = WorkExperience;
