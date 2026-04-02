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
Express används för att få upp det jag skriver på skärmen den är "express lane"

require pug är första steget för att js ska vete att man använder pug

app = express

app listen() visar vart express ska peka mot med en console log som säger 3456 för tydlighet

const{get..., save...} är för att koden får tillgång till dessa funktioner

fs står för file sync används för fil-överföra

session = express-session vilket används för att hålla en inlåggad även när man refreshar

users = const för att använda en fil för users/användare

app.set views så vet den vart den hittar pug filer


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
Här skriver du fakta om kodan ovan

use session sätter igång express-session.

secret kan vara vad som helst, spelar ingen roll.

SaveUnitialized ?=???

cookie  för att använda cookies som behövs för att fortsätta vara och att logga in

httpOnly för att vi bara jobbat på webben

Secure använder vi inte


Auth använder jag för att kolla ifall jag är inloggad på sidan så att jag får tillåtelse att ändra på saker. Detta är då en middleware function

if man inte är req.session.user alltså i en session som en user så sätts auth som false vilket nekar funktioner och user till null vilket är näst intill samma sak men med user vilket är en annan funktion

Detta skickar då ett medelande som visar mig att nåt gått fel eller till kunden för att säga att nåt gick fel

locals.user är en local variabel som då sparas lokalt

vilket sen blir = request som session user

next() för att de inte ska haka upp sig


res.locals är som en bubbla som klienten får som svar från servern och vi lägger ett värde auth och user eller false och null då vi kan låta pug använda detta


express.urlencoded för att parsa kod så att det kommer till req.body så att pug kan använda det
***

### ROUTES
```js
app.get("/", auth, (req, res) => {
    console.log("INDEX", req.session)
    res.render("index", { title: "HOME", email: req.session.user.email });
})


```
app.get med auth middleware req för request och res för respond från servern pil för funktion

consolelogar index i req.session så att det står index i våran session

render för pug att göra html till index variabel title brir HOME variabel email blir samma som req.session.user.emial

***
```js
app.get("/logout", auth, (req, res) => {

    req.session.destroy()
    res.redirect("/")

})
```
går till / logout för att inte skapa en loop där man förstör hela tiden i / 

session destroy gör det den säger den eliminerar session den klipper kabeln mellan user och session

tillslut redirect till hem
***
```js
app.get("/session", (req, res) => {
    console.log("SESSION", req.session);
    res.send(req.session);
})
```
/session kommer logga "Session" sen skickar vi in en rad av strängar och variabler som beskriver våran session som id user mm
***
```js
app.get("/products", (req, res) => {
    const products = getData()

    res.render("products", { products: products, title: "PRODUCTS" })
})
```
/product där vi renderar pug kod till den routen skickar in en variabel products och title för pug att jobba med

kallar också på getData genom products vilket sen används i pug
***
```js
app.post("/products/create", auth, (req, res) => {
    if (!req.session.user) {
        return res.render("index", { error: "Not logged in..." })
    }

    const { name, price } = req.body

    const prod = {
        id: Date.now(),
        name,
        price,
        uid: req.session.user.id
    }

    const products = getData()
    products.push(prod)
    saveData(products)

    res.redirect("/products")
})
```
Post så istället för query så jobbar vi med body
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