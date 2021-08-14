const URL_API = "https://mock-api.bootcamp.respondeai.com.br/api/v3/buzzquizz/quizzes";
let isAnswered = false, questionIdPrevious = 0, questionsAnswered = 0, correctAnswers = 0, score = 0, showingResult = false;
let levels;

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
            <div class="quizz" id="${response.data[i].id}" onclick="selectQuizz(this)">
                <img src="${response.data[i].image}" alt="${response.data[i].title}">
                <div>
                    ${response.data[i].title}
                </div>
            </div>
            `
        } 
    }
}

function selectQuizz(element) {
    const elementId = element.id;
    const promise = axios.get(`${URL_API}/${elementId}`);

    promise.then(openQuizzPage);
}


function openQuizzPage(response) {
    const quizzesList = document.querySelector(".quizzes-list");
    const quizzPage = document.querySelector(".quizz-page");
    let question;

    quizzPage.innerHTML = "";

    quizzPage.innerHTML += `
    <div class="quizz-title">
        <img src="${response.data.image}" alt="">
        <span>${response.data.title}</span>
    </div>
    `
    
    for(let i = 0; i < response.data.questions.length; i++) {
        quizzPage.innerHTML += `<section class="question" id="question${i + 1}">
        <div class="question-header">
            ${response.data.questions[i].title}
        </div>

        <div class="question-items">
        </div>
        </section>
        `
        shuffle(response.data.questions[i].answers);

        question = document.querySelectorAll(".quizz-page .question .question-items")[i];
        for(let j = 0; j < response.data.questions[i].answers.length; j++){
            if(response.data.questions[i].answers[j].isCorrectAnswer) {
                question.innerHTML += `    
                <div class="question-item correct" onclick="selectAnswer(this, ${i+1}, ${response.data.questions.length});">
                    <img src="${response.data.questions[i].answers[j].image}" alt="">
                    <p>${response.data.questions[i].answers[j].text}</p>
                 </div>
                 `
            }
            else {
                question.innerHTML += `    
                <div class="question-item incorrect" onclick="selectAnswer(this, ${i+1}, ${response.data.questions.length});">
                    <img src="${response.data.questions[i].answers[j].image}" alt="">
                    <p>${response.data.questions[i].answers[j].text}</p>
                 </div>
                 `
            }
            
        }
        
    }

    levels = response.data.levels;

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

        if(element.classList.contains("correct")) {
            correctAnswers += 1;
        }

        answers.forEach(function (answer) {
            if(!answer.classList.contains("selected-answer")){
                answer.classList.add("blur-item")
            };

            if(answer.classList.contains("correct")){
                answer.classList.add("correct-item");
            }
            if(answer.classList.contains("incorrect")){
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
        score *= 100;
        score = Math.round(score);
        let levelAchieved = levels.filter((element) => score >= element.minValue);
        const quizzPage = document.querySelector(".quizz-page");
        if(!showingResult) {
            quizzPage.innerHTML += `
            <section class="result" id="question${questionsLength + 1}">
                <div class="result-header">
                    ${score}% de acerto: ${levelAchieved[levelAchieved.length - 1].title}
                </div>
                <div class="result-container">
                    <img src="${levelAchieved[levelAchieved.length - 1].image}">
                    <span>${levelAchieved[levelAchieved.length - 1].text}</span>
                </div>
            </section>
            
            <div class="container-buttons">
                <button class="default-button restart-quizz-button" onclick="restartQuizz();">Reiniciar Quizz</button>
                <p class="back-home-button">Voltar para home</p>
            </div>
            `

            showingResult = true;
        }
    }
}

function restartQuizz() {

    const questions = document.querySelectorAll(".question-item");
    questions.forEach((element) => {
        element.classList.remove("blur-item");
        element.classList.remove("correct-item");
        element.classList.remove("incorrect-item");
        element.classList.remove("selected-answer");
    })

    const result = document.querySelector(".result");
    const containerButtons = document.querySelector(".container-buttons");
    result.remove();
    containerButtons.remove();

    questionsAnswered = 0;
    score = 0;
    correctAnswers = 0;
    questionIdPrevious = 0;
    showingResult = false;

    document.documentElement.scrollTop = 0;
}

getQuizzes();
