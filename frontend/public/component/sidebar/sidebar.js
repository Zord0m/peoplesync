export function init() {
    parseJwt();
    function parseJwt() {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Token não encontrado');
            const base64Payload = token.split('.')[1];
            const payload = atob(base64Payload);
            localStorage.setItem('userInfo', payload);
            getEmployeeUserData();
        } catch (err) {
            console.error('Token inválido:', err);
        }
    };

    async function getEmployeeUserData() {
        const userInfoRaw = localStorage.getItem('userInfo');
        if (!userInfoRaw) return;

        const userData = JSON.parse(userInfoRaw);
        const register = userData.register;
        const token = localStorage.getItem('token');


        try {
            let userCompleteData;
            if (userData.type === "admin") {
                const userResponse = await fetch(`http://localhost:4444/employees/${register}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!userResponse.ok) {
                    logOut();
                    throw new Error('Falha ao buscar dados do funcionário');
                }
                userCompleteData = await userResponse.json();
                localStorage.setItem('userCompleteInfo', JSON.stringify(userCompleteData));
            } else {
                const userResponse = await fetch(`http://localhost:4444/employees/public/${register}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                if (!userResponse.ok) {
                    logOut();
                    throw new Error('Falha ao buscar dados do funcionário');
                }
                userCompleteData = await userResponse.json();
                localStorage.setItem('userCompleteInfo', JSON.stringify(userCompleteData));
            }
            console.log(userCompleteData)

            generateSidebarContent(userCompleteData);
        } catch (err) {
            console.error('Erro ao inicializar sidebar:', err);
        }
    };

    function generateSidebarContent(userCompleteData) {
        const sidebarContainer = document.getElementById("projectSidebar");
        if (userCompleteData.type !== 'admin' && sidebarContainer) {
            sidebarContainer.querySelectorAll('.only-admin').forEach(el => el.remove());
        }
        const sidebarUserName = document.getElementById("projectSidebarLabel");
        const sidebarUserRole = document.getElementById("cargoText");
        const sidebarUserRegister = document.getElementById("registerText");

        sidebarUserName.innerText = userCompleteData.name;
        sidebarUserRole.innerText = `Cargo: ${userCompleteData.role}`;
        sidebarUserRegister.innerText = `Matrícula: ${userCompleteData.register}`;
    }

    const sairBtn = document.querySelector('#sair');
    if (sairBtn) {
        sairBtn.addEventListener('click', () => {
            logOut();
        });
    }
}
