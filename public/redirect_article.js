async function fetchArticle() {
    try {

        const articleId = new URLSearchParams(window.location.search).get("id");

        console.log(articleId);
        // Récupération articles 
        const articlesResponse = await fetch(`http://localhost:8080/articles/${articleId}`);
        const article = await articlesResponse.json();


        // Récupération USER 
        const usersResponse = await fetch(`http://localhost:8080/users/${article.author_id}`);
        const user = await usersResponse.json();

        if (user.id_user === article.author) {
            console.log("Utilisateur et article correspondent"); } else {
                "PAS DE CORRESPONDANCE"
            };

        // TEST contenue JSON 
        console.log('Articles:', article);

        console.log('Users:', user);

        const imageUrl = article.picture ? `http://localhost:8080/pic/${article.picture}` : 'http://localhost:8080/pic/default.jpg';

        // PARTIE HTML 
        const articlesHtml = `
        <img src="${imageUrl}" alt="${article.title}" width="400px">
        <h4>${article.title}</h4>
        <h5>Date : ${formatDate(article.created_at)}</h5>
        <p>Auteur :  <a href="../public/user.html?id=${user.id_user}">${article.author}</a></a></p>
        <p>${article.content}</p>`;


        document.getElementById('article-info').innerHTML = articlesHtml;


    } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs :", error);
    }

    // FONCTION FORMATAGE DATE 
    function formatDate(dateString) {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('fr-FR', options);
    }
};

document.addEventListener('DOMContentLoaded', fetchArticle);
