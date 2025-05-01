const loginForm = document.getElementById("loginForm");
console.log(loginForm);

if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        try {
            await sendLogin();
        } catch (error) {
            console.error("Erro no login:", error.message);
        }
    });
}

async function sendLogin() {
    const formData = new FormData(loginForm);
    const loginData = Object.fromEntries(formData.entries());

    console.log(loginData);

    validateLoginInputs(formData);
    const response = await fetch("http://localhost:4444/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
    });

    if (!response.ok) {
        throw new Error("Falha no login");
    }

    const result = await response.json();
    console.log("Login bem-sucedido:", result);

    // Salvar o token e o tipo de usuário
    localStorage.setItem("token", result.token);
    window.location.href = "/#/dashboard-horario";
}

function validateLoginInputs(formData) {
    const entries = Array.from(formData.entries());

    entries.forEach(([fieldName, fieldValue]) => {
        if (!fieldValue.trim()) {
            throw new Error(`O campo ${fieldName} não pode estar vazio.`);
        }

    });
}