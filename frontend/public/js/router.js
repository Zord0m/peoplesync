const routes = {
    "": "./public/component/home/home.html",
    "#login": "./public/component/login/login.html",
    "#register": "./public/component/register/register.html",
};

function loadPage(url) {
    const path = routes[url] || routes[""];
    fetch(path)
        .then((response) => response.text())
        .then((html) => {
            const app = document.getElementById("app");
            app.innerHTML = html;
            const newTitle = document.querySelector("title");
            if (newTitle)
            {
                document.title = newTitle.innerText;
            }
            const component = path.split("/")[3];
            updateStylesheet(`./public/component/${component}/${component}.css`);
            updateScript(`./public/component/${component}/${component}.js`);
        })
        .catch((error) => console.error("Erro ao carregar a página: ", error));
}

async function updateStylesheet(stylePath)
{
    if (!await fileExists(stylePath))
    {
        throw new Error(
            `Erro: O script ${stylePath} é obrigatório e não foi encontrado.`
        );
    }
    let styleLink = document.getElementById("dynamic-style");
    if (!styleLink)
    {
        styleLink = document.createElement("link");
        styleLink.rel = "stylesheet";
        styleLink.id = "dynamic-style";
        document.head.appendChild(styleLink);
    }
    styleLink.href = stylePath;
}

async function updateScript(scriptPath)
{
    if (!await fileExists(scriptPath))
    {
        throw new Error(
            `Erro: O script ${scriptPath} é obrigatório e não foi encontrado.`
        );
    }
    let existingScript = document.getElementById("dynamic-script");
    if (existingScript) {
        existingScript.remove(); // Remove o script anterior para evitar duplicação
    }
    let script = document.createElement("script");
    script.src = scriptPath;
    script.id = "dynamic-script";
    script.defer = true;
    document.body.appendChild(script);
}

async function fileExists(url)
{
    try {
        const response = await fetch(url, { method: "GET", cache:"no-store" });
        return response.ok;
    } catch {
        return false;
    }
}

function handleRoutingChange() {
    const url = window.location.hash || "";
    loadPage(url);
}

function navigateTo(url) {
    window.location.hash = url;
}

// Evento para detectar mudança na URL
window.addEventListener("hashchange", handleRoutingChange);
document.addEventListener("DOMContentLoaded", handleRoutingChange);
