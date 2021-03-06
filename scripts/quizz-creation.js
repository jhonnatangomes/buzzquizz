const mainQuizzCreate = document.querySelector(".quizz-create");
const sectionBasicInfo = document.querySelector(".basic-info");
const sectionQuizzQuestions = document.querySelector(".quizz-questions");
const sectionQuizzLevels = document.querySelector(".quizz-levels");
const sectionQuizzSuccess = document.querySelector(".quizz-success");

let title, titleImageUrl, numQuestions, numLevels, isEditing = false;

let questions = [], levels = [];

/*                 General functions                  */
function toggleCollapsed(select) {
    const content = select.nextElementSibling;
    select.classList.toggle("closed");
    content.classList.toggle("opened");
}

function isValidURL(url) {
    let result = url.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    return (result !== null);
}

function isHexadecimal (text) {
    let result = text.match(/[0-9A-Fa-f]{6}/g);
    return (result !== null);
}

function sendQuizzServer() {
    const quizzObject = {
        title: title,
        image: titleImageUrl,
        questions: questions,
        levels: levels
    };


    let promise;
    if(isEditing){
        let ids = JSON.parse(localStorage.getItem("ids"));
        key = ids.find(e => e.includes(quizz.id))[1];
        promise = axios.put(`${URL_API}/${quizz.id}`, quizzObject, {
            headers: {
                "Secret-Key": key
            }
        });
    }
    else{
        promise = axios.post(URL_API, quizzObject);
    }
    isLoading(true);
    promise.then(showQuizzSucess);
}

function storeQuizzId(id, key) {
    let ids = JSON.parse(localStorage.getItem("ids"));

    if(ids === null) ids = [];

    if(!isEditing) {
        ids.push([id, key]);
        const serializedIds = JSON.stringify(ids);
        localStorage.setItem("ids", serializedIds);
    }
    else isEditing = false;
    
}

/*                 Basic info functions                  */
function checkBasicInfo() {
    title = sectionBasicInfo.querySelector(".your-quizz-title").value;
    titleImageUrl = sectionBasicInfo.querySelector(".url-img").value;
    numQuestions = sectionBasicInfo.querySelector(".number-questions").value;
    numLevels = sectionBasicInfo.querySelector(".number-levels").value;

    let hasError = false;
    sectionBasicInfo.querySelectorAll("p").forEach(e => e.classList.add("hidden"));

    if (title.length < 20 || title.length > 65) { 
        sectionBasicInfo.querySelector(".title-error").classList.remove("hidden");
        sectionBasicInfo.querySelector(".your-quizz-title").classList.add("invalid-input");
        hasError = true;
    }
    if (!isValidURL(titleImageUrl)) {
        sectionBasicInfo.querySelector(".url-error").classList.remove("hidden");
        sectionBasicInfo.querySelector(".url-img").classList.add("invalid-input");
        hasError = true;
    }
    if (numQuestions < 3 || isNaN(numQuestions)) { 
        sectionBasicInfo.querySelector(".questions-error").classList.remove("hidden");
        sectionBasicInfo.querySelector(".number-questions").classList.add("invalid-input");
        hasError = true;
    }
    if (numLevels < 2 || isNaN(numLevels)) { 
        sectionBasicInfo.querySelector(".levels-error").classList.remove("hidden");
        sectionBasicInfo.querySelector(".number-levels").classList.add("invalid-input");
        hasError = true;
    }

    if (!hasError) {
        sectionBasicInfo.querySelectorAll("p").forEach(e => {e.classList.add("hidden")});
        changePages("quizz-questions");
        drawQuizzQuestions();
    }
}

/*                  Question Functions                  */
function drawQuizzQuestions() {
    for (let i = 1;i <= numQuestions;i++){
        sectionQuizzQuestions.innerHTML += 
        `<div class="container-create">
                <div class="collapsible-box closed" onclick="toggleCollapsed(this)">
                    <span>Pergunta ${i}</span>
                    <img src="assets/edit_icon.png" alt="Edite a pergunta">
                </div>
                <div class="content">
                    <div class="info-question">
                        <div>
                            <input type="text" class="question-text" placeholder="Texto da pergunta">
                            <p class="error hidden">A pergunta deve conter no m??nimo 20 caracteres</p>
                        </div>
                        <div>
                            <input type="text" class="question-background-color" placeholder="Cor de fundo da pergunta">
                            <p class="error hidden">A cor de fundo deve estar em hexadecimal <br> Exemplo: #FFFFFF</p>
                        </div>
                    </div>
                    <span>Resposta correta</span>
                    <div class="answer">
                    <div>
                        <input type="text" class="text-answer" placeholder="Resposta correta">
                        <p class="error hidden">A resposta n??o pode estar vazia</p>
                    </div>
                    <div>
                        <input type="text" class="url-img-answer" placeholder="URL da imagem">
                        <p class="error hidden">A URL informada n??o ?? v??lida</p>
                    </div>
                    </div>
                    <span>Respostas incorretas</span>
                    <p class="error min-one-incorrect hidden">?? necess??rio que tenha pelo menos uma resposta incorreta</p>
                    <div class="answer">
                    <div>
                        <input type="text" class="text-answer" placeholder="Resposta incorreta 1">
                        <p class="error hidden">A resposta n??o pode estar vazia</p>
                    </div>
                    <div>
                        <input type="text" class="url-img-answer" placeholder="URL da imagem 1">
                        <p class="error hidden">A URL informada n??o ?? v??lida</p>
                    </div>
                    </div>
                    <div class="answer">
                    <div>
                        <input type="text" class="text-answer" placeholder="Resposta incorreta 2">
                        <p class="error hidden">A resposta n??o pode estar vazia</p>
                    </div>
                    <div>
                        <input type="text" class="url-img-answer" placeholder="URL da imagem 2">
                        <p class="error hidden">A URL informada n??o ?? v??lida</p>
                    </div>
                    </div>
                    <div class="answer">
                    <div>
                        <input type="text" class="text-answer" placeholder="Resposta incorreta 3">
                        <p class="error hidden">A resposta n??o pode estar vazia</p>
                    </div>
                    <div>
                        <input type="text" class="url-img-answer" placeholder="URL da imagem 3">
                        <p class="error hidden">A URL informada n??o ?? v??lida</p>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    `}
    sectionQuizzQuestions.innerHTML += `<button class="default-button next-button" onclick="checkAllQuizzQuestions()">Prosseguir para criar n??veis</button>`

    if (isEditing) fillQuizzQuestionsInput();
}

const checkAllQuizzQuestions = () => {
    const allQuestions = sectionQuizzQuestions.querySelectorAll(".content");
    allQuestions.forEach(e => checkQuizzQuestions(e));

    if (questions.length === Number(numQuestions)){ 
        changePages("quizz-levels");
        drawQuizzLevels();
    }
    else questions = [];
}

function checkQuizzQuestions(select) {
    let hasError = false;
    let question = {};
    let answers = [];

    select.querySelectorAll("p").forEach(e => {e.classList.add("hidden");});
    select.querySelectorAll("input").forEach(e => {e.classList.remove("invalid-input")});

    const questionText = select.querySelector(".question-text").value;
    const questionBackgroundColor = select.querySelector(".question-background-color").value;

    if (questionText.length < 20) {
        select.querySelector(".question-text").nextElementSibling.classList.remove("hidden");
        select.querySelector(".question-text").classList.add("invalid-input");
        hasError = true;
    }
    if (questionBackgroundColor[0] !== "#" || questionBackgroundColor.length !== 7 || !isHexadecimal(questionBackgroundColor)) {
        select.querySelector(".question-background-color").nextElementSibling.classList.remove("hidden");
        select.querySelector(".question-background-color").classList.add("invalid-input");
        hasError = true;
    }

    select.querySelectorAll(".answer").forEach((e,i) => {
        const answerText = e.querySelector(".text-answer").value;
        const answerImageUrl = e.querySelector(".url-img-answer").value;

        if (i <= 1) {
            if (answerText.length < 1) {
                e.querySelector(".text-answer").nextElementSibling.classList.remove("hidden");
                e.querySelector(".text-answer").classList.add("invalid-input");
                hasError = true;
            }
            if (!isValidURL(answerImageUrl)){
                e.querySelector(".url-img-answer").nextElementSibling.classList.remove("hidden");
                e.querySelector(".url-img-answer").classList.add("invalid-input");
                hasError = true;
            }
        }

        if (!hasError && (answerText.length > 0) && (isValidURL(answerImageUrl))) {
            answers.push ({
                text: answerText,
                image: answerImageUrl,
                isCorrectAnswer: (i === 0) ? true:false
            });
        }      
    });

    if (select.querySelectorAll(".answer").length < 2 || select.querySelectorAll(".answer")[0].value === ""){
        select.querySelector(".min-one-incorrect").classList.remove("hidden");
        hasError = true;
    }

    if (!hasError && answers.length > 0) {
        question = {
            title: questionText,
            color: questionBackgroundColor,
            answers: answers,
        }
        questions.push(question);
    }
}

/*                  Levels Functions                  */
function drawQuizzLevels() {
    sectionQuizzLevels.innerHTML += `
    <p class="error hidden percentage-0-not-found">?? necess??rio pelo menos um n??vel com 0% de acerto m??nimo</p>
    `
    for (let i = 1;i <= numLevels;i++){
        sectionQuizzLevels.innerHTML += `
        <div class="container-create">
            <div class="collapsible-box closed" onclick="toggleCollapsed(this)">
                <span class="level">N??vel ${i}</span>
                <img src="assets/edit_icon.png" alt="Edite a pergunta">
            </div>
            <div class="content">
                <div>
                    <input type="text" class="level-title" placeholder="T??tulo do n??vel">
                    <p class="error hidden">O t??tulo requer pelo menos 10 caracteres</p>
                </div>
                <div>
                    <input type="text" class="minimal-percentage" placeholder="% de acerto m??nima">
                    <p class="error hidden">A porcentagem de acerto m??nima deve ser um n??mero entre 0 e 100</p>
                </div>
                <div>
                    <input type="text" class="url-level-image" placeholder="URL da imagem do n??vel">
                    <p class="error hidden">A URL tem formato inv??lido</p>
                </div>
                <div>
                    <input type="text" class="level-description" placeholder="Descri????o do n??vel">
                    <p class="error hidden">O descri????o requer pelo menos 30 caracteres</p>
                </div>
            </div>
        </div>`
    }
    sectionQuizzLevels.innerHTML += `<button class="default-button finish-quizz" onclick="checkAllQuizzLevels()">Finalizar Quizz</button>`

    if(isEditing) fillQuizzLevelsInput();
}

const checkAllQuizzLevels = () => {
    const allLevels = document.querySelector(".quizz-levels").querySelectorAll(".content");
    allLevels.forEach(e => checkQuizzLevels(e));

    document.querySelector(".percentage-0-not-found").classList.add("hidden");

    const includedZeroPercentage = () => levels.some(e => e.minValue === 0);
    
    if (levels.length === Number(numLevels) && includedZeroPercentage()/*levelPercentages.includes("0")*/) {
        console.log("Enviando quizz ao servidor");
        sendQuizzServer();
    }
    else {
        if (!includedZeroPercentage()) document.querySelector(".percentage-0-not-found").classList.remove("hidden");
        levels = [];
    };
}

function checkQuizzLevels(select) {
    let hasError = false;
    let level = {};

    select.querySelectorAll("p").forEach(e => {e.classList.add("hidden");});
    select.querySelectorAll("input").forEach(e => {e.classList.remove("invalid-input")});

    const titleLevel = select.querySelector(".level-title").value;
    const minPercentageCorrect = select.querySelector(".minimal-percentage").value;
    const urlImgLevel = select.querySelector(".url-level-image").value;
    const descriptionLevel = select.querySelector(".level-description").value;

    if (titleLevel.length < 10) {
        select.querySelector(".level-title").nextElementSibling.classList.remove("hidden");
        select.querySelector(".level-title").classList.add("invalid-input");
        hasError = true;
    }
    if (minPercentageCorrect < 0 || minPercentageCorrect > 100 || minPercentageCorrect === "" || isNaN(minPercentageCorrect)) {
        select.querySelector(".minimal-percentage").nextElementSibling.classList.remove("hidden");
        select.querySelector(".minimal-percentage").classList.add("invalid-input");
        hasError = true;
    }
    if (!isValidURL(urlImgLevel)) {
        select.querySelector(".url-level-image").nextElementSibling.classList.remove("hidden");
        select.querySelector(".url-level-image").classList.add("invalid-input");
        hasError = true;
    }
    if (descriptionLevel.length < 30){
        select.querySelector(".level-description").nextElementSibling.classList.remove("hidden");
        select.querySelector(".level-description").classList.add("invalid-input");
        hasError = true;
    }

    if (!hasError) {
        level = {
            title: titleLevel,
            image: urlImgLevel,
            text: descriptionLevel,
            minValue: Number(minPercentageCorrect),
        }
        levels.push(level);
    }
}

function showQuizzSucess(response) {
    storeQuizzId(response.data.id, response.data.key);
    changePages("quizz-success");
    sectionQuizzSuccess.innerHTML = `
    <span>Seu quizz est?? pronto!</span>
    <div class="quizz" onclick="getQuizz(${response.data.id}, openQuizzPage);">
        <img src="${titleImageUrl}" alt="${title}">
        <div>
            ${title}
        </div>
    </div>
    <div class="container-buttons">
        <button class="default-button access-quizz-button" onclick="getQuizz(${response.data.id}, openQuizzPage);">Acessar Quizz</button>
        <p class="back-home-button" onclick="returnToHomeScreen();">Voltar para home</p>
    </div>`
    isLoading(false);
}
