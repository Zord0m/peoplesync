export function init() {
    const modalInfo = document.getElementById("projectDataInfoModal");
    const modalContent = document.getElementById("modalContent");
    // const buttonsContainer = document.getElementById("buttonsContainer");

    // const changeEditableButton = generateEditableButton();
    // const submitButton = generateSubmitButton();

    changeModalContent(true);

    modalInfo.addEventListener("shown.bs.modal", () => {
        changeModalContent(true);
        generateModalData();
    });

    modalInfo.addEventListener("hidden.bs.modal", () => {
        changeModalContent(true);
    });

    // changeEditableButton.addEventListener("click", () => {
    //     const formValues = modalContent.querySelectorAll("input, select");

    //     formValues.forEach((input) => {
    //         input.disabled = false;
    //     });
    //     buttonsContainer.appendChild(submitButton);
    //     changeEditableButton.remove();
    // });

    // submitButton.addEventListener("click", async (event) => {
    //     event.preventDefault();
    //     const form = document.getElementById("projectInfoForm");
    //     if (!form) throw new Error("Formulário não encontrado");
    //     await updateProjectData(form);
    // });

    // async function updateProjectData(form) {
    //     const formData = new FormData(form);
    //     const entriesArray = Array.from(formData.entries());
    //     const updateData = Object.fromEntries(formData.entries());

    //     updateData.isActive = document.getElementById("isactiveProjectData").checked;

    //     const [year, month, day] = updateData.createdAt.split("-");
    //     updateData.createdAt = `${day}/${month}/${year}`;

    //     console.log(updateData);

    //     entriesArray.forEach((entry) => {
    //         verifyCompletude(entry);
    //     });

    //     try {
    //         const token = localStorage.getItem("token");
    //         const response = await fetch(`http://localhost:4444/projects/${updateData.id}`, {
    //             method: "PUT",
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 "Authorization": `Bearer ${token}`,
    //             },
    //             body: JSON.stringify(updateData),
    //         });
    //         console.log(await response.json());
    //         submitButton.remove();
    //         buttonsContainer.appendChild(changeEditableButton);
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }

    // function verifyCompletude([fieldName, fieldValue]) {
    //     if (!fieldValue || fieldValue.trim().length === 0) {
    //         throw new Error(`O campo ${fieldName} não pode estar vazio.`);
    //     }

    //     const maxLengthFields = ["name_project", "description", "tag"];
    //     if (maxLengthFields.includes(fieldName) && fieldValue.length > 100) {
    //         throw new Error(`O campo ${fieldName} não pode conter mais de 100 caracteres.`);
    //     }

    //     const statusOptions = ["ativo", "inativo", "em andamento"];
    //     if (fieldName === "status" && !statusOptions.includes(fieldValue)) {
    //         throw new Error(`O status precisa ser ${statusOptions.join(", ")}`);
    //     }
    // }

    // function generateEditableButton() {
    //     const button = document.createElement("button");
    //     button.innerText = "Editar Dados";
    //     button.className = "btn btn-info";
    //     button.type = "button";
    //     return button;
    // }

    // function generateSubmitButton() {
    //     const button = document.createElement("button");
    //     button.innerText = "Salvar Dados";
    //     button.className = "btn btn-primary";
    //     button.type = "submit";
    //     return button;
    // }

    function generateModalData() {
        // buttonsContainer.appendChild(changeEditableButton);

        const propertiesNamesToPass = [
            "nameproject",
            "status",
            "tag",
            "createdat",
            "status",
            "description",
        ];

        propertiesNamesToPass.forEach((property) => {
            const modalDOMElement = document.getElementById(`${property.toLowerCase()}ProjectData`);
            const actualAttribute = `data-${property.toLowerCase()}`;
            let elementProperty = modalInfo.getAttribute(actualAttribute);

            if (modalDOMElement && elementProperty) {
                if (property === "createdat") {
                    const createdDate = new Date(elementProperty);

                    const day = createdDate.getDate().toString();
                    const month = (createdDate.getMonth() + 1).toString(); 
                    const year = createdDate.getFullYear().toString();
                    elementProperty = `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`;
                }
                if (property === "status") {
                    modalDOMElement.parentElement.className = elementProperty === "active"
                        ? 'badge text-bg-success'
                        : 'badge text-bg-danger';
                    modalDOMElement.style.textTransform = "capitalize";
                }
                // else {
                //     modalDOMElement.value = elementProperty;
                // }
                // modalDOMElement.disabled = true;
                // modalDOMElement.readOnly = true;
                modalDOMElement.innerText = elementProperty;
            }
        });

        changeModalContent(false);
    }

    function changeModalContent(contentLoading) {
        modalContent.style.visibility = contentLoading ? "hidden" : "visible";
    }
}
