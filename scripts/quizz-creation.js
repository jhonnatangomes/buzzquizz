const mainQuizzCreate = document.querySelector(".quizz-create");
const sectionBasicInfo = document.querySelector(".basic-info");
const sectionQuizzQuestions = document.querySelector(".quizz-questions");
const sectionQuizzLevels = document.querySelector(".quizz-levels");
const sectionQuizzSuccess = document.querySelector(".quizz-success");

let title, titleImageUrl, numQuestions = 3, numLevels = 4;

let questions = [], listLevels = [];

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
        changePages("basic-info", "quizz-questions");
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
                            <p class="error hidden">A pergunta deve conter no mínimo 20 caracteres</p>
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
                        <p class="error hidden">A resposta não pode estar vazia</p>
                    </div>
                    <div>
                        <input type="text" class="url-img-answer" placeholder="URL da imagem">
                        <p class="error hidden">A URL informada não é válida</p>
                    </div>
                    </div>
                    <span>Respostas incorretas</span>
                    <p class="error min-one-incorrect hidden">É necessário que tenha pelo menos uma resposta incorreta</p>
                    <div class="answer">
                    <div>
                        <input type="text" class="text-answer" placeholder="Resposta incorreta 1">
                        <p class="error hidden">A resposta não pode estar vazia</p>
                    </div>
                    <div>
                        <input type="text" class="url-img-answer" placeholder="URL da imagem 1">
                        <p class="error hidden">A URL informada não é válida</p>
                    </div>
                    </div>
                    <div class="answer">
                    <div>
                        <input type="text" class="text-answer" placeholder="Resposta incorreta 2">
                        <p class="error hidden">A resposta não pode estar vazia</p>
                    </div>
                    <div>
                        <input type="text" class="url-img-answer" placeholder="URL da imagem 2">
                        <p class="error hidden">A URL informada não é válida</p>
                    </div>
                    </div>
                    <div class="answer">
                    <div>
                        <input type="text" class="text-answer" placeholder="Resposta incorreta 3">
                        <p class="error hidden">A resposta não pode estar vazia</p>
                    </div>
                    <div>
                        <input type="text" class="url-img-answer" placeholder="URL da imagem 3">
                        <p class="error hidden">A URL informada não é válida</p>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    `}
    sectionQuizzQuestions.innerHTML += `<button class="default-button next-button" onclick="checkAllQuizzQuestions()">Prosseguir para criar níveis</button>`
}

function checkQuizzQuestions(select) {

    let hasError = false;
    let question = {};
    let answers = [];

    select.querySelectorAll("p").forEach(e => {e.classList.add("hidden");});
    select.querySelectorAll("input").forEach(e => {e.classList.remove("invalid-input")});

    const questionText = select.querySelector(".question-text").value;
    const questionBackgroundColor = select.querySelector(".question-background-color").value;

    if (questionText.length < 20 || questionText.length < 1) {
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
        console.log(question);
        questions.push(question);
    }
}

const checkAllQuizzQuestions = () => {
    const allQuestions = sectionQuizzQuestions.querySelectorAll(".content");
    allQuestions.forEach(e => checkQuizzQuestions(e));

    if (questions.length === Number(numQuestions)) changePages("quizz-questions", "quizz-levels");
    else questions = [];
}

/*                  Levels Functions                  */
function drawQuizzLevels() {
    for (let i = 1;i <= numLevels;i++){
        sectionQuizzLevels.innerHTML += `
        <div class="container-create">
            <div class="collapsible-box closed" onclick="toggleCollapsed(this)">
                <span class="level">Nível ${i}</span>
                <img src="assets/edit_icon.png" alt="Edite a pergunta">
            </div>
            <div class="content">
                <input type="text" class="level-title" placeholder="Título do nível">
                <input type="text" class="minimal-percentage" placeholder="% de acerto mínima">
                <input type="text" class="url-level-image" placeholder="URL da imagem do nível">
                <input type="text" class="level-description" placeholder="Descrição do nível">
            </div>
        </div>`
    }
    sectionQuizzLevels.innerHTML += `<button class="default-button finish-quizz">Finalizar Quizz</button>`
}

function checkQuizzLevels() {
    let hasError = false;
    let level = {};
}


changePages("quizzes-list", "quizz-levels");
drawQuizzLevels();
