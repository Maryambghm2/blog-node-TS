document.addEventListener('DOMContentLoaded', () => {
    const createArticleForm = document.getElementById('create-article-form');

    if (createArticleForm) {
        createArticleForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            // Récupérer les valeurs du formulaire
            const title = document.getElementById('title').value;
            const content = document.getElementById('content').value;
            const picture = document.getElementById('picture').value;
            const author = document.getElementById('author').value;

            try {
                // Envoyer les données du formulaire au serveur
                const response = await fetch('http://localhost:8080/articles', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ title, content, picture, author })
                });

                if (response.ok) {
                    const result = await response.json();
                    alert('Article créé avec succès !');

                    // REDIRECTION 
                    window.location.href = 'http://127.0.0.1:5500/public/articles.html';

                    // REINITIALISE FORMULAIRE
                    createArticleForm.reset(); // Réinitialise le formulaire
                } else {
                    const errorText = await response.text();
                    alert(`Erreur lors de la création de l'article: ${errorText}`);
                }
            } catch (error) {
                console.error('Erreur lors de la création de l\'article:', error);
                alert('Erreur lors de la création de l\'article');
            }
        });
    }
});
