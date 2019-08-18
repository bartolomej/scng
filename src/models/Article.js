const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
  name: "Article",
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
  },
  relations: {
    school: {
      target: "School",
      type: "many-to-one",
      joinColumn: true,
    },
  }
});
