const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
  name: "Lesson",
  columns: {
    id: {
      primary: true,
      unique: true,
      generate: true,
      type: "varchar"
    },
    type: {
      type: 'varchar'
    },
    start: {
      type: 'datetime'
    },
    end: {
      type: 'datetime'
    },
    fullName: {
      type: 'varchar',
      default: ''
    },
    shortName: {
      type: 'varchar',
      default: ''
    },
    teacher: {
      type: 'varchar',
      default: ''
    },
    classRoom: {
      type: 'varchar',
      default: ''
    },
    group: {
      type: 'varchar',
      default: ''
    }
  },
  relations: {
    timetable: {
      target: "Timetable",
      type: "many-to-one",
      joinColumn: true,
    }
  }
});
