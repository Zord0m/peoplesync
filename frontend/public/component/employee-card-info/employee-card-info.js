(function () {
    const modalInfo = document.getElementById("employeeDataInfoModal");
    const modalContent = document.getElementById("modalContent");
    changeModalContent(true);

    modalInfo.addEventListener("shown.bs.modal", () => {
        changeModalContent(true);
        generateModalData();
    });

    modalInfo.addEventListener("hidden.bs.modal", () => {
        changeModalContent(true);
    });

    function generateModalData() {
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
            // NOME DO FUNCIONÁRIO
            const modalDOMElement = document.getElementById(`${property.toLowerCase()}EditInput`);
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
        })
        changeModalContent(false);
    }

    function changeModalContent(contentLoading) {
        modalContent.style.visibility = contentLoading
            ? "hidden"
            : "visible";
    }
})();

