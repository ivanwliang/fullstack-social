const { Model } = require("objection");

class Skill extends Model {
  static get tableName() {
    return "skills";
  }

  static get relationMappings() {
    const Profile = require("./Profile");
    return {
      profile: {
        relation: Model.BelongsToOneRelation,
        modelClass: Profile,
        join: {
          from: "skills.profile_id",
          to: "profile.id"
        }
      }
    };
  }
}

module.exports = Skill;
