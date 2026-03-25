const express = require("express")
require("pug")
const app = express()
app.listen(3456, ()=>{console.log("port: 3456")})
const {getData, saveData, getUsers, saveUsers} = require("./db")
const fs = require("fs")
const session = require("express-session")
const users = require("./users.json")
const bcrypt = require("bcrypt")


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

function auth(req, res, next){
	if(!req.session.user){
		res.locals.auth = false;
        res.locals.user = null;
		return res.render("index",{error:"Not logged in..."})
	}
	res.locals.auth = true;
	// Nedanstående variabel blir åtkomlig för pug som variabel user
	res.locals.user = req.session.user
	next()
}


app.use((req, res, next)=>{

    res.locals.auth = req.session.auth || false
    res.locals.user = req.session.user || null  
    next();
})

app.set("view engine", "pug")

app.use(express.urlencoded({extended:true}))



app.get("/",auth, (req, res)=>{
	console.log("INDEX",req.session)
    res.render("index",{title:"HOME", name:"Noah"})

})

app.get("/logout",auth, (req, res)=>{

    req.session.destroy()
    res.redirect("/")

})

app.get("/session", (req, res) => {
	console.log("SESSION", req.session);
res.send(req.session);
})


app.get("/products", (req, res) => {
	const products = getData()

	res.render("products",{products: products})
})

app.post("/products/create", auth, (req, res) => {
	if(!req.session.user){
		return res.render("index",{error:"Not logged in..."})
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


app.get("/products/delete/:id", auth, (req, res)=>{

    const id = req.params.id
    const products = getData()

    const filteredProducts = products.filter(p=>{

        if(p.id == id && p.uid == req.session.user.id){
            return false;
        }
        else{
            return true
        }
    })



    let mes= id + "_deleted"
    
    if(products.length == filteredProducts.length){
        mes = "Nothing_Deleted"
    }


    saveData(filteredProducts)
    res.redirect("/products?"+mes)
   
})



app.post("/register", async (req, res) => {
	const { email, password } = req.body
	const users = getUsers()

	const user = users.find(u => u.email === email)

	if(user){
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

app.post("/login", async(req, res) => {
	const { email, password } = req.body
	const users = getUsers();
	const user = users.find(u => u.email == email)
    


	if(!user){
			console.log("FEL INLOGGNINHG");
            	res.locals.auth = false;
		return res.render("index", { 
			error: "Fel email eller lösenord"
        
		
		})
	}
    	const match = await bcrypt.compare(password, user.password)

	if(!match){
		return res.render("index", { error: "Fel login" })
	}


	req.session.user = user
	req.session.auth  = true;
	res.locals.user = req.session.user
	res.locals.auth = true;

	res.redirect("/products");
})