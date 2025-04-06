// JS para employee-create 
console.log("Página de criação de funcionário")

const form = document.getElementById("createForm");
form.addEventListener("submit", (event) => {
    event.preventDefault();
    sendData();
})

async function sendData()
{
    const formData = new FormData(form);
    const values = formData.entries();
    const postData = Object.fromEntries(formData.entries());

    values.forEach((entrie) => {
        verifyCompletude(entrie);
    });
    console.log(postData)

    try 
    {
        // const testData = {
        //   name: "Rafael Santos",
        //   email: "teste@valido.com", // Email que você sabe que funciona no Swagger
        //   contractType: "clt",
        //   role: "Descarregador",
        //   type: "comum",
        //   register: "020202",
        // };
        
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