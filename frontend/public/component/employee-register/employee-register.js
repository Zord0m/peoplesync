const registerForm = document.getElementById("registerForm");
console.log(registerForm);

if (registerForm) {
    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        try {
            await sendRegister();
        } catch (error) {
            console.error("Erro no registro:", error.message);
        }
    });
}

async function sendRegister() {
    const formData = new FormData(registerForm);
    const registerData = Object.fromEntries(formData.entries());

    console.log(registerData);

    validateRegisterInputs(formData);
    const response = await fetch("http://localhost:4444/employees/set-password", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(registerData),
    });

    if (!response.ok) {
        throw new Error("Falha no registro");
    }

    const result = await response.json();
    console.log("Login bem-sucedido:", result);

    // Salvar o token e o tipo de usuário
    localStorage.setItem("token", result.token);
    window.location.href = "/#/dashboard-horario";
}

function validateRegisterInputs(formData) {
    const entries = Array.from(formData.entries());

    entries.forEach(([fieldName, fieldValue]) => {
        if (!fieldValue.trim()) {
            throw new Error(`O campo ${fieldName} não pode estar vazio.`);
        }
    });
}