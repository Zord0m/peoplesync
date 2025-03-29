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
            processNestedComponent();
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

async function loadComponent(element)
{
    const src = element.getAttribute("src");
    if (!src) return;
    try
    {
        const response = await fetch(src);
        const html = await response.text();
        element.outerHTML = html;
        processNestedComponent();
    }
    catch (error)
    {
        console.error("Erro:", error);
    }
}

function processNestedComponent()
{
    document.querySelectorAll("component").forEach(loadComponent);
}

async function updateStylesheet(stylePath)
{
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
