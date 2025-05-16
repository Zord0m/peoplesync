export function init() {
    const projectsContainer = document.getElementById("projectsContainer");
    if (!projectsContainer) return;

    loadProjectsData();

    async function loadProjectsData() {
        try {
            await getProjectsList();
            initializeModals();
        } catch (error) {
            console.error('Failed to load employees data:', error);
            showErrorMessage();
        }
    }

    async function getProjectsList() {
        const token = localStorage.getItem("token");
        if (!token) throw new Error('No authentication token found');

        const response = await fetch(
            `http://localhost:4444/projects`,
            {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        if (!response.ok) throw new Error(response.status);

        let listOfProjects = await response.json();
        console.log(listOfProjects)
        renderProjectsCards(listOfProjects);
    }

    function renderProjectsCards(projects) {
        projectsContainer.innerHTML = '';
        const fragment = document.createDocumentFragment();

        projects.forEach(project => {
            const card = createProjectCard(project);
            fragment.appendChild(card);
        });

        projectsContainer.appendChild(fragment);
        setupCardInteractions();
    }

    function createProjectCard(project) {
        const cardBox = document.createElement("div");
        cardBox.className = 'col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2';

        const card = document.createElement("button");
        card.className = 'card projectData';
        card.dataset.bsToggle = "modal";
        card.dataset.bsTarget = "#projectDataInfoModal";

        console.log(project)

        Object.entries({
            id: project.id,
            nameproject: project.name_project,
            status: project.status,
            tag: project.tag,
            createdat: project.createdAt,
            description: project.description
        }).forEach(([key, value]) => {
            card.dataset[`emp${capitalize(key)}`] = value;
        });

        card.innerHTML =
            `<div class="card-body">
                <h5 class="card-title">${escapeHtml(project.name_project)}</h5>
                <p class="card-text">${escapeHtml(project.tag)}</p>
            </div>`;

        cardBox.appendChild(card);
        return cardBox;
    }

    function setupCardInteractions() {
        document.querySelectorAll(".projectData").forEach(button => {
            button.addEventListener("click", updateModalData);
        });
    }

    function updateModalData(event) {
        const button = event.currentTarget;
        const modalInfo = document.getElementById("projectDataInfoModal");
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
            const modalElement = document.getElementById('projectDataInfoModal');
            if (modalElement) {
                new bootstrap.Modal(modalElement);
            }
        }
    }

    function showErrorMessage() {
        projectsContainer.innerHTML =
        `<div class="col-12 alert alert-danger">
            Falha ao carregar dados dos projetos. Tente novamente mais tarde.
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

