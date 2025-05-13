(function () {
    const clockinCreateForm = document.getElementById("clockInForm");
    if (clockinCreateForm) {
        setInitialDateInput();
        clockinCreateForm.addEventListener("submit", (event) => {
            event.preventDefault();
            sendData();
        });
    }

    async function sendData() {
        const formData = new FormData(clockinCreateForm);
        const entriesArray = Array.from(formData.entries());
        const postData = Object.fromEntries(formData.entries());

        const [year, month, day] = postData.date.split("-");
        postData.date = `${day}/${month}/${year}`;

        entriesArray.forEach((entrie) => {
            verifyCompletude(entrie);
        });

        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:4444/time-entry", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(postData),
            });
            console.log(await response.json());
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
        const maxLengthFields = ["description"];
        if (maxLengthFields.includes(fieldName) && fieldValue.length > 100) {
            throw new Error(
                `O campo ${fieldName} não pode conter mais de 100 caracteres.`
            );
        }
    }

    function setInitialDateInput() {
        const clockinDateInput = document.getElementById("clockinDateInput");
        const actualDate = new Date();
        const actualDateFormated = actualDate.toISOString().split('T')[0];
        console.log(actualDateFormated)
        clockinDateInput.value = actualDateFormated;
    }
})();
