export function init() {
    const clockinCreateForm = document.getElementById("clockInForm");
    const clockinModal = document.getElementById("clockinRegisterModal");

    clockinModal.addEventListener("shown.bs.modal", () => {
        if (clockinCreateForm) {
            setInitialDateInput();
            setActualDatetimeInput();
            clockinCreateForm.addEventListener("submit", (event) => {
                event.preventDefault();
                sendData();
            });
        }
    });

    async function sendData() {
        const formData = new FormData(clockinCreateForm);
        const entriesArray = Array.from(formData.entries());
        const postData = Object.fromEntries(entriesArray);

        try {
            try {
                entriesArray.forEach((entry) => {
                    verifyCompletude(entry);
                });
            } catch (validationError) {
                showToast(`Erro de validação: ${validationError.message}`, 'error');
                return;
            }

            const [year, month, day] = postData.date.split("-");
            postData.date = `${day}/${month}/${year}`;

            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:4444/time-entry", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(postData),
            });

            const data = await response.json();

            if (!response.ok) {
                console.error("Erro da API:", data);
                showToast(`Erro ao registrar ponto: ${data.error || 'Erro desconhecido'}`, "error");
                return;
            }
            showToast("Ponto registrado com sucesso!", "success");
            const modalInstance = bootstrap.Modal.getInstance(clockinModal);
            if (modalInstance) modalInstance.hide();

        } catch (error) {
            console.error("Erro inesperado:", error);
            showToast(`Erro inesperado: ${error}`);
        }
    }

    function verifyCompletude([fieldName, fieldValue]) {
        const trimmed = fieldValue.trim();
        if (!trimmed) {
            throw new Error(`O campo "${getFieldLabel(fieldName)}" é obrigatório.`);
        }

        if (fieldName === "projectTag" && trimmed.length > 8) {
            throw new Error('A tag do projeto deve ter no máximo 8 caracteres.');
        }

        if (fieldName === "description" && trimmed.length > 300) {
            throw new Error('A descrição deve ter no máximo 300 caracteres.');
        }
    }

    function getFieldLabel(fieldName) {
        switch (fieldName) {
            case "projectTag": return "Tag do Projeto";
            case "date": return "Data";
            case "start": return "Horário de Entrada";
            case "end": return "Horário de Saída";
            case "description": return "Descrição";
            default: return fieldName;
        }
    }

    function setInitialDateInput() {
        const clockinDateInput = document.getElementById("clockinDateInput");
        const actualDate = new Date();
        const actualDateFormated = actualDate.toISOString().split("T")[0];
        clockinDateInput.value = actualDateFormated;
    }

    function setActualDatetimeInput() {
        const clockinDatetimeInput = document.getElementById("endTimeInput");
        const actualDatetime = new Date();
        const hourFormated = actualDatetime.getHours().toString().padStart(2, "0");
        const minuteFormated = actualDatetime.getMinutes().toString().padStart(2, "0");
        clockinDatetimeInput.value = `${hourFormated}:${minuteFormated}`;
    }
}
