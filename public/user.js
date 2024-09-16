async function fetchUser() {
    try {
        // Récupérer l'ID utilisateur depuis l'URL
        const userId = new URLSearchParams(window.location.search).get('id');

        // ERREUR si pas d'ID
        if (!userId) {
            console.error("ID utilisateur non fourni dans l'URL.");
            return;
        }

        // Récupération USER
        const userResponse = await fetch(`http://localhost:8080/users/${userId}`);
        const user = await userResponse.json();

      
        // SI PAS D'UTILISATEUR
        if (!user) {
            console.error("Utilisateur non trouvé");
            document.getElementById('user-info').innerHTML = "<p>Utilisateur non trouvé.</p>";
            return;
        }

        // ARTICLES 

        // Récupération articles 
        const articlesResponse = await fetch(`http://localhost:8080/articles/users/${userId}`);
        const articles = await articlesResponse.json();

        // const articleUser = articles.filter( a => a.author === user.id_user);
        
        // SI PAS D'ARTICLE 
        if (articles.length === 0) {
            document.getElementById('articles-list').innerHTML = "<p>Aucun article trouvé pour cet utilisateur.</p>";
            return;
        }

        console.log(articles.author);
        console.log(user.mail);

        const userInfoHtml = `
    <h2>${user.username}</h2>
    <p>Email : ${user.mail}</p>
`;

        // Insérer les informations de l'utilisateur dans l'élément 'user-info'
        document.getElementById('user-info').innerHTML = userInfoHtml;


        // Générer le HTML POUR ARTICLES 
        const articlesHtml = `
            <div class="articles">
                <h4>Articles:</h4>
                <ul>
                ${articles.map(article =>
            `<li>
                    <img src="http://localhost:8080/pic/${article.picture || 'default.jpg'}" alt="${article.title}" width="400px">
                    <a href="../public/redirect_article.html?id=${article.id}">${article.title}</a>
                    <h5>Date : ${formatDate(article.created_at)}</h5>
                </li>`).join('')}
                </ul>
            </div>`;

        document.getElementById('articles-list').innerHTML = articlesHtml;

    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        document.getElementById('user-info').innerHTML = `<p>Une erreur est survenue : ${error.message}</p>`;
    }

    // Fonction formater date
    function formatDate(dateString) {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('fr-FR', options);
    }
}

document.addEventListener('DOMContentLoaded', fetchUser);
