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
    }
  },
  relations: {
    lesson: {
      target: "Lesson",
      type: "one-to-many",
      joinColumn: true,
    },
    class: {
      target: "Class",
      type: "many-to-one",
      joinColumn: true,
    }
  }
});
