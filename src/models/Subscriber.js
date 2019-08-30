const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
  name: "Subscriber",
  columns: {
    id: {
      primary: true,
      unique: true,
      type: "varchar"
    },
    email: {
      type: 'varchar'
    },
    school: {
      type: 'varchar'
    },
    date: {
      type: 'date'
    }
  }
});
