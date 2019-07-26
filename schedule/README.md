## Schedule module

This module handles schedule updates, parsing and exposes external REST api.

```
 +-- store          -> where data is stored (generated folder)
 +-- tests          -> all tests
 +-- index.js       -> main service
 +-- parser.js      -> all the html parsing logic
 +-- schools.json   -> config file that tells server which schedule to fetch
 ``` 
 
> Example school insert
```mysql-sql
INSERT INTO school (id, name, fullName, url, added) VALUES ('224', 'ers', 'Elektrotehniška in računalniška šola', 'https://www.easistent.com/urniki/e29aeb36cd1efde89c2b2c28e33209813ec32756', '2019-07-26');
```