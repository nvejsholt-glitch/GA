const express = require("express")
require("pug")
const app = express()
app.listen(3456, ()=>{console.log("port: 3456")})
const {getData, saveData} = require("./db")
const fs = require("fs")

app.set("view engine", "pug")

app.use(express.urlencoded({extended:true}))



app.get("/",auth,(req, res)=>{
    res.render("index",{title:"HOME", name:"Noah"})

})

app.get("/products", (req, res) => {
	const products = getData()

	res.render("products", { 
		title: "Produkter",
		products: products
	})
})

app.get("/products/create/:name/:price", (req, res) => {
    const prod = req.params
    prod.id = Date.now()
    const products = getData()
    products.push(prod)
    saveData(products)


    res.redirect("/products")


})

app.get("/products/delete/:id", (req, res)=>{
    const id = req.params.id
    const products = getData()

    const filteredProducts = products.filter(p=>p.id !=id)
    let mes= id + "_deleted"
    
    if(products.length == filteredProducts.length){
        mes = "Nothing_Deleted"
    }


    saveData(filteredProducts)
    res.redirect("/products?"+mes)
   
})

function auth(req, res, next){
  res.locals.auth = {auth:true, text: "Logged in"}
  next()
}


app.get("/login", (req, res)=>{
    const pin = req.query.pin

    if(pin != process.env.pin) return res.send(render("bad Credentials"))


    req.session.auth = true

res.send(render("Login Success"))

})