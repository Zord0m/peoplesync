export function init() {
    const modalInfo = document.getElementById("employeeDataInfoModal");
    const modalContent = document.getElementById("modalContent");
    const buttonsContainer = document.getElementById("buttonsContainer");

    const changeEditableButton = generateEditableButton();
    const submitButton = generateSubmitButton();

    changeModalContent(true);

    modalInfo.addEventListener("shown.bs.modal", () => {
        changeModalContent(true);
        generateModalData();
    });

    modalInfo.addEventListener("hidden.bs.modal", () => {
        changeModalContent(true);
    });

    changeEditableButton.addEventListener("click", () => {
        const formValues = modalContent.querySelectorAll("input, select");

        formValues.forEach((input) => {
            input.disabled = false;
        });
        buttonsContainer.appendChild(submitButton);
        changeEditableButton.remove();
    });

    submitButton.addEventListener("click", async (event) => {
        event.preventDefault();
        // Form habilitado
        const employeeInfoForm = document.getElementById("employeeInfoForm");
        if (!employeeInfoForm) throw new Error("Formulário não encontrado");

        await updateUserData(employeeInfoForm);

    });

    async function updateUserData(employeeInfoForm) {
        const formData = new FormData(employeeInfoForm);
        const entriesArray = Array.from(formData.entries());
        const updateData = Object.fromEntries(formData.entries());

        updateData.pcd = document.getElementById("pcdUpdateInput").checked;

        const [year, month, day] = updateData.birthDate.split("-");
        updateData.birthDate = `${day}/${month}/${year}`;

        updateData.isActive = true;
        console.log(updateData);

        entriesArray.forEach((entrie) => {
            verifyCompletude(entrie);
        });

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:4444/employees/${updateData.register}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(updateData),
            });
            console.log(await response.json());
            submitButton.remove();
            buttonsContainer.appendChild(changeEditableButton);
        } catch (error) {
            console.error(error);
        }
    }

    function verifyCompletude(entrieValue) {
        const fieldName = entrieValue[0];
        const fieldValue = entrieValue[1];
        if (fieldValue.length == 0) {
            throw new Error(`O campo ${fieldName} não pode estar vazio`);
        }

        // VERIFICAÇÃO DO COMPRIMENTO MÁXIMO DE ENTRADA
        const maxLengthFields = ["role", "name", "email", "register"];
        if (maxLengthFields.includes(fieldName) && fieldValue.length > 100) {
            throw new Error(
                `O campo ${fieldName} não pode conter mais de 100 caracteres.`
            );
        }

        // VERIFICAÇÃO DO TIPO DE CONTRATO
        const contractTypes = ["clt", "pj", "estagio"];
        if (fieldName == "contractType" && !contractTypes.includes(fieldValue)) {
            throw new Error(
                `O campo ${fieldName} precisa ser do tipo ${contractTypes.join(" ou ")}`
            );
        }

        // VERIFICAÇÃO DOS TIPOS DE USUÁRIO
        const userTypes = ["comum", "admin"];
        if (fieldName == "type" && !userTypes.includes(fieldValue)) {
            throw new Error(
                `O campo ${fieldName} precisa ser do tipo ${contractTypes.join(" ou ")}`
            );
        }
    }

    function generateEditableButton() {
        const button = document.createElement("button");
        button.innerText = "Editar Dados";
        button.className = "btn btn-info";
        button.type = "button";
    
        return button;
    }

    function generateSubmitButton() {
        const button = document.createElement("button");
        button.innerText = "Salvar Dados";
        button.className = "btn btn-primary";
        button.type = "submit";

        return button;
    }

    function generateModalData() {
        buttonsContainer.appendChild(changeEditableButton);

        // Número de propriedades que serão passadas para o modal
        const propertiesNamestoPass = [
            "name",
            "email",
            "birthDate",
            "gender",
            "isActive",
            "pcd",
            "register",
            "role",
            "type",
            "createdAt",
            "contractType",
        ];

        propertiesNamestoPass.forEach((property) => {
            const modalDOMElement = document.getElementById(`${property.toLowerCase()}UpdateInput`);
            const actualAttribute = `data-${property.toLowerCase()}`;
            let elementProperty = modalInfo.getAttribute(actualAttribute);
            
            if (modalDOMElement && elementProperty) {
                if (actualAttribute == 'data-birthdate') {
                    const [day, month, year] = elementProperty.split('/');
                    elementProperty = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                }
                if (actualAttribute == 'data-pcd') {
                    modalDOMElement.checked = elementProperty == 'true';
                }
                modalDOMElement.disabled = true;
                modalDOMElement.readonly = true;
                modalDOMElement.value = elementProperty;
            }
        });
        changeModalContent(false);
    }

    function changeModalContent(contentLoading) {
        modalContent.style.visibility = contentLoading
            ? "hidden"
            : "visible";
    }
}
