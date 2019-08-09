module.exports = {
  "type": "mysql",
  "host": process.env.HOST,
  "port": process.env.PORT,
  "synchronize": true,
  "username": process.env.USERNAME,
  "password": process.env.PASSWORD,
  "database": process.env.DATABASE,
  "entities": [
    "news/db/entities/*.js",
    "schedule/db/entities/*.js",
    "user/db/entities/*.js"
  ],
};