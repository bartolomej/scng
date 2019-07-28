# SCNG services

Repository for SCNG (Solski Center Nova Gorica) API service and 
native mobile application.

### Setup
1. Clone repo locally `git clone https://github.com/bartolomej/scng-api.git`
2. Install external node modules `npm i`
3. Configure `ormconfig.json` file with database credentials
4. Run application with `npm start`
5. Run all tests with `jest test`

### Project structure
```
 +-- news               -> news module
 |   +-- ...            
 +-- user               -> user module
 |   +-- ...            
 +-- schedule           -> schedule module
 |   +-- db             -> database integration
 |   +-- tests          -> all tests for module context
 |   +-- ...            -> more modules
 |   +-- README.md      -> documentation file
 |   +-- routes.js      -> exposes external REST API
 |   +-- index.js       -> main 'service' file - exposes interface for API layer (routes.js)
 ``` 
 
This application is structured into modules ('by feature').
Each module is responsive only for its own logic and processes and exposes only an external REST api.

#### Running api-service tests

1. Install node modules
`npm install`
2. Run all tests (must have jest installed globally) `npm test`


## TODO LIST
- [x] implement convenient error handling system (handling, response error message,..)
- [x] implement logger
- [ ] implement 'solska malica' module
- [ ] implement logging endpoints for front end system (for analytics purposes)
- [ ] add extensive code guides
- [ ] add git workflow guides
- [ ] add admin (analytics) endpoints
- [ ] add website module (download page, guides,..)
