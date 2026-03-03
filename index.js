const express = require("express")
require("pug")
const app = express()
app.listen(3456, ()=>{console.log("port: 3456")})

app.set("view engine", "pug")

app.use(express.urlencoded({extended:true}))

const perfumes = [
  { id: 1, brand: "Chanel", model: "No.5 Eau de Parfum", price: "1450 kr" },
  { id: 2, brand: "Dior", model: "J’adore Eau de Parfum", price: "1395 kr" },
  { id: 3, brand: "Yves Saint Laurent", model: "Black Opium", price: "1199 kr" },
  { id: 4, brand: "Gucci", model: "Bloom Eau de Parfum", price: "1099 kr" },
  { id: 5, brand: "Versace", model: "Bright Crystal", price: "995 kr" }
];

app.get("/",auth,(req, res)=>{
    res.render("index",{title:"HOME", name:"Lenny"})

})

app.get("/parfym", auth,(req, res)=>{
    res.render("parfym",{perfumes})
})

function auth(req, res, next){
  res.locals.auth = {auth:true, text: "Logged in"}
  next()
}

app.post("/contact", auth,(req, res)=>{
    const {name} = req.body || "NO_NAME"
    res.render("contact",{name})
})