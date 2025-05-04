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
            const modalDOMElement = document.getElementById(`${property}EditInput`);
            const elementProperty = modalInfo.getAttribute(`data-${property}`);
            if (modalDOMElement && elementProperty) {
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

