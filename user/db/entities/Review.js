const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
  name: "Feedback",
  columns: {
    id: {
      primary: true,
      unique: true,
      type: "varchar"
    },
    title: {
      type: 'varchar'
    },
    description: {
      type: 'text'
    },
    classId: {
      type: 'varchar'
    }
  },
});
