export function init() {
  const createProjectForm = document.getElementById("createProjectForm");
  const projectModal = document.getElementById("projectCreateModal");
  if (createProjectForm) {
    createProjectForm.addEventListener("submit", (event) => {
      event.preventDefault();
      sendProjectCreationData();
    });
  }
  async function sendProjectCreationData() {
    const formData = new FormData(createProjectForm);
    const entriesArray = Array.from(formData.entries());
    const postData = Object.fromEntries(entriesArray);

    postData.status = "active";

    try {
      try {
        entriesArray.forEach((entry) => {
          validateProjectField(entry);
        });
      } catch (validationError) {
        showToast(`Erro de validação: ${validationError.message}`, "error");
        return;
      }

      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:4444/projects", {
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
        showToast(`Erro ao cadastrar projeto: ${data.message || "Erro desconhecido"}`, "error");
        return;
      }
      showToast("Projeto cadastrado com sucesso!", "success");
      const modalInstance = bootstrap.Modal.getInstance(projectModal);
      if(modalInstance) modalInstance.hide();

    } catch (error) {
      showToast(`Erro inesperado: ${error}`, "error");
    }
  }

  function validateProjectField([fieldName, fieldValue]) {
    if (!fieldValue || fieldValue.trim().length === 0) {
      throw new Error(`O campo "${getFieldLabel(fieldName)}" é obrigatório.`);
    }

    const trimmedValue = fieldValue.trim();

    if (fieldName === "name_project" && trimmedValue.length > 80) {
      throw new Error('O nome do projeto não pode exceder 80 caracteres.');
    }

    if (fieldName === "tag" && trimmedValue.length > 8) {
      throw new Error('A tag do projeto não pode exceder 8 caracteres.');
    }
  }

  function getFieldLabel(fieldName) {
    switch (fieldName) {
      case "name_project": return "Nome do Projeto";
      case "tag": return "Tag";
      case "description": return "Descrição";
      default: return fieldName;
    }
  }
}