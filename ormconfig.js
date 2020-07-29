module.exports.normal = {
  "type": "mysql",
  "host": process.env.DB_HOST,
  "port": process.env.DB_PORT,
  "synchronize": true,
  "username": process.env.DB_USER,
  "password": process.env.DB_PASSWORD,
  "database": process.env.DB_NAME,
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
