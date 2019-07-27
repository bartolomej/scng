const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
  name: "News",
  columns: {
    title: {
      primary: true,
      unique: true,
      type: "varchar"
    },
    content: {
      type: 'text'
    },
    href: {
      type: 'varchar'
    },
    date: {
      type: "datetime"
    }
  }
});
