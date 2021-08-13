const URL_API = "https://mock-api.bootcamp.respondeai.com.br/api/v3/buzzquizz/quizzes"

function getQuizzes() {
    const promise = axios.get(URL_API);
    promise.then(showQuizzes);
}

function showQuizzes(response) {
    const quizzes = document.querySelector(".all-quizzes .quizzes");
    quizzes.innerHTML = "";

    for (let i = 0; i < response.data.length; i++){
        quizzes.innerHTML += `
        <div class="quizz">
            <img src="${response.data[i].image}" alt="${response.data[i].title}">
            <div>
                ${response.data[i].title}
            </div>
        </div>
        `
    }
}

getQuizzes();
