const URL_API = "https://mock-api.bootcamp.respondeai.com.br/api/v3/buzzquizz/quizzes"

function getQuizzes() {
    const promise = axios.get(URL_API);
    promise.then(showQuizzes);
}

function showQuizzes(response) {
    const quizzes = document.querySelector(".all-quizzes .quizzes");
    quizzes.innerHTML = "";
    ids = JSON.parse(localStorage.getItem("ids"));

    for (let i = 0; i < response.data.length; i++){ 
        if(!ids.includes(response.data[i].id)) {
            quizzes.innerHTML += `
            <div class="quizz" onclick="openQuizzPage();">
                <img src="${response.data[i].image}" alt="${response.data[i].title}">
                <div>
                    ${response.data[i].title}
                </div>
            </div>
            `
        }
        
    }
}

function openQuizzPage() {
    const quizzesList = document.querySelector(".quizzes-list");
    const quizzPage = document.querySelector(".quizz-page");

    quizzesList.classList.add("hidden");
    quizzPage.classList.remove("hidden");
}

function createQuizz() {
    const quizzesList = document.querySelector(".quizzes-list");
    const quizzCreate = document.querySelector(".quizz-create");

    quizzesList.classList.add("hidden");
    quizzCreate.classList.remove("hidden");
}

getQuizzes();
