window.addEventListener("load", () => {
    console.log("Ola mundo")
})

function logOut() {
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