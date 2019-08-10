module.exports.normal = {
  "type": "mysql",
  "host": process.env.HOST,
  "port": process.env.PORT,
  "synchronize": true,
  "username": process.env.USERNAME,
  "password": process.env.PASSWORD,
  "database": process.env.DATABASE,
  "entities": [
    "src/news/db/entities/*.js",
    "src/schedule/db/entities/*.js",
    "src/user/db/entities/*.js"
  ],
};

module.exports.connectionString = connectionObject => ({
  "type": "mysql",
  "host": connectionObject.hosts[0].host,
  "port": connectionObject.hosts[0].port,
  "username": connectionObject.username,
  "password": connectionObject.password,
  "database": connectionObject.endpoint,
  "synchronize": true,
  "entities": [
    "src/news/db/entities/*.js",
    "src/schedule/db/entities/*.js",
    "src/user/db/entities/*.js"
  ]
});