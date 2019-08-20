const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
  name: "Feature",
  columns: {
    id: {
      primary: true,
      unique: true,
      type: "varchar"
    },
    title: {
      type: "varchar"
    },
    visible: {
      type: "bool",
      default: '1'
    },
    status: {
      type: "varchar"
    },
    date: {
      type: "datetime"
    },
  },
  relations: {
    vote: {
      target: "FeatureVote",
      type: "one-to-many",
    },
  }
});
