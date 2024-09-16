// CRUD 
const express = require("express");

// HACHAGE
const argon2 = require("argon2");

const cors = require('cors');
// TRAITEMENT DU PARSER 
const bodyParser = require("body-parser");

const query = require("./db.js");
const app = express();
const port = 8080;


// middleware bodyparser ;Dire au système qu'il s'agit d'un json
app.use(bodyParser.json());

// POUR RECUPERER IMAGE 
app.use(cors());
app.use('/pic', express.static('public/pic'));

// CHEMIN ROOT DE BASE ;RACINE 
app.get('/', (req, res) => {
    res.send("Bienvenue sur l'API Blog !");
});

// CHEMIN  USERS 
// get pour users
app.get('/users', async (req, res) => {
    
    try {
        // Param requete username 
        const { username } = req.query;

        // REQUETE SQL DE BASE 
        let queryReq = 'SELECT * FROM users';
        let queryParams = [];


        if (username) {
            queryReq += ' WHERE username = $1';
            queryParams.push(username);
        }

        const result = await query(queryReq, queryParams);

        // Envoi reponse 
        res.send(result.rows);
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs :', error);
        res.status(500).send('Erreur serveur');
    }

});


// Get pour un user spécifique PAR ID
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
            return res.send(result.rows[0]);
        }
    } catch (err) {
        console.error("Erreur", err)
        res.status(500).send("Erreur serveur");
    }
});

// Get pour récuperer les articles d'un user spécifique
app.get('/articles/users/:id', async (req, res) => {
    const id = req.params.id;

    if (isNaN(id)) {
        return res.status(400).send("L'ID de l'utilisateur doit être un entier valide.");
    }
    try {
        // REQUETE POSTGRESQL
        const reqQuery = `SELECT a.*, u.username, u.mail FROM articles a
         JOIN users u on a.author =  u.id_user
         WHERE a.author = $1`;

        const result = await query(reqQuery, [id]);

        // Vérifier si l'user à des articles associée à lui 
        if (result.rowCount === 0) {
            return res.status(404).send('Aucun article trouvé pour cet utilisateur');
        }
        return res.send(result.rows);

    } catch (err) {
        console.error("Erreur", err)
        res.status(500).send("Erreur serveur");
    }
});

// POST USERS INSCRIPTION
app.post('/users/register', async (req, res) => {
    const { username, mail, password } = req.body


    // VERIF CHAMPS VIDE 
    if (!username || !mail || !password) {
        return res.status(400).send("Tout les champs sont obligatoires.");
    }

    // USERNAME :
    // VERIF USERNAME UTILISER
    const usernameCheck = await query('SELECT username FROM users WHERE username = $1', [username]);
    if (usernameCheck.rowCount > 0) {
        return res.status(400).send("Le nom d'utilisateur est déjà pris, veuillez en choisir un autre.");
    }
    // VERIF LONGUEUR USERNAME 
    else if (username.length < 3 || username.length > 25) {
        return res.status(400).send("Le nom d'utilisateur doit contenir entre 3 et 25 caractères.");
    }

    // PASSWORD :
    // VERIF PASSWORD REGEX
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#?!@$ %^&*-]).{8,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).send("Le mot de passe doit comporter au moins 8 caractères et inclure au moins: une majuscule, une minuscule, un chiffre et un caractère spécial.")
    }
    // VERIF LONGUEUR PASSWORD 
    else if (password.length > 100) {
        return res.status(400).send("Le mot de passe est trop long (maximum 100 caractères).");
    }

    // MAIL :
    // REGEX VERIF MAIL 
    const mailRegex = /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/;
    if (!mailRegex.test(mail)) {
        return res.status(400).send("Le format de l'email est invalide.")
    }
    // VERIF LONGUEUR MAIL 
    else if (mail.length > 255) {
        return res.status(400).send("L'email est trop long (maximum 255 caractères).");
    }
    // VERIF MAIL UTILISER
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
        res.status(500).send("Erreur serveur");
    }
});

// ROUTE CONNEXION 
app.post('/users/login', async (req, res) => {
    const { mail, password } = req.body
    try {
        // RECHERCHE USER PAR EMAIL 
        const result = await query('SELECT * FROM users WHERE mail = $1', [mail]);
        const user = result.rows[0];

        // SI USER N'EXISTE PAS 
        if (!user) {
            return res.status(400).send("L'email est incorrect ou ne correspond à aucun compte.");
        }

        // VERIF CHAMPS VIDE 
        if (!mail || !password) {
            return res.status(400).send("L'email et le mot de passe sont requis.");
        }
        // REGEX VERIF MAIL 
        const mailRegex = /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/;
        if (!mailRegex.test(mail)) {
            return res.status(400).send("Le format de l'email est invalide.")
        }

        // VERIF PASSWORD REGEX
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#?!@$ %^&*-]).{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).send("Le mot de passe doit comporter au moins 8 caractères et inclure au moins: une majuscule, une minuscule, un chiffre et un caractère spécial.")
        }

        // Comparaison mot de passe donné et ceux qui sont hachés
        const passwordMatch = await argon2.verify(user.password, password);

        // SI MOT DE PASSE NE CORRESPOND PAS 
        if (!passwordMatch) {
            return res.status(400).send("Mot de passe incorrect.")
        } else {
            res.status(200).send(`Connexion réussie, bienvenue ${user.username}`);
        }
    } catch (error) {
        console.error("Erreur", error)
        res.status(500).send("Erreur serveur");
    }
});

// CHEMIN ARTICLES 
app.get('/articles', async (req, res) => {
    try {
        const reqQuery = `SELECT a.id, a.title, a.content, a.created_at, a.picture, 
        u.username AS author
 FROM articles a
 JOIN users u  ON a.author = u.id_user`;

        const result = await query(reqQuery);

        // console.log("Articles recu:", result.rows);
        return res.status(200).send(result.rows);
    } catch (error) {
        console.error("Erreur lors de la récupération des articles :", error);
        res.status(500).send("Erreur serveur");
    }
});

// CHEMIN ARTICLE SPECIFIQUE
app.get('/articles/:id', async (req, res) => {
    const id = parseInt(req.params.id);

    // SI valeur 'id' invalide 
    if (isNaN(id)) {
        return res.status(400).send("L'ID de l'article doit être un entier valide.");
    }

    try {
        // Constante récupération de l'utilisateur dans le tableau 
        const result = await query(
            `SELECT a.id, a.title, a.content, a.created_at, a.picture, a.author AS author_id,
                    u.username AS author 
             FROM articles a
             JOIN users u ON a.author = u.id_user 
             WHERE a.id = $1`,
            [id]
        );

        // Verif si l'utilisateur existe 
        if (result.rowCount === 0) {
            return res.status(404).send(`Aucun article trouvé avec l'ID ${id}.`);
        } else {
            res.send(result.rows[0]);
        }
    } catch (error) {
        console.error("Erreur lors de la récupération de l'article :", error);
        res.status(500).send("Erreur serveur");
    }
});


// POST pour crée un article 
app.post('/articles', async (req, res) => {
    const { title, content, picture, author } = req.body;

    if (!title || !content || !author) {
        return res.status(400).send("Tous les champs (titre, contenu, auteur) sont obligatoires.")
    }
    try {
        let authorId = parseInt(author);
        if (isNaN(authorId)) {
            // RECHERCHE PAR USERNAME SI CHAINE CARACTERE
            const authorCheckByUsername = await query('SELECT id_user FROM users WHERE username = $1', [author]);
            if (authorCheckByUsername.rowCount === 0) {
                return res.status(400).send(`L'auteur spécifié par le nom d'utilisateur "${author}" n'existe pas.`);
            }
            authorId = authorCheckByUsername.rows[0].id_user;
        } else {
            const authorExist = await query('SELECT FROM users WHERE id_user = $1', [authorId]);
            if (authorExist.rowCount === 0) {
                return res.status(400).send(`L'auteur spécifié pour l'id (${authorId}) n'existe pas.`);
            }
        }

        // console.log('title:', title, ', content:', content, ', picture:', picture || null, ', author:', authorId);

        // INSERTION NOUVELLE ARTICLE 
        const result = await query('INSERT INTO articles (title, content, created_at, picture, author) VALUES ($1, $2, NOW(), $3, $4) RETURNING *',
            [title, content, picture || null, authorId]);
        res.status(201).send(result.rows[0]);

    } catch (error) {
        console.error("Erreur lors de l'ajout de l'article :", error);
        res.status(500).send("Erreur serveur");
    }
});



app.listen(port, () => {
    console.log("Serveur en ligne dans le port 8080 !");
});