export function init() {
    const employeesContainer = document.querySelector("#employeesContainer");
    if (!employeesContainer) return;

    loadEmployeesData();

    async function loadEmployeesData() {
        try {
            await getEmployeesList();
            initializeModals();
        } catch (error) {
            console.error('Failed to load employees data:', error);
            showErrorMessage();
        }
    }

    async function getEmployeesList(employeesPerPage = 50, page = 1) {
        const token = localStorage.getItem("token");
        if (!token) throw new Error('No authentication token found');

        const response = await fetch(
            `http://localhost:4444/employees?limit=${employeesPerPage}&offset=${(page - 1) * employeesPerPage}`,
            {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        if (!response.ok) throw new Error(response.status);

        let listOfEmployees = await response.json();
        listOfEmployees = listOfEmployees.filter(emp => emp.id !== 1); // remove admin master
        renderEmployeesCards(listOfEmployees);
    }

    function renderEmployeesCards(employees) {
        employeesContainer.innerHTML = '';
        const fragment = document.createDocumentFragment();

        employees.forEach(employee => {
            const card = createEmployeeCard(employee);
            fragment.appendChild(card);
        });

        employeesContainer.appendChild(fragment);
        setupCardInteractions();
    }

    function createEmployeeCard(employee) {
        const cardBox = document.createElement("div");
        cardBox.className = 'col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2';

        const card = document.createElement("button");
        card.className = 'card employeeData';
        card.dataset.bsToggle = "modal";
        card.dataset.bsTarget = "#employeeDataInfoModal";

        Object.entries({
            name: employee.name,
            email: employee.email,
            birthdate: employee.birthDate,
            gender: employee.gender,
            isactive: employee.isActive,
            pcd: employee.pcd,
            register: employee.register,
            role: employee.role,
            type: employee.type,
            createdat: employee.createdAt,
            contracttype: employee.contractType
        }).forEach(([key, value]) => {
            card.dataset[`emp${capitalize(key)}`] = value;
        });

        card.innerHTML =
            `<div class="card-header">
                <i class="card-image bi bi-person"></i>
            </div>
            <div class="card-body">
                <h5 class="card-title">${escapeHtml(employee.name)}</h5>
                <p class="card-text">${escapeHtml(employee.role)}</p>
            </div>`;

        cardBox.appendChild(card);
        return cardBox;
    }

    function setupCardInteractions() {
        document.querySelectorAll(".employeeData").forEach(button => {
            button.addEventListener("click", updateModalData);
        });
    }

    function updateModalData(event) {
        const button = event.currentTarget;
        const modalInfo = document.getElementById("employeeDataInfoModal");
        if (!modalInfo) return;

        Object.keys(button.dataset).forEach(key => {
            if (key.startsWith('emp')) {
                const modalKey = key.replace('emp', '').toLowerCase();
                modalInfo.dataset[modalKey] = button.dataset[key];
            }
        });
    }

    function initializeModals() {
        if (typeof bootstrap !== 'undefined') {
            const modalElement = document.getElementById('employeeDataInfoModal');
            if (modalElement) {
                new bootstrap.Modal(modalElement);
            }
        }
    }

    function showErrorMessage() {
        employeesContainer.innerHTML =
        `<div class="col-12 alert alert-danger">
            Falha ao carregar dados dos funcionários. Tente novamente mais tarde.
        </div>`;
    }

    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}
