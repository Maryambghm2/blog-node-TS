// CRUD 
const express = require("express");

// HACHAGE
const argon2 = require("argon2");

// TRAITEMENT DU PARSER 
const bodyParser = require("body-parser");

const query = require("./db.js");
const app = express();
const port = 8080;


// middleware bodyparser ;Dire au système qu'il s'agit d'un json
app.use(bodyParser.json());

// CHEMIN ROOT DE BASE ;RACINE 
app.get('/', (req, res) => {
    res.send("Bienvenue sur l'API Blog !");
});

// CHEMIN  USERS 
// get pour users
app.get('/users', async (req, res) => {
    const result = await query('SELECT * FROM users')
    res.send(result.rows)
});


// Get pour un user spécifique
app.get('/users/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    console.log('id:', id);
    // SI valeur 'id' invalide 
    if (isNaN(id)) {
        return res.status(400).send("L'id doit être un entier");
    }
    try {
        // Constante récupération de l'utilisateur dans le tableau 
        const result = await query('SELECT * FROM users WHERE id_user = $1', [id]);
        // Verif si l'utilisateur existe 
        if (result.rowCount === 0) {
            return res.status(404).send(`L'id ${id} n'a pas été trouvé`);
        } else {
            return res.status(201).send(result.rows);
        }
    } catch (err) {
        console.error("Erreur", err)
        res.status(500).send("Erreur serveur");
    }
});

// POST USERS INSCRIPTION
app.post('register', async (req, res) => {
    const { username, mail, password } = req.body

    // VERIF PASSWORD 
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#?!@$ %^&*-]).{8,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).send("Le mot de passe doit comporter au moins 8 caractères et inclure au moins: une majuscule, une minuscule, un chiffre et un caractère spécial.")
    }

    // const ema
    // VERIF MAIL 
    const mailCheck = await query('SELECT mail FROM users WHERE mail = $1', [mail]);
    if (mailCheck.rowCount > 0) {
        return res.status(400).send("L'email est déja utilisé, veuillez en insérer un autre.")
    }
    try {
        const hashedPassword = await argon2.hash(password);

        const result = await query('INSERT INTO users (username, mail, password) VALUES ($1, $2, $3) RETURNING *', [username, mail, hashedPassword]);
        res.status(201).send(result.rows[0]);
    } catch (error) {
        console.error("Erreur", error)
    }
});

// CHEMIN ARTICLES 
app.get('/articles', async (req, res) => {
    const result = await query('SELECT * FROM articles')
    res.send(result.rows)
});

// Get pour un article spécifique
app.get('/articles/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    console.log('id:', id);
    // SI valeur 'id' invalide 
    if (isNaN(id)) {
        return res.status(400).send("L'id doit être un entier");
    }
    try {
        // Constante récupération de l'utilisateur dans le tableau 
        const result = await query('SELECT * FROM articles WHERE id_post = $1', [id]);
        // Verif si l'utilisateur existe 
        if (result.rowCount === 0) {
            return res.status(404).send(`L'id ${id} n'a pas été trouvé`);
        } else {
            return res.status(201).send(result.rows);
        }
    } catch (err) {
        console.error("Erreur", err)
        res.status(500).send("Erreur serveur");
    }
});


app.listen(port, () => {
    console.log("Serveur en ligne dans le port 8080 !");
});