// JS para sidebar
parseJwt();
getEmployeeUserData();

document.getElementById("sair").addEventListener("click", () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userinfo")
    localStorage.removeItem("userCompleteInfo")

    window.location.href = "/#/login";
})

function parseJwt()
{
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

async function getEmployeeUserData()
{
    const userData = JSON.parse(localStorage.getItem("userInfo"));
    console.log(userData);
    
    const register = userData.register;
    const token = localStorage.getItem("token");
    try
    {
        const response = await fetch(`http://localhost:4444/employees/${register}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        if (!response.ok)
        {
            throw new Error("Falha na requisição do funcionário");
        }
        const userCompleteData = await response.json();
        // console.log("Usuário encontrado", userCompleteData);
        localStorage.setItem("userCompleteInfo", JSON.stringify(userCompleteData));
        verifyAuthorizationToShowContent();
        completeSidebarUserInfo();
    }
    catch (error)
    {
        console.log(error);
    }
}

function verifyAuthorizationToShowContent() {
    const userInfo = JSON.parse(localStorage.getItem("userCompleteInfo"));
    console.log(userInfo);
    

    if (userInfo.type != "admin") {
        const elementsToHide = document.querySelectorAll(".only-admin");
        elementsToHide.forEach((element) => {
            element.remove();
        });
    }
}

function completeSidebarUserInfo()
{
    const userInfo = JSON.parse(localStorage.getItem("userCompleteInfo"));

    // Nome do usuário
    const userNameElement = document.getElementById("projectSidebarLabel");
    userNameElement.innerText = userInfo.name;

    // Cargo do usuário
    const userRoleElement = document.getElementById("cargoText");
    userRoleElement.innerText = `Cargo: ${userInfo.role}`;

    // Matrícula do usuário
    const userRegisterElement = document.getElementById("registerText");
    userRegisterElement.innerText = `Matrícula: ${userInfo.register}`;
}