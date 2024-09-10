// CRUD 
const express = require("express");

HACHAGE
const argon2 = require("argon2");

// TRAITEMENT DU PARSER 
const bodyParser = require("body-parser");

const query = require("./db.js");
const app = express();
const port = 8081;


// middleware bodyparser ;Dire au système qu'il s'agit d'un json
app.use(bodyParser.json());

// CHEMIN ROOT DE BASE ;RACINE 
app.get('/', (req, res) => {
    res.send("Bienvenue sur l'API !");
});


app.listen(port, () => {
    console.log("Serveur en ligne dans le port 8080 !");
});