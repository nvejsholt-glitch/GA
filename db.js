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