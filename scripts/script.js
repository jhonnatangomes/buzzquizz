const URL_API = "https://mock-api.bootcamp.respondeai.com.br/api/v3/buzzquizz/quizzes";
let isAnswered = false, questionIdPrevious = 0;

function getQuizzes() {
    const promise = axios.get(URL_API);
    promise.then(showQuizzes);
}

function showQuizzes(response) {
    const quizzes = document.querySelector(".all-quizzes .quizzes");
    quizzes.innerHTML = "";
    let ids = JSON.parse(localStorage.getItem("ids"));
    
    if(ids === null) {
        ids = [];
    }

    for (let i = 0; i < response.data.length; i++){
        if(!ids.includes(response.data[i].id)) {
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

    const quizzArray = document.querySelectorAll(".all-quizzes .quizz");
    for(let i = 0; i < quizzArray.length; i++) {
        quizzArray[i].addEventListener('click', function () {
            openQuizzPage(response.data[i].image, response.data[i].title, response.data[i].questions);
        })
    }

}

function openQuizzPage(image, title, questions) {
    const quizzesList = document.querySelector(".quizzes-list");
    const quizzPage = document.querySelector(".quizz-page");
    let question;

    quizzPage.innerHTML = "";

    quizzPage.innerHTML += `
    <div class="quizz-title">
        <img src="${image}" alt="">
        <span>${title}</span>
    </div>
    `
    
    for(let i = 0; i < questions.length; i++) {
        quizzPage.innerHTML += `<section class="question">
        <div class="question-header">
            ${questions[i].title}
        </div>

        <div class="question-items" id="question{${i + 1}}">
        </div>
        </section>
        `
        shuffle(questions[i].answers);

        question = document.querySelectorAll(".quizz-page .question .question-items")[i];
        for(let j = 0; j < questions[i].answers.length; j++){
            question.innerHTML += `    
            <div class="question-item" onclick="selectAnswer(this, ${i+1});">
                <img src="${questions[i].answers[j].image}" alt="">
                <p>${questions[i].answers[j].text}</p>
            </div>
            `
        }
        
    }

    quizzesList.classList.add("hidden");
    quizzPage.classList.remove("hidden");
}

function createQuizz() {
    const quizzesList = document.querySelector(".quizzes-list");
    const quizzCreate = document.querySelector(".quizz-create");

    quizzesList.classList.add("hidden");
    quizzCreate.classList.remove("hidden");
}

function shuffle(array) {
    for(let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i+1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function selectAnswer(element, questionId) {
    if(questionId !== questionIdPrevious) {
        isAnswered = false;
    }

    if(!isAnswered) {
        element.classList.add("correct-item");
        const items = element.parentNode.querySelectorAll(".question-item");
        for (let i = 0; i < items.length; i++){
            if(!items[i].classList.contains("correct-item")) {
                items[i].classList.add("incorrect-item");
            }
        }
        questionIdPrevious = questionId;

        isAnswered = true;
    }

    
}

getQuizzes();
