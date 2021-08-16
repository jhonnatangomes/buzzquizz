const URL_API = "https://mock-api.bootcamp.respondeai.com.br/api/v3/buzzquizz/quizzes";
let questionsAnswered = 0, correctAnswers = 0, score = 0;
let levelsResponse;
let quizz;

const isLoading = (state) => {
    if (state) document.querySelector(".loader").classList.remove("hidden");
    else document.querySelector(".loader").classList.add("hidden");
}

function getQuizzes() {
    isLoading(true);
    const promise = axios.get(URL_API);
    promise.then(showQuizzes);
}

function getQuizz(element, functionToCall) {
    let elementId;
    if(typeof(element) === "number"){
        elementId = element;
    }
    else {
        elementId = element.id;
    }

    isLoading(true);
    const promise = axios.get(`${URL_API}/${elementId}`);
    promise.then(functionToCall);
}

function showQuizzes(response) {
    const quizzes = document.querySelector(".all-quizzes .quizzes");
    quizzes.innerHTML = "";
    let ids = JSON.parse(localStorage.getItem("ids"));
    checkYourQuizzes();

    if(ids === null) {
        ids = [];
    }

    let idsOnly = [];
    ids.forEach(e => {idsOnly.push(e[0])});

    for (let i = 0; i < response.data.length; i++){
        if(!idsOnly.includes(response.data[i].id)) {
            quizzes.innerHTML += `
            <div class="quizz" id="${response.data[i].id}" onclick="getQuizz(this, openQuizzPage)">
                <img src="${response.data[i].image}" alt="${response.data[i].title}">
                <div>
                    ${response.data[i].title}
                </div>
            </div>
            `
        } 
    }
    isLoading(false);
}

function checkYourQuizzes() {
    const ids = JSON.parse(localStorage.getItem("ids"));
    const noQuizzesCreated = document.querySelector(".no-quizzes-created");
    const yourQuizzes = document.querySelector(".your-quizzes");
    if(ids !== null && ids.length !== 0) {
        let idsOnly = [];
        ids.forEach(e => {idsOnly.push(e[0])});
        noQuizzesCreated.classList.add("hidden");
        yourQuizzes.classList.remove("hidden");
        yourQuizzes.querySelector(".quizzes").innerHTML = "";
        idsOnly.forEach(id => getQuizz(id, showYourQuizzes));
    }
    if(ids !== null && ids.length === 0){
        noQuizzesCreated.classList.remove("hidden");
        yourQuizzes.classList.add("hidden");
    }
    isLoading(false);
}

function showYourQuizzes(response) {
    const yourQuizzes = document.querySelector(".your-quizzes .quizzes");
    yourQuizzes.innerHTML += `
    <div class="quizz">
        <div class="quizz-content" onclick="getQuizz(${response.data.id}, openQuizzPage)">
            <img src="${response.data.image}" alt="${response.data.title}">
            <div class="quizz-name">
                ${response.data.title}
            </div>
        </div>
        <div class="edit-quizz-buttons">
            <ion-icon name="create-outline" onclick="getQuizz(${response.data.id}, fillBasicInfoInputs)"></ion-icon>
            <ion-icon name="trash-outline" class="delete-quizz" onclick="confirmDeleteQuizz(${response.data.id})"></ion-icon>
        </div>
    </div>
    `
    isLoading(false);
}

function confirmDeleteQuizz(id) {
    const toDelete = confirm("Você tem certeza que quer deletar esse quiz?");
    if(toDelete) {
        deleteQuizz(id);
    }
}

function deleteQuizz(id) {
    console.log("trying to delete");
    console.log(id);
    let ids = JSON.parse(localStorage.getItem("ids"));

    if(ids !== null) {
        key = ids.find(e => e.includes(id))[1];
        console.log("ifs are working");
        const promise = axios.delete(`${URL_API}/${id}`, {
            headers: {
                "Secret-Key": key
            }
        });
        console.log(promise);
        ids = ids.filter(e => !e.includes(key));
        const serializedIds = JSON.stringify(ids);
        localStorage.removeItem("ids");
        localStorage.setItem("ids", serializedIds);
        isLoading(true);
        promise.then(checkYourQuizzes);
    }
}

function fillBasicInfoInputs(response) {
    isEditing = true;
    quizz = response.data;
    sectionBasicInfo.querySelector(".your-quizz-title").value = quizz.title;
    sectionBasicInfo.querySelector(".url-img").value = quizz.image;
    sectionBasicInfo.querySelector(".number-questions").value = quizz.questions.length;
    sectionBasicInfo.querySelector(".number-levels").value = quizz.levels.length;

    changePages("basic-info");
    isLoading(false);
}

function fillQuizzQuestionsInput() {
    const containerCreate = sectionQuizzQuestions.querySelectorAll(".container-create");
    containerCreate.forEach((e, i) => {
        e.querySelector(".question-text").value = quizz.questions[i].title;
        e.querySelector(".question-background-color").value = quizz.questions[i].color;
        const inputAnswers = e.querySelectorAll(".text-answer");
        const inputUrlImages = e.querySelectorAll(".url-img-answer");

        quizz.questions[i].answers.forEach((answer, j) => {
            inputAnswers[j].value = answer.text;
            inputUrlImages[j].value = answer.image;
        })
    })
}

function fillQuizzLevelsInput() {
    const containerCreate = sectionQuizzLevels.querySelectorAll(".container-create");
    containerCreate.forEach((e, i) => {
        e.querySelector(".level-title").value = quizz.levels[i].title;
        e.querySelector(".minimal-percentage").value = quizz.levels[i].minValue;
        e.querySelector(".url-level-image").value = quizz.levels[i].image;
        e.querySelector(".level-description").value = quizz.levels[i].text;
    })
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
        <div class="question-header" style="background-color: ${response.data.questions[i].color}; color:${(response.data.questions[i].color === "#FFFFFF") ? "#000000":"#FFFFFF"}">
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

    isLoading(false);
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
                answer.classList.add("blur-item");
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

    setTimeout(window.scrollTo, 1, 0, 0);
}

function returnToHomeScreen() {
    changePages("quizzes-list");

    questionsAnswered = 0;
    score = 0;
    correctAnswers = 0;
}

function changePages(pageToShow) {
    const toShow = document.querySelector(`.${pageToShow}`);

    document.querySelectorAll("main, section").forEach(e => e.classList.add("hidden"));

    if(toShow.tagName === "SECTION") {
        toShow.parentNode.classList.remove("hidden");
    }

    if(pageToShow === "quizz-page") {
        toShow.querySelectorAll("section").forEach(e => e.classList.remove("hidden"));
    }

    if(pageToShow === "quizzes-list") {
        window.location.reload();
        return;
    }

    toShow.classList.remove("hidden");
    
    setTimeout(window.scrollTo, 1, {
        top: 0, left: 0, behavior: 'auto'
    });
}

getQuizzes();
