## Schedule module

This module handles schedule updates, parsing and exposes external REST api.

```
 +-- store          -> where data is stored (generated folder)
 +-- tests          -> all tests
 +-- index.js       -> main service
 +-- htmlParser.js      -> all the html parsing logic
 +-- schools.json   -> config file that tells server which schedule to fetch
 ``` 
 
> Example school insert
```mysql-sql
INSERT INTO school (id, name, fullName, homeUrl, timetableUrl, siteVersion, logo, added) VALUES ('0', 'SCNG', 'Šolski center Nova Gorica', 'https://www.scng.si', '', 'v1', '/news/logo/scng.png', '2019-07-26');

INSERT INTO school (id, name, fullName, homeUrl, timetableUrl, siteVersion, logo, added) VALUES ('224', 'ERS', 'Elektrotehniška in računalniška šola', ' http://ers.scng.si', 'https://www.easistent.com/urniki/e29aeb36cd1efde89c2b2c28e33209813ec32756', 'v1', '/news/logo/ers-scng.png', '2019-07-26');
```