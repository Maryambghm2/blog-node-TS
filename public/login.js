document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('http://localhost:8080/users/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json' // Indiquer que le corps de la requête est en JSON
                    },
                    body: JSON.stringify({ mail: email, password: password })
                });

                if (response.ok) {
                    alert('Connexion réussie !');
                    window.location.href = 'http://127.0.0.1:5500/public/articles.html';
                } else {
                    const errorText = await response.text();
                    alert(`Erreur: ${errorText}`);
                }
            } catch (error) {
                console.error('Erreur lors de la connexion', error);
                alert('Erreur lors de la connexion');
            }
        });
    }
});