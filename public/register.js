document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');

    if (registerForm) {
        registerForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('http://localhost:8080/users/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username: username, mail: email, password: password })
                });

                if (response.ok) {
                    alert('Inscription réussie !');
                    window.location.href = 'http://127.0.0.1:5500/public/login/login.html'; 
                } else {
                    const errorText = await response.text();
                    alert(`Erreur: ${errorText}`);
                }
            } catch (error) {
                console.error('Erreur lors de l\'inscription', error);
                alert('Erreur lors de l\'inscription');
            }
        });
    }
});
