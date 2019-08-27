const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
  name: "Timetable",
  columns: {
    id: {
      primary: true,
      unique: true,
      generate: true,
      type: "varchar"
    },
    date: {
      type: 'date'
    },
    hourIndex: {
      type: 'int'
    },
  },
  relations: {
    class: {
      target: "Class",
      type: "many-to-one",
      joinColumn: true,
    },
    lessons: {
      target: "Lesson",
      type: "one-to-many",
      joinColumn: true,
    }
  }
});
