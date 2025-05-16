window.addEventListener("load", () => {
    console.log("Ola mundo")
})

async function logOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('userCompleteInfo');
    window.navigateTo('/login');
}

async function verifyUserTokenLoginExpiration() {
    const token = localStorage.getItem("token");
    if (token) {
        const testResponse = await fetch(`http://localhost:4444/test-token/${token}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        if (!testResponse.ok) {
            logOut();
        }
    }
}

function showToast(message, type = 'success') {
    const toastEl = document.getElementById('liveToast');
    const toastBody = toastEl.querySelector('.toast-body');

    // Define a mensagem
    toastBody.textContent = message;

    // Remove classes de status anteriores
    toastEl.classList.remove('bg-success', 'bg-danger', 'bg-warning', 'bg-info');

    // Adiciona a classe correspondente ao tipo
    switch (type) {
        case 'success':
            toastEl.classList.add('bg-success');
            break;
        case 'error':
            toastEl.classList.add('bg-danger');
            break;
        case 'warning':
            toastEl.classList.add('bg-warning');
            break;
        case 'info':
            toastEl.classList.add('bg-info');
            break;
        default:
            toastEl.classList.add('bg-primary');
    }

    // Inicializa e exibe o toast
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
}