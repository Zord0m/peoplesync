const routes = {
    "/": "./public/component/home/home.html",
    "/login": "./public/component/login/login.html",
    "/employee-register": "./public/component/employee-register/employee-register.html",
    "/dashboard-horario": "./public/component/dashboard-horario/dashboard-horario.html"
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
    let src = element.getAttribute("src");
    if (!src) return;

    // Forçar atualização para evitar cache
    const noCacheSrc = `${src}?v=${new Date().getTime()}`;

    try
    {
        const response = await fetch(noCacheSrc);
        const html = await response.text();
        element.outerHTML = html;

        // Depois de injetar o HTML, carregar o JS do componente
        await loadComponentScript(src);
        await loadComponentStyle(src);

        processNestedComponent(); // Carrega componentes aninhados, se houver
    }
    catch (error)
    {
        console.error("Erro:", error);
    }
}

async function loadComponentScript(componentPath)
{
    // Exemplo: public/component/sidebar/sidebar.html -> sidebar.js
    const basePath = componentPath.substring(0, componentPath.lastIndexOf("/"));
    const componentName = basePath.split("/").pop();
    const scriptPath = `${basePath}/${componentName}.js?v=${new Date().getTime()}`;

    // Criar e inserir o script
    const script = document.createElement("script");
    script.src = scriptPath;
    script.defer = true;
    document.body.appendChild(script);
}

async function loadComponentStyle(componentPath)
{
    // Exemplo: public/component/sidebar/sidebar.html -> sidebar.js
    const basePath = componentPath.substring(0, componentPath.lastIndexOf("/"));
    const componentName = basePath.split("/").pop();
    const stylePath = `./${basePath}/${componentName}.css?v=${new Date().getTime()}`;

    // Criar e inserir o script
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = stylePath;
    document.head.appendChild(link);
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
    script.src = `${scriptPath}?v=${new Date().getTime()}`;
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