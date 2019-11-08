const { Model } = require("objection");

class Profile extends Model {
  static get tableName() {
    return "profile";
  }

  static get relationMappings() {
    const User = require("./User");
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "profile.user_id",
          to: "user.user_id"
        }
      }
    };
  }
}

module.exports = Profile;
