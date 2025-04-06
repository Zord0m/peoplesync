const routes = {
    "/": "./public/component/login/login.html",
    "/employee-register": "./public/component/employee-register/employee-register.html",
    "/employee-create": "./public/component/employee-create/employee-create.html",
    "/home": "./public/component/home/home.html",
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
    styleLink.href = `${stylePath}?v=${new Date().getTime()}`;
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

function navigateTo(url) {
    // history.pushState({}, "", url);
    window.location.hash = url;
    loadPage(url);
}

// Captura mudanças no histórico (botões de voltar/avançar)
window.addEventListener("popstate", () => {
    const pathName = window.location.pathname;
    loadPage(pathName);
});

// Intercepta cliques em links para evitar recarregamento da página
document.addEventListener("click", (event) => {
    const target = event.target.closest("a");
    if (target && target.href.startsWith(window.location.origin)) {
        event.preventDefault();
        navigateTo(new URL(target.href).pathname);
    }
});

// Carrega a página inicial
document.addEventListener("DOMContentLoaded", () => {
    // loadPage(window.location.pathname);
    const path = window.location.hash.replace("#", "") || "/";
    loadPage(path);
});