const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
  name: "School",
  columns: {
    id: {
      primary: true,
      unique: true,
      type: "varchar"
    },
    name: {
      type: 'varchar'
    },
    fullName: {
      type: 'varchar'
    },
    url: {
      type: 'varchar'
    },
    added: {
      type: 'date'
    },
  },
  relations: {
    'class': {
      target: "Class",
      type: "one-to-many",
      joinColumn: true,
    }
  }
});
