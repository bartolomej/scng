# SCNG services

Repository for SCNG (Solski Center Nova Gorica) API service and 
native mobile application.


#### Running api-service tests

1. Install node modules
`npm install`
2. Run all tests (must have jest installed globally) `npm test`

This application is structured into modules ('by feature').
Each module is responsive only for its own logic and processes and exposes only an external REST api.
