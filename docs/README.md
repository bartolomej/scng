# SCNG services

Repository for SCNG (Solski Center Nova Gorica) API service and 
native mobile application.

### Project setup
1. Clone repo locally `git clone https://github.com/bartolomej/scng-api.git`
2. Install external node modules `npm i`
3. Configure `.env` environment file
4. Run all tests with `jest test`
5. Run application with `npm start`

### Environment file

```
// .env file in root

NAME = scng
PORT = <port>
NODE_ENV = <development/production>
CONNECTION = mysql
HOST = localhost
USERNAME = <user>
PASSWORD = <password>
DATABASE = scng
DATABASE_PORT = 3306
LOGGING = false
MAIL_USER = <mail>
MAIL_PASS = <mail-password>
```



## TODOs
- [ ] implement 'solska malica'
- [ ] implement logging endpoints for front end system (for analytics purposes)
- [ ] add code guides
- [ ] add git workflow guides
- [x] add admin (analytics) endpoints
- [ ] add website module (download page, guides,..)
- [ ] load test server - [artillery](https://artillery.io/)
