const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
  name: "FeatureVote",
  columns: {
    user: {
      type: "varchar"
    },
    date: {
      primary: true,
      type: "datetime"
    }
  },
  relations: {
    feature: {
      target: "Feature",
      type: "many-to-one",
      joinTable: true
    },
  }
});
