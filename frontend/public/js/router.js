// DICIONÁRIO DE ROTAS COM A URL E NOME DO COMPONENTE
const routes = {
    '/': 'home',
    '/login': 'login',
    '/register': 'employee-register',
    '/horarios': 'dashboard-horario',
    '/horarios-funcionario': 'horarios-employee',
    '/employees': 'employees-page',
    '/projects': 'projects-page'
};

// RECURSOS JÁ CARREGADOS
const loadedAssets = {
    css: new Set(),
    modules: {}
};

const version = Date.now(); // cache buster

// CARREGA O HTML, JS E CSS DO COMPONENTE
async function loadComponent(name, targetElement = null) {
    const componentPath = `/public/component/${name}/${name}`;

    // Carrega HTML
    const html = await fetch(`${componentPath}.html?v=${version}`).then(res => res.text());
    const container = targetElement || document.getElementById('app');
    container.innerHTML = html;

    // Carrega e insere CSS (se ainda não carregado)
    if (!loadedAssets.css.has(name)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = `${componentPath}.css?v=${version}`;
        document.head.appendChild(link);
        loadedAssets.css.add(name);
    }

    // Importação do arquivo JS como um módulo, para a reexecução
    const module = await import(`${componentPath}.js?v=${version}`);
    loadedAssets.modules[name] = module;
    if (module.init && typeof module.init === 'function') {
        module.init(); // Executa função init do módulo
    }

    // Busca e carrega componentes aninhados
    const nested = container.querySelectorAll('[data-component]');
    for (const element of nested) {
        const childName = element.getAttribute('data-component');
        await loadComponent(childName, element);
    }
}

// Função que trata a navegação
function navigateTo(url) {
    history.pushState(null, null, url);
    handleRoute();
}

// Gerenciamento do componente de acordo com a rota atual
function handleRoute() {
    const path = window.location.pathname;
    const componentName = routes[path];

    if (componentName) {
        loadComponent(componentName);
    } else {
        document.getElementById('app').innerHTML = `<h2>404 - Página não encontrada</h2>`;
    }
}

// Escuta cliques em links com data-link
document.addEventListener('click', (event) => {
    if (event.target.matches('[data-link]')) {
        event.preventDefault();
        navigateTo(event.target.getAttribute('href'));
    }
});

// Atualiza o conteúdo ao usar botões de navegador (voltar/avançar)
window.addEventListener('popstate', handleRoute);

// Inicialização da rota atual
handleRoute();
