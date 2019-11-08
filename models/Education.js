const { Model } = require("objection");

class Education extends Model {
  static get tableName() {
    return "education";
  }

  static get relationMappings() {
    const Profile = require("./Profile");
    return {
      profile: {
        relation: Model.BelongsToOneRelation,
        modelClass: Profile,
        join: {
          from: "education.profile_id",
          to: "profile.id"
        }
      }
    };
  }
}

module.exports = Education;
