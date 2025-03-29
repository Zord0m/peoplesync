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
        })
        .catch((error) => console.error("Erro ao carregar a página: ", error));
}

function updateStylesheet(stylePath)
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
