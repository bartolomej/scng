const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
  name: "Notification",
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
    visible: {
      type: 'bool',
      default: '1'
    },
    date: {
      type: 'date'
    }
  },
});
