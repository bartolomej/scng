# SCNG services

Repository for SCNG (Solski Center Nova Gorica) API service and 
native mobile application.


#### Running api-service tests

1. Install node modules
`npm install`
2. Run all tests (must have jest installed globally) `npm test`

This application is structured into modules ('by feature').
Each module is responsive only for its own logic and processes and exposes only an external REST api.


## TODO LIST
- [ ] implement convenient error handling system (handling, response error message,..)
- [ ] implement logger
- [ ] implement 'solska malica' module
- [ ] implement logging endpoints for front end system (for analytics purposes)
- [ ] add extensive code guides
- [ ] add git workflow guides
- [ ] add admin (analytics) endpoints
- [ ] add website module (download page, guides,..)
