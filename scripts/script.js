const URL_API = "https://mock-api.bootcamp.respondeai.com.br/api/v3/buzzquizz/quizzes";
let isAnswered = false, questionIdPrevious = 0, questionsAnswered = 0, correctAnswers = 0, score = 0;

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
        quizzPage.innerHTML += `<section class="question" id="question${i + 1}">
        <div class="question-header">
            ${questions[i].title}
        </div>

        <div class="question-items">
        </div>
        </section>
        `
        shuffle(questions[i].answers);

        question = document.querySelectorAll(".quizz-page .question .question-items")[i];
        for(let j = 0; j < questions[i].answers.length; j++){
            question.innerHTML += `    
            <div class="question-item correct-${questions[i].answers[j].isCorrectAnswer.toString()}" onclick="selectAnswer(this, ${i+1}, ${questions.length});">
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

function selectAnswer(element, questionId, questionsLength) {
    if(questionId !== questionIdPrevious) {
        isAnswered = false;
    }

    if(!isAnswered && questionsAnswered !== questionsLength) {
        const answers = element.parentNode.querySelectorAll(".question-item");
        element.classList.add("selected-answer");

        if(element.classList.contains("correct-true")) {
            correctAnswers += 1;
        }

        answers.forEach(function (answer) {
            if(!answer.classList.contains("selected-answer")){
                answer.classList.add("blur-item")
            };

            if(answer.classList.contains("correct-true")){
                answer.classList.add("correct-item");
            }
            if(answer.classList.contains("correct-false")){
                answer.classList.add("incorrect-item");
            }

        });

        questionsAnswered += 1;
        questionIdPrevious = questionId;
        isAnswered = true;
        setTimeout(scrollToNextQuestion, 2000, questionId);
    }

    showResult(questionsLength);
}

function scrollToNextQuestion (questionId) {
    const nextDiv = document.querySelector(`#question${questionId + 1}`);
    if (nextDiv !== null) {
        nextDiv.scrollIntoView();
    }
    
}

function showResult(questionsLength) {
    if(questionsLength === questionsAnswered) {
        score = correctAnswers/questionsLength;
        const quizzPage = document.querySelector(".quizz-page");
        quizzPage.innerHTML += `
        <section class="result" id="question${questionsLength + 1}">
            <div class="result-header">
                88% de acerto: Você é praticamente um aluno de Hogwarts!
            </div>
            <div class="result-container">
                <img src="assets/bruxo_chefe.png" alt="Bem-vindo a Hogwarts">
                <span>Parabéns Potterhead! Bem-vindx a Hogwarts, aproveite o loop infinito de comida e clique no botão abaixo para usar o vira-tempo e reiniciar este teste.</span>
            </div>
        </section>
        
        <div class="container-buttons">
            <button class="default-button restart-quizz-button">Reiniciar Quizz</button>
            <p class="back-home-button">Voltar para home</p>
        </div>
        `
    }
}

getQuizzes();
