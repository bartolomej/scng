# SCNG services

This is a back-end system for SCNG APP. 
You can find front-end mobile app repository [here](https://github.com/bartolomej/scng-mobile).

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
