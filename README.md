# GA - Noah

## PUG & HTMX

### SERVER
```js
const express = require("express")
require("pug")
const app = express()
app.listen(3456, ()=>{console.log("port: 3456")})
const {getData, saveData, getUsers, saveUsers} = require("./db")
const fs = require("fs")
const session = require("express-session")
const users = require("./users.json")
const bcrypt = require("bcrypt")
app.set("view engine", "pug")


```
Här skriver du fakta om kodan ovan
***

### MIDDLEWARE
```js

/* Middleware */
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: false,
    }
}
))

function auth(req, res, next) {
    if (!req.session.user) {
        res.locals.auth = false;
        res.locals.user = null;
        return res.render("index", { error: "Not logged in...", title: "HOME" })
    }
    res.locals.auth = true;
    // Nedanstående variabel blir åtkomlig för pug som variabel user
    res.locals.user = req.session.user
    next()
}


app.use((req, res, next) => {

    res.locals.auth = req.session.auth || false
    res.locals.user = req.session.user || null
    next();
})



app.use(express.urlencoded({ extended: true }))


```

***

### ROUTES
```js

```
Här skriver du fakta om kodan ovan
***
```js

```
Här skriver du fakta om kodan ovan
***
```js

```
Här skriver du fakta om kodan ovan
***
```js

```
Här skriver du fakta om kodan ovan
***
```js

```
Här skriver du fakta om kodan ovan
***
```js

```
Här skriver du fakta om kodan ovan
***
```js

```
Här skriver du fakta om kodan ovan
***
```js

```
Här skriver du fakta om kodan ovan
***
```js

```
Här skriver du fakta om kodan ovan
***
```js

```
Här skriver du fakta om kodan ovan
***
```js

```
Här skriver du fakta om kodan ovan
***
```js

```
Här skriver du fakta om kodan ovan
***