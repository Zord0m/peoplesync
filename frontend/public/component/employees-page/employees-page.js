// JS para employees-page 
(function () {
    let listOfEmployees = [];
    document.getElementById("employeesContainer").innerHTML = '';
    async function getEmployeesList(employeesPerPage = 50, page = 1) {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`http://localhost:4444/employees?limit=${employeesPerPage}&offset=${page}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error("Erro na requisição");
            }
            listOfEmployees = await response.json();
            console.log(listOfEmployees);
            
            generateEmployeesCards();

            const buttonsOpenModal = document.querySelectorAll(".employeeData");
            buttonsOpenModal.forEach((button) => {
                button.addEventListener("click", () => {
                    const modalInfo = document.getElementById("employeeDataInfoModal");
                    // INSERÇÃO DOS DADOS DENTRO DO MODAL PÓS RENDERIZAÇÃO
                    modalInfo.setAttribute("data-name", button.getAttribute("data-emp-name"));
                    modalInfo.setAttribute("data-email", button.getAttribute("data-emp-email"));
                    modalInfo.setAttribute("data-birthdate", button.getAttribute("data-emp-birthdate"));
                    modalInfo.setAttribute("data-gender", button.getAttribute("data-emp-gender"));
                    modalInfo.setAttribute("data-isactive", button.getAttribute("data-emp-isactive"));
                    modalInfo.setAttribute("data-pcd", button.getAttribute("data-emp-pcd"));
                    modalInfo.setAttribute("data-register", button.getAttribute("data-emp-register"));
                    modalInfo.setAttribute("data-role", button.getAttribute("data-emp-role"));
                    modalInfo.setAttribute("data-type", button.getAttribute("data-emp-type"));
                    modalInfo.setAttribute("data-createdat", button.getAttribute("data-emp-createdat"));
                    modalInfo.setAttribute("data-contracttype", button.getAttribute("data-emp-contracttype"));
                });
            });
        }
        catch (error) {
            console.error(error);
        }
    }

    function generateEmployeesCards() {
        const employeesContainer = document.getElementById("employeesContainer");
        listOfEmployees.forEach((employee) => {
            // Coluna com o Card
            const cardBox = document.createElement("div");
            cardBox.classList.add('col-12', 'col-sm-6', 'col-md-4', 'col-lg-3', 'col-xl-2');

            // Card
            const componentCard = document.createElement("button");
            componentCard.classList.add('card', 'employeeData');
            componentCard.setAttribute("data-bs-toggle", "modal");
            componentCard.setAttribute("data-bs-target", "#employeeDataInfoModal");
            // DEFINIÇÃO DOS DADOS DO FUNCIONÁRIO EM CADA CARD
            componentCard.setAttribute("data-emp-name", employee.name);
            componentCard.setAttribute("data-emp-email", employee.email);
            componentCard.setAttribute("data-emp-birthdate", employee.birthDate);
            componentCard.setAttribute("data-emp-gender", employee.gender);
            componentCard.setAttribute("data-emp-isactive", employee.isActive);
            componentCard.setAttribute("data-emp-pcd", employee.pcd);
            componentCard.setAttribute("data-emp-register", employee.register);
            componentCard.setAttribute("data-emp-role", employee.role);
            componentCard.setAttribute("data-emp-type", employee.type);
            componentCard.setAttribute("data-emp-createdat", employee.createdAt);
            componentCard.setAttribute("data-emp-contracttype", employee.contractType);

            //Card Header
            const cardHeader = document.createElement("div");
            cardHeader.classList.add("card-header");

            // Card Icon
            const cardIcon = document.createElement("i");
            cardIcon.classList.add("card-image", "bi", "bi-person");

            // Card Body
            const cardBody = document.createElement("div");
            cardBody.classList.add("card-body");

            // Card Title
            const cardTitle = document.createElement("h5");
            cardTitle.classList.add('card-title');
            cardTitle.innerText = employee.name;

            // Card Text
            const cardContent = document.createElement("p");
            cardContent.classList.add('card-text');
            cardContent.innerText = employee.role;

            // Adição de um elemento em outro
            cardHeader.appendChild(cardIcon);

            cardBody.appendChild(cardTitle);
            cardBody.appendChild(cardContent);
            
            componentCard.appendChild(cardHeader);
            componentCard.appendChild(cardBody);

            cardBox.appendChild(componentCard);
            employeesContainer.appendChild(cardBox);
        });
    }
    getEmployeesList();
})();