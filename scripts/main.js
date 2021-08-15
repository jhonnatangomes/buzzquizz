const URL_API = "https://mock-api.bootcamp.respondeai.com.br/api/v3/buzzquizz/quizzes";
let questionIdPrevious = 0, questionsAnswered = 0, correctAnswers = 0, score = 0, showingResult = false;
let levelsResponse;

function getQuizzes() {
    const promise = axios.get(URL_API);
    promise.then(showQuizzes);
}

function getYourQuizz(id) {
    const promise = axios.get(`${URL_API}/${id}`);
    promise.then(showYourQuizzes);
}

function showQuizzes(response) {
    const quizzes = document.querySelector(".all-quizzes .quizzes");
    quizzes.innerHTML = "";
    let ids = JSON.parse(localStorage.getItem("ids"));
    checkYourQuizzes();

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

function checkYourQuizzes() {
    const ids = JSON.parse(localStorage.getItem("ids"));
    const containerUserQuizzes = document.querySelectorAll(".container-user-quizzes > div");
    const quizzes = containerUserQuizzes[1].querySelector(".quizzes");
    if(ids !== null) {
        containerUserQuizzes.forEach(e => e.classList.toggle("hidden"));
        ids.forEach(id => getYourQuizz(id));
    }
}

function showYourQuizzes(response) {
    const yourQuizzes = document.querySelector(".your-quizzes .quizzes");
    yourQuizzes.innerHTML += `
    <div class="quizz">
        <img src="${response.data.image}" alt="${response.data.title}">
        <div>
            ${response.data.title}
        </div>
    </div>
    `
}

function selectQuizz(element) {
    let elementId;
    if(typeof(element) === "number"){
        elementId = element;
    }
    else {
        elementId = element.id;
    }
    const promise = axios.get(`${URL_API}/${elementId}`);

    promise.then(openQuizzPage);
}


function openQuizzPage(response) {
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

    levelsResponse = response.data.levels;

    //changePages("quizzes-list", "quizz-page");
    changePages("quizz-page");
    
}

function shuffle(array) {
    for(let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i+1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function selectAnswer(element, questionId, questionsLength) {

    if(!element.classList.contains("is-answered") && questionsAnswered !== questionsLength) {
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

            answer.classList.add("is-answered");

        });

        questionsAnswered += 1;
        questionIdPrevious = questionId;
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
        let levelAchieved = levelsResponse.filter((element) => score >= element.minValue);
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
                <p class="back-home-button" onclick="returnToHomeScreen();">Voltar para home</p>
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
        element.classList.remove("is-answered");
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

    setTimeout(window.scrollTo, 1, 0, 0);
}

function returnToHomeScreen() {
    // changePages("quizz-page", "quizzes-list");
    changePages("quizzes-list");

    questionsAnswered = 0;
    score = 0;
    correctAnswers = 0;
    questionIdPrevious = 0;
    showingResult = false;
}

// function changePages(pageToHide, pageToShow) {
//     const toHide = document.querySelector(`.${pageToHide}`);
//     const toShow = document.querySelector(`.${pageToShow}`);

//     toHide.classList.add("hidden");
//     toShow.classList.remove("hidden");
//     setTimeout(window.scrollTo, 1, {
//         top: 0, left: 0, behavior: 'auto'
//     });
// }

function changePages(pageToShow) {
    //const toHide = document.querySelector(`.${pageToHide}`);
    const toShow = document.querySelector(`.${pageToShow}`);

    document.querySelectorAll("main, section").forEach(e => e.classList.add("hidden"));

    //toHide.classList.add("hidden");

    

    if(pageToShow === "quizz-page" || pageToShow === "quizzes-list") {
        toShow.querySelectorAll("section").forEach(e => e.classList.remove("hidden"));
    }

    toShow.parentNode.classList.remove("hidden");
    toShow.classList.remove("hidden");
    setTimeout(window.scrollTo, 1, {
        top: 0, left: 0, behavior: 'auto'
    });
}

getQuizzes();
