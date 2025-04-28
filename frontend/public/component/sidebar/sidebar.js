// JS para sidebar

window.addEventListener("load", () => {

    function parseJwt() {
        try {
            const token = localStorage.getItem("token");
            const base64Payload = token.split('.')[1];
            const payload = atob(base64Payload); // decodifica base64
            localStorage.setItem("userInfo", payload); // transforma em string
        } catch (e) {
            console.error("Token inválido");
            return null;
        }
    }
});