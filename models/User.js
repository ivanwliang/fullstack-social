const { Model } = require("objection");

class User extends Model {
  static get tableName() {
    return "users";
  }

  static get idColumn() {
    return "user_id";
  }

  static get relationMappings() {
    const Profile = require("./Profile");
    return {
      profile: {
        relation: Model.BelongsToOneRelation,
        modelClass: Profile,
        join: {
          from: "users.user_id",
          to: "profile.user_id"
        }
      }
    };
  }
}

module.exports = User;
