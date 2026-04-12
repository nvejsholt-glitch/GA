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
Post så istället för query så jobbar vi med body istället för query

enkel koll ifall jag är inloggad eller inte om inte så sätts error till not logged in 

Gör så att name och price kan tas från body

Skapar produktobjekt med id name price och uid uid gör så att man kan koppla användare till produkt

sparar produkten 

***
```js
app.get("/products/delete/:id", auth, (req, res) => {

    const id = req.params.id
    const products = getData()

    const filteredProducts = products.filter(p => {

        if (p.id == id && p.uid == req.session.user.id) {
            return false;
        }
        else {
            return true
        }
    })



    let mes = id + "_deleted"

    if (products.length == filteredProducts.length) {
        mes = "Nothing_Deleted"
    }


    saveData(filteredProducts)
    res.redirect("/products?" + mes)

})
```
Skapar id objekt av params.id 

hämtar data 

Filtrerar produkterna så att produkten som trycks på om den tillhör användaren

gör mes till idet av produkten och _deleted

om antalet produkter stannar densamma (alltså inget blev bortaget) så blir mes nothing_Deleted

Sparar och går tillbaka till routen produkts med mes som visas i sökbaren
***
```js
app.post("/register", async (req, res) => {
    const { email, password } = req.body
    const users = getUsers()

    const user = users.find(u => u.email === email)

    if (user) {
        return res.render("index", { error: "Email already registered" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = {
        id: "id_" + Date.now(),
        email,
        password: hashedPassword
    }

    users.push(newUser)
    saveUsers(users)

    res.redirect("/")
})
```
async använder vi så att inget hakar upp sig medans lösenordet crypteras

hämtar email och pasword

använder find för att plocka ut en email som är samma som är inlagt

hashar lösenordet med 10/20

skapar newuser med id email och hashat password

lägger till newUser i users

redirect till / 
***
```js
app.post("/login", async (req, res) => {
    const { email, password } = req.body
    const users = getUsers();
    const user = users.find(u => u.email == email)



    if (!user) {
        console.log("FEL INLOGGNINHG");
        res.locals.auth = false;
        return res.render("index", {
            error: "Fel email eller lösenord"


        })
    }
    const match = await bcrypt.compare(password, user.password)

    if (!match) {
        return res.render("index", { error: "Fel login" })
    }


    req.session.user = user
    req.session.auth = true;
    res.locals.user = req.session.user
    res.locals.auth = true;

    res.redirect("/products");
})
```
if command för ifall user inte existerar då console säger fel inloggning, locals.auth sätts till false och den säger fel email eller lösenord som error

kör bcrypt compare password med user.password som hashar på samma sätt och sen gemför dem

stoppar ifall det inte blir en match

Gör session.user till user, session auth till true detta sparar att användaren är inloggad

locals.user och .auth gör så att pug kan använda faktan om du är inloggad
***
```pug
doctype html
html(lang="en")
	head
		meta(charset="UTF-8")
		meta(name="viewport", content="width=device-width, initial-scale=1.0")
		title=title
		include style.pug
	body
		header
			if auth
				include authnav.pug
			else 
				include nav.pug

		main
			.content
				block content
				

		footer
			block end

		
			#register.forms 
				form(action="/register" method="post")
					input(type="email", name="email", placeholder="Email", required)
					input(type="password", name="password", placeholder="Password", required)
					input(type="submit", value="REGISTER")

			#login.forms
				form(action="/login" method="post")
					input(type="email", name="email", value="test@test.com" placeholder="Email", required)
					input(type="password", name="password", placeholder="Password", required)
					input(type="submit", value="LOGIN")
			
			#create.forms
				if auth
					form(action="/products/create", method="post") 
						input(type="text", name="name", placeholder="Name", required)
						input(type="number", name="price", placeholder="Price", required)
						input(type="submit", value="Create Product")
```
title=title så vi kan välja title från index.js 

include style.pug för att inkludera css

sen kollar vi om användaren är inloggad och om de är så skickar vi en nav med create och logout. Annars skickar vi en utan

block content är där filer kan lägga innehåll och block end är där det slutar

sen har vi #register.forms vilket är pugs verision för div med id register och class forms
***
### Authnav
```pug

h1 Parfymer sida
            nav
                h3
                    a(href="/") HOME
          
                h3
                    a(href="/session") Session
                h3 
                    a(href="/products") Products
                
                h3
                    a(href="#create") Create
                
                h3
                    a(href="/logout") Logout

```
### Utloggad nav



```js
h1 Parfymer sida
            nav
                h3
                    a(href="/") HOME
                h3
                    a(href="#register") Login/register
                h3
                    a(href="/session") Session
                h3
                    a(href="/products") Products
```
En har funktioner som används när man är inloggad och den andra har inte
***
```js
const fs = require("fs")

function getData(){
    const jsonString = fs.readFileSync("db.json").toString()

    const data = JSON.parse(jsonString)
    return data
}
function getUsers(){
    const jsonString = fs.readFileSync("users.json").toString()

    const data = JSON.parse(jsonString)
    return data
}
function saveUsers(data =[]){
    const jsonString = JSON.stringify(data, null, 3)
    fs.writeFileSync("users.json", jsonString)
}

function saveData(data =[]){
    const jsonString = JSON.stringify(data, null, 3)
    fs.writeFileSync("db.json", jsonString)
}

module.exports = {saveData, getData, getUsers, saveUsers}
```
kallar på file system för att användas

jsonString läser db.json där jag har produkter och gör det till strängar

data gör texten till json objekt

getUsers är samma men med users.json där jag har användar information

saveData gör en tom array för att hålla information

jsonStringify gör om input till string med null och 3 gör indentation

fs.writefyleSync skriver över texten i filen som står i detta fallet är det db.json

saveData gör samma sak fast med users
***
```pug
extends template

block content
	h1 Produkter

	each p in products
		div
			h2= p.name
			h3= p.price + " kr"
			if user
				if user.id == p.uid
					a(href=`/products/delete/${p.id}`).btn Delete
```
extends template så den bygger på på template.pug

block content är det som då sätts in i template vid block content

each p så för varje produkt skriver den i h2 namn, h3 pris och om id:et av användaren matchar p.uid som är en kopia av id:et som skaparen hade så står det en delete knapp
***
```js

```
Här skriver du fakta om kodan ovan
***
```js

```
Här skriver du fakta om kodan ovan
***