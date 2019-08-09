# SCNG services

Repository for SCNG (Solski Center Nova Gorica) API service and 
native mobile application.

### Project setup
1. Clone repo locally `git clone https://github.com/bartolomej/scng-api.git`
2. Install external node modules `npm i`
3. Configure `ormconfig.env` file with database credentials
4. Run application with `npm start`
5. Run all tests with `jest test`


### Enviroment variables

```
// .env file in root

NAME = scng
PORT = <port>
MODE = <development/production>
CONNECTION = mysql
HOST = localhost
USERNAME = <user>
PASSWORD = <password>
DATABASE = scng
PORT = 3306
SYNCHRONIZE = true
LOGGING = false
```


#### Running api-service tests

1. Install node modules
`npm install`
2. Run all tests (must have jest installed globally) `npm test`


## TODO LIST
- [x] implement convenient error handling system (handling, response error message,..)
- [x] implement logger
- [ ] implement 'solska malica' module
- [ ] implement logging endpoints for front end system (for analytics purposes)
- [ ] add code guides
- [ ] add git workflow guides
- [ ] add admin (analytics) endpoints
- [ ] add website module (download page, guides,..)
- [ ] deployment to heroku / google cloud / digital ocean 
