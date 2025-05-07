export function init()
{
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
        console.log(userData);
        const register = userData.register;
        const token = localStorage.getItem('token');
        try {
            const userResponse = await fetch(`http://localhost:4444/employees/${register}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!userResponse.ok) throw new Error('Falha ao buscar dados do funcionário');
            const userCompleteData = await userResponse.json();
            localStorage.setItem('userCompleteInfo', JSON.stringify(userCompleteData));

            generateSidebarContent(userCompleteData);
        } catch (err) {
            console.error('Erro ao inicializar sidebar:', err);
        }
    };

    function generateSidebarContent(userCompleteData) {
        const sidebarContainer = document.getElementById("projectSidebar");
        if (userCompleteData.type !== 'admin' && sidebarContainer)
        {
            sidebarContainer.querySelectorAll('.only-admin').forEach(el => el.remove());
        }
        const sidebarUserName = document.getElementById("projectSidebarLabel");
        const sidebarUserRole = document.getElementById("cargoText");
        const sidebarUserRegister = document.getElementById("registerText");

        sidebarUserName.innerText = userCompleteData.name;
        sidebarUserRole.innerText = `Cargo: ${userCompleteData.role}`;
        sidebarUserRegister.innerText = `Matrícula: ${userCompleteData.register}`;

        const sairBtn = sidebarContainer.querySelector('#sair');
        if (sairBtn) {
            sairBtn.addEventListener('click', () => {
                localStorage.removeItem('token');
                localStorage.removeItem('userInfo');
                localStorage.removeItem('userCompleteInfo');
                window.navigateTo('/login');
            });
        }
    }
}
