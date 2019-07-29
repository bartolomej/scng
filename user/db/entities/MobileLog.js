const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
  name: "MobileLog",
  columns: {
    id: {
      primary: true,
      unique: true,
      type: "varchar"
    },
    type: {
      type: 'varchar'
    },
    description: {
      type: 'text'
    },
    date: {
      type: 'datetime'
    },
    user: {
      type: 'varchar'
    }
  },
});
