export function init() {
    const weekContainer = document.getElementById("periodSearch");
    if (!weekContainer) return;

    const clockinContainerTemplate = document.getElementById("clockinsContainer");

    let referenceWeek = 0;
    let firstDateSearch = {};
    let lastDateSearch = {};

    weekContainer.style.visibility = "hidden";
    firstTimeLoadPage();

    function firstTimeLoadPage() {
        generateLastDateView();
        weekContainer.style.visibility = "visible";
        getUserClockin();
    }

    document.getElementById("backWeek").addEventListener("click", () => {
        referenceWeek -= 1;
        generateLastDateView();
        getUserClockin();
    });

    document.getElementById("nextWeek").addEventListener("click", () => {
        referenceWeek += 1;
        generateLastDateView();
        getUserClockin();
    });

    function generateLastDateView() {
        const today = new Date();
        today.setDate(today.getDate() + (referenceWeek * 7));

        // Novo intervalo: -3 dias a +3 dias
        const firstDate = new Date(today);
        firstDate.setDate(today.getDate() - 3);

        const lastDate = new Date(today);
        lastDate.setDate(today.getDate() + 3);

        // Formatar datas para exibição e busca
        const format = (date) => ({
            day: date.getDate().toString().padStart(2, "0"),
            month: (date.getMonth() + 1).toString().padStart(2, "0"),
            year: date.getFullYear().toString()
        });

        firstDateSearch = format(firstDate);
        lastDateSearch = format(lastDate);

        weekContainer.querySelector("#backward").innerText =
            `${firstDateSearch.day}/${firstDateSearch.month}/${firstDateSearch.year}`;
        weekContainer.querySelector("#current").innerText =
            `${lastDateSearch.day}/${lastDateSearch.month}/${lastDateSearch.year}`;

        renderAddClockinButton();
    }

    function renderAddClockinButton() {
        const existingBtn = weekContainer.querySelector(".addClockinBtn");
        if (existingBtn) return;

        const addNewClockinButtonBox = document.createElement("div");
        addNewClockinButtonBox.className = 'col-auto';

        addNewClockinButtonBox.innerHTML = `
            <button class="btn btn-info addClockinBtn" data-bs-toggle="modal" data-bs-target="#clockinRegisterModal">
                Adicionar Ponto
            </button>`;

        weekContainer.appendChild(addNewClockinButtonBox);
    }

    async function getUserClockin() {
        const start = `${firstDateSearch.day}%2F${firstDateSearch.month}%2F${firstDateSearch.year}`;
        const end = `${lastDateSearch.day}%2F${lastDateSearch.month}%2F${lastDateSearch.year}`;
        const message = document.getElementById("message");

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:4444/time-entry?start=${start}&end=${end}`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (response.status == 401) await logOut();
            if (!response.ok) throw new Error("Erro ao buscar horários");

            const data = await response.json();

            if (data.length === 0) {
                message.innerText = "Nenhum horário encontrado.";
                clockinContainerTemplate.innerHTML = '';
            } else {
                message.innerText = "";
                renderClockins(data);
            }
        } catch (err) {
            console.error(err);
            message.innerText = "Erro ao carregar horários.";
        }
    }

    function renderClockins(clockinList) {
        clockinContainerTemplate.innerHTML = '';
        const days = groupClockinPerDay(clockinList);
        const fragment = document.createDocumentFragment();

        const todayFormatted = new Date().toISOString().split("T")[0];

        for (const dayIndex in days) {
            const dayData = days[dayIndex];
            const column = document.createElement("div");
            column.className = "day-container d-flex flex-column";

            // ✅ Adiciona classe "today" se for o dia de hoje
            if (dayData.dateFormated === todayFormatted) {
                column.classList.add("today");
            }

            const title = document.createElement("p");
            title.className = "day-title";
            title.innerText = capitalize(dayData.dateTitle);
            column.appendChild(title);

            dayData.clockins.forEach(clockin => {
                column.appendChild(createClockinCard(clockin));
            });

            fragment.appendChild(column);
        }

        clockinContainerTemplate.appendChild(fragment);
    }

    function groupClockinPerDay(clockins) {
        const days = {};
        const baseDate = new Date(`${firstDateSearch.year}-${firstDateSearch.month}-${firstDateSearch.day}T00:00:00.000`);
        const dateMap = {};

        for (let i = 0; i < 7; i++) {
            const current = new Date(baseDate);
            current.setDate(baseDate.getDate() + i);

            const formatted = current.toISOString().split("T")[0];
            const label = current.toLocaleDateString("pt-BR", {
                weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric'
            });

            days[i] = { dateTitle: label, dateFormated: formatted, clockins: [] };
            dateMap[formatted] = i;
        }

        clockins.forEach(c => {
            const index = dateMap[c.date];
            if (index !== undefined) days[index].clockins.push(c);
        });

        return days;
    }

    function createClockinCard(clockin) {
        const card = document.createElement("div");
        card.className = "card clockinData";

        const durationReadable = `${Math.floor(clockin.duration / 60)} h ${clockin.duration % 60} min`;

        card.innerHTML = `
            <div class="card-body">
                <h6 class="card-title">${escapeHtml(clockin.start)} - ${escapeHtml(clockin.end)}</h6>
                <div class="card-details">
                    ${clockin.projectTag ? `<small>Projeto: ${escapeHtml(clockin.projectTag)}</small>` : ''}
                    <span class="badge">${durationReadable}</span>
                </div>
            </div>`;

        return card;
    }

    function escapeHtml(str) {
        return str.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}
