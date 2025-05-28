// login.js
(function () {
    const loginForm = document.getElementById("loginForm");
    if (!loginForm) throw new Error("Formulário de login não encontrado");

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        try {
            const formData = new FormData(loginForm);
            for (const [name, value] of formData.entries()) {
                if (!value.trim()) {
                    showToast(`O campo "${name}" não pode ficar vazio.`, "error");
                    return;
                }
            }
            const payload = Object.fromEntries(formData.entries());
            const response = await fetch('http://localhost:4444/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errText = await response.text();
                showToast(`Falha ao autenticar: ${errText}`, "error");
                return;
            }
            
            const loginResult = await response.json();
            localStorage.setItem("token", loginResult.token);
            showToast("Login efetuado com sucesso", "success");
            navigateTo('/horarios');
        } catch (error) {
            showToast(`Erro no login: ${error.message}`, "error");
        }
    });
})();
