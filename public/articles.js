async function fetchBlog() {
    try {
        // URL API 
        const fetchArticles = fetch('http://localhost:8080/articles');
        const fetchUsers = fetch('http://localhost:8080/users');

        // Tableau promesse Regroupant fetch 
        const [articlesResponse, userResponse] = await Promise.all([fetchArticles, fetchUsers]);

        // CONVERSION JSON 
        const articles = await articlesResponse.json();
        const users = await userResponse.json();


        // TEST contenue JSON 
        console.log('Articles:', articles);

        console.log('Users:', users);

        // Afficher post aléatoire 
        const selectArticles = articles.sort(() => 0.5 - Math.random());


        // Afficher 6 premier post 
        // const sixArticles = selectArticles.slice(0, 6);

        // TABLEAU POUR CHAQUE POST 
        const articlesHtml = selectArticles.map(article => {

            // TROUVER USER CORRESPONDANT ARTICLES 
            const user = users.find(u => u.username === article.author);

            // IMAGE SI DONNER OU IMAGE PAR DEFAUT 
            const imageUrl = article.picture ? `http://localhost:8080/pic/${article.picture}` : 'http://localhost:8080/pic/default.jpg';

            return `
            <div class="articles">
            <img src="${imageUrl}" alt="${article.title}" width="400px">
             <h4><a href="../public/redirect_article.html?id=${article.id}">${article.title}</a></h4>
             <div class="align_infos">
            <h5>Date : ${formatDate(article.created_at)}</h5>
            <h5>Auteur : <a href="../public/user.html?id=${user.id_user}">${user.username}</a></h5>
            </div>
             </div>`;
        }).join('');

        document.getElementById('articles-list').innerHTML = articlesHtml;
    } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs :", error);
    }

    // FONCTION FORMATAGE DATE 
    function formatDate(dateString) {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('fr-FR', options);
    }
};

document.addEventListener('DOMContentLoaded', fetchBlog);


// -------------------------------------------------

// Ecouteur d'evenement clic POUR BOUTON CREER UN ARTICLE 


document.getElementById('create-post-btn').addEventListener('click', () => {
        window.location.href = 'http://127.0.0.1:5500/public/create_article.html'; // Redirection vers la page de création d'article
    });



// -------------------------------------------------
// DECONNEXION :

function handleLogout() {
    try {
        // Efface les informations d'authentification stockées côté client
        localStorage.removeItem('userData'); // Ou sessionStorage.removeItem('userData'), selon où tu stockes les infos

        // Redirection vers la page de connexion
        alert('Déconnexion réussie');
        window.location.href = 'http://127.0.0.1:5500/public/login.html'; // Redirection vers la page de login
    } catch (error) {
        console.error('Erreur lors de la déconnexion:', error);
        alert('Erreur lors de la déconnexion');
    }
}

// Attache la fonction handleLogout au bouton de déconnexion
document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.getElementById('logout-btn');
    if (logoutButton) {
        logoutButton.addEventListener('click', handleLogout);
    }
});
