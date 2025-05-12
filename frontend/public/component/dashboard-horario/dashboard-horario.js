export function init() {
    const hoursContainer = document.getElementById("hoursContainer");
    if (!hoursContainer) return;

    const weekContainer = document.getElementById("periodSearch");
    if (!weekContainer) return;

    document.getElementById("backWeek").addEventListener("click", () => {
        referenceWeek -= 1;
        generateLastDateView();
        getEmployeeClockin();
    })

    document.getElementById("nextWeek").addEventListener("click", () => {
        referenceWeek += 1;
        generateLastDateView();
        getEmployeeClockin();
    })

    
}
// -----------------------------------------------------------
export function init() {


    const clockinContainerTemplate = document.getElementById("clockinsContainer");

    const clockinSearchForm = document.getElementById("searchClockinEmployee");
    clockinSearchForm.addEventListener("submit", (event) => {
        event.preventDefault();
        getEmployeeClockin();
    })

    let referenceWeek = 0;
    let firstDateSearch = {};
    let lastDateSearch = {};

    weekContainer.style.visibility = "hidden";
    firstTimeLoadPage();

    function firstTimeLoadPage() {
        generateLastDateView();
        weekContainer.style.visibility = "visible";
    }



    function generateLastDateView() {
        const lastDate = new Date();
        lastDate.setDate(lastDate.getDate() + (referenceWeek * 7));

        const currentDayNumber = lastDate.getDate().toString().padStart(2, "0");
        const currentMonthNumber = (lastDate.getMonth() + 1).toString().padStart(2, "0");
        const currentYear = lastDate.getFullYear().toString();

        const periodContent = weekContainer.querySelector("#current");
        const dateFormated = `${currentDayNumber}/${currentMonthNumber}/${currentYear}`
        periodContent.innerText = dateFormated;

        lastDateSearch.day = currentDayNumber;
        lastDateSearch.month = currentMonthNumber;
        lastDateSearch.year = currentYear;

        generateBackwardDateView(lastDate)
    }

    function generateBackwardDateView(lastDate) {
        const firstDateToView = new Date(lastDate);
        firstDateToView.setDate(firstDateToView.getDate() - 6);

        const backwardDayNumber = firstDateToView.getDate().toString().padStart(2, "0");
        const backwardMonthNumber = (firstDateToView.getMonth() + 1).toString().padStart(2, "0");
        const backwardYear = firstDateToView.getFullYear().toString();

        const periodContent = weekContainer.querySelector("#backward");
        const dateFormated = `${backwardDayNumber}/${backwardMonthNumber}/${backwardYear}`;
        periodContent.innerText = dateFormated;

        firstDateSearch.day = backwardDayNumber;
        firstDateSearch.month = backwardMonthNumber;
        firstDateSearch.year = backwardYear;
    }

    async function getEmployeeClockin() {
        const formData = new FormData(clockinSearchForm);
        const searchClockinData = Object.fromEntries(formData.entries());
        const startDate = `${firstDateSearch.day}%2F${firstDateSearch.month}%2F${firstDateSearch.year}`;
        const endDate = `${lastDateSearch.day}%2F${lastDateSearch.month}%2F${lastDateSearch.year}`

        console.log(searchClockinData);
        console.log(startDate);
        console.log(endDate);

        try {
            if (searchClockinData.register == "") throw new Error("Matrícula de funcionário não informada. Tente novamente");
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:4444/time-entry/employee/${searchClockinData.register}?start=${startDate}&end=${endDate}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                }
            });
            const message = document.getElementById("message");
            if (!response.ok) message.innerText = "Erro ao procurar pelos horários. Tente novamente.";
            const clockinResults = await response.json();
            if (clockinResults.length == 0) {
                message.innerText = "Nenhum funcionário encontrado. Tente novamente."
                clockinContainerTemplate.innerHTML = '';
            } else {
                message.innerHTML = "";
                generateClockinItems(clockinResults);
            }
            console.log(clockinResults);
        } catch (error) {
            console.error(error);
        }
    }

    function generateClockinItems(clockinResults) {
        clockinContainerTemplate.innerHTML = '';
        const daysToView = groupClockinPerDay(clockinResults);
        const fragment = document.createDocumentFragment();

        for (const dayNumber in daysToView) {
            if (Object.prototype.hasOwnProperty.call(daysToView, dayNumber)) {
                const actualDay = daysToView[dayNumber];
                const dayColumnBox = document.createElement("div");
                dayColumnBox.className = "day-container d-flex flex-column";

                const columnTitle = document.createElement("p");
                columnTitle.className = "day-title"
                columnTitle.innerText = capitalize(actualDay.dateTitle);
                dayColumnBox.appendChild(columnTitle);

                actualDay.clockins.forEach((clockin) => {
                    const card = createClockinCard(clockin);
                    dayColumnBox.appendChild(card);
                })
                fragment.appendChild(dayColumnBox);
            }
        }

        clockinContainerTemplate.appendChild(fragment);
    }

    function groupClockinPerDay(clockinList) {
        const days = {
            0: {
                dateTitle: "",
                dateFormated: "",
                clockins: []
            },
            1: {
                dateTitle: "",
                dateFormated: "",
                clockins: []
            },
            2: {
                dateTitle: "",
                dateFormated: "",
                clockins: []
            },
            3: {
                dateTitle: "",
                dateFormated: "",
                clockins: []
            },
            4: {
                dateTitle: "",
                dateFormated: "",
                clockins: []
            },
            5: {
                dateTitle: "",
                dateFormated: "",
                clockins: []
            },
            6: {
                dateTitle: "",
                dateFormated: "",
                clockins: []
            },
        }

        const firstDateString = `${firstDateSearch.year}-${firstDateSearch.month}-${firstDateSearch.day}T00:00:00.000`;
        const currentDateRaw = new Date(firstDateString);
        const dateMap = {};

        for (let index = 0; index < 7; index++) {
            const viewDate = currentDateRaw.toLocaleDateString("pt-BR", {
                weekday: 'long',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });

            const dateFormatedToCompare = currentDateRaw.toISOString().split("T")[0];
            days[index].dateTitle = viewDate;
            days[index].dateFormated = dateFormatedToCompare;

            dateMap[dateFormatedToCompare] = index;
            currentDateRaw.setDate(currentDateRaw.getDate() + 1);
        }

        clockinList.forEach((clockin) => {
            const index = dateMap[clockin.date];
            if (index !== undefined) {
                days[index].clockins.push(clockin);
            }
        });

        return days;
    }

    function createClockinCard(clockin) {

        const card = document.createElement("button");
        card.className = 'card clockinData';
        card.dataset.bsToggle = "modal";
        card.dataset.bsTarget = "#clockinDataInfoModal";

        Object.entries({
            date: clockin.date,
            description: clockin.description,
            duration: clockin.duration,
            clockinId: clockin.clockinId,
            start: clockin.start,
            end: clockin.end,
            projectId: clockin.projectId,
            projectTag: clockin.projectTag,
        }).forEach(([key, value]) => {
            card.dataset[`emp${capitalize(key)}`] = value;
        });

        const durationLegible = `${Math.floor(clockin.duration / 60)} h ${clockin.duration % 60} min`

        card.innerHTML =
            `<div class="card-body">
                <h6 class="card-title">
                    ${escapeHtml(clockin.start)} - ${escapeHtml(clockin.end)}
                </h6>
                <div class="card-details">
                    ${clockin.projectTag
                ? `<small>Projeto: ${escapeHtml(clockin.projectTag)}</small>`
                : ''}
                    <span class="badge">
                        ${durationLegible}
                    </span>
                </div>
            </div>`;

        return card;
    }

    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}
