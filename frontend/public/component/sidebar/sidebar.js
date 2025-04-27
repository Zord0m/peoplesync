// JS para sidebar 
function parseJwt(token) {
    try {
        const base64Payload = token.split('.')[1];
        const payload = atob(base64Payload); // decodifica base64
        return JSON.parse(payload); // transforma em objeto JS
    } catch (e) {
        console.error("Token inválido");
        return null;
    }
}

// Exemplo de uso:
const token = localStorage.getItem("token");
const payload = parseJwt(token);

if (payload) {
    console.log("Tipo de usuário:", payload.type); // admin ou comum
}