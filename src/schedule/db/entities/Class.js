const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
  name: "Class",
  columns: {
    id: {
      primary: true,
      unique: true,
      type: "varchar"
    },
    name: {
      type: 'varchar'
    },
  },
  relations: {
    school: {
      target: "School",
      type: "many-to-one",
      joinColumn: true,
    },
    timetable: {
      target: "Timetable",
      type: "one-to-many",
      joinColumn: true,
    }
  }
});
