export function init() {
    const employeeCreateForm = document.getElementById("createForm");
    const employeeModal = document.getElementById("employeeCreateModal");
    if (employeeCreateForm) {
        employeeCreateForm.addEventListener("submit", (event) => {
            event.preventDefault();
            sendData();
        });
    }

    async function sendData() {
        const formData = new FormData(employeeCreateForm);
        const entriesArray = Array.from(formData.entries());
        const postData = Object.fromEntries(formData.entries());

        postData.pcd = document.getElementById("pcdCheckbox").checked;

        try {
            const [year, month, day] = postData.birthDate.split("-");
            postData.birthDate = `${day}/${month}/${year}`;
            postData.isActive = true;
            try {
                entriesArray.forEach((entrie) => {
                    verifyCompletude(entrie);
                });
            } catch (validationError) {
                showToast(`Erro de validação: ${validationError.message}`, "error");
                return; 
            }

            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:4444/employees", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(postData),
            });
            const data = await response.json();
            if (!response.ok) {
                showToast(`Erro ao cadastrar funcionário: ${data.error || 'Erro desconhecido'}`, "error");
                return;
            }
            showToast("Funcionário cadastrado com sucesso!", "success");
            const modalInstance = bootstrap.Modal.getInstance(employeeModal);
            if (modalInstance) modalInstance.hide();
        } catch (error) {
            showToast(`Erro inesperado: ${error}`);
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
}