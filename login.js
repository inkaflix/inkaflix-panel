// public/login.js

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const messageElement = document.getElementById('message');

    // Función para mostrar mensajes de error/éxito
    function showMessage(msg, isError = true) {
        messageElement.textContent = msg;
        messageElement.style.backgroundColor = isError ? '#ffe0e0' : '#e6ffe6';
        messageElement.style.color = isError ? '#d8000c' : '#00a000';
        messageElement.style.display = 'block';
    }

    // --- 1. Redirección si ya está logueado ---
    // Si ya existe un token en el almacenamiento local, redirige al panel.
    const token = localStorage.getItem('adminToken');
    if (token) {
        window.location.href = '/admin'; 
        return; // Detiene la ejecución del script para evitar que se cargue el formulario
    }

    // --- 2. Manejo del formulario de Login ---
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        messageElement.style.display = 'none'; // Oculta mensajes previos

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Éxito: Guarda el token JWT y redirige
                localStorage.setItem('adminToken', data.token);
                showMessage('✅ Acceso concedido. Redirigiendo...', false);
                
                // Redirige al panel después de un pequeño retraso
                setTimeout(() => {
                    window.location.href = '/admin'; 
                }, 1000); 

            } else {
                // Falla: Muestra el mensaje de error del servidor
                showMessage(data.message || 'Error desconocido al iniciar sesión.');
            }
        } catch (error) {
            // Error de red (servidor caído o no accesible)
            showMessage('❌ Error de conexión: El servidor no está disponible.');
            console.error('Fetch error:', error);
        }
    });
});


