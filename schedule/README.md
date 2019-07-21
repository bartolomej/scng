## Schedule module

This module handles schedule updates, parsing and exposes external REST api.

```
 +-- store          -> where data is stored (generated folder)
 +-- tests          -> all tests
 +-- index.js       -> main service
 +-- parser.js      -> all the html parsing logic
 +-- schools.json   -> config file that tells server which schedule to fetch
 ``` 
 
> Example school.json config file
```json
[
  {
    "name": "ers",
    "id": "224",
    "fullName": "Elektrotehniška in računalniška šola",
    "url": "https://www.easistent.com/urniki/e29aeb36cd1efde89c2b2c28e33209813ec32756"
  }
]
```