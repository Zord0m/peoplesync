(function () {
  // JS para project-create
  const createProjectForm = document.getElementById("createProjectForm");
  if (createProjectForm) {
    createProjectForm.addEventListener("submit", (event) => {
      event.preventDefault();
      sendProjectCreationData();
    });
  }

  async function sendProjectCreationData() {
    const formData = new FormData(createProjectForm);
    const entriesArray = Array.from(formData.entries());
    const postData = Object.fromEntries(formData.entries());

    console.log(postData);

    entriesArray.forEach((entrie) => {
      // verifyCompletude(entrie);
    });

    try {
      const token = localStorage.getItem("token");
      console.log(postData);
      postData.status = "active";

      const response = await fetch("http://localhost:4444/projects", {
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
})();
