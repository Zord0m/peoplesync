// JS para employee-create 
console.log("Página de criação de funcionário")

const form = document.getElementById("createForm");
form.addEventListener("submit", (event) => {
    event.preventDefault();
    sendData();
})

/**
 * Função para registro de funcionário
 */
async function sendData()
{
    const formData = new FormData(form);
    const entriesArray = Array.from(formData.entries());
    const postData = Object.fromEntries(formData.entries());

    postData.pcd = document.getElementById("pcdCheckbox").checked;

    const [year, month, day] = postData.birthDate.split("-");
    postData.birthDate = `${day}/${month}/${year}`;


    console.log(postData)

    entriesArray.forEach((entrie) => {
        verifyCompletude(entrie);
    });

    try
    {
        const response = await fetch("http://localhost:4444/employees", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(postData)
        });
        console.log(await response.json())
    }
    catch (error)
    {
        console.error(error)
    }
}

/**
 * Função para validar a entrada de dados além das validações no HTML
 * @param {string} entrieValue 
 */
function verifyCompletude(entrieValue)
{
    const fieldName = entrieValue[0];
    const fieldValue = entrieValue[1];
    if (fieldValue.length == 0)
    {
        throw new Error(`O campo ${fieldName} não pode estar vazio`)
    }

    // VERIFICAÇÃO DO COMPRIMENTO MÁXIMO DE ENTRADA
    const maxLengthFields = ['role', 'name', 'email', 'register'];
    if (
        maxLengthFields.includes(fieldName) &&
        fieldValue.length > 100)
    {
        throw new Error(`O campo ${fieldName} não pode conter mais de 100 caracteres.`)
    }

    // VERIFICAÇÃO DO TIPO DE CONTRATO
    const contractTypes = ['clt', 'pj', 'estagiário'];
    if (fieldName == "contractType" && !contractTypes.includes(fieldValue))
    {
        throw new Error(`O campo ${fieldName} precisa ser do tipo ${contractTypes.join(' ou ')}`);
    }
    
    // VERIFICAÇÃO DOS TIPOS DE USUÁRIO
    const userTypes = ['comum', 'admin'];
    if (fieldName == "type" && !userTypes.includes(fieldValue))
    {
        throw new Error(`O campo ${fieldName} precisa ser do tipo ${contractTypes.join(' ou ')}`);
    }
}