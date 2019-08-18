module.exports.normal = {
  "type": "mysql",
  "host": process.env.HOST,
  "port": process.env.DATABASE_PORT,
  "synchronize": true,
  "username": process.env.USERNAME,
  "password": process.env.PASSWORD,
  "database": process.env.DATABASE,
  "entities": [
    "src/models/*.js"
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
    "src/models/*.js"
  ]
});