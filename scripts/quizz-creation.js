const mainQuizzCreate = document.querySelector(".quizz-create");
const sectionBasicInfo = document.querySelector(".basic-info");
const sectionQuizzQuestions = document.querySelector(".quizz-questions");
const sectionQuizzLevels = document.querySelector(".quizz-levels");
const sectionQuizzSuccess = document.querySelector(".quizz-success");

let title, titleImageUrl, numQuestions = 3, numLevels;

let questions = [];

function changePage(page) {
    document.querySelectorAll("main section").forEach(e => e.classList.add("hidden"));
    window.scrollTo({top: 0, left: 0, behavior: 'auto'}); /*teste*/
    mainQuizzCreate.classList.remove("hidden");
    page.classList.remove("hidden");
}

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
        //sectionBasicInfo.querySelectorAll("p").forEach(e => {e.classList.add("hidden")});
        changePage(sectionQuizzQuestions);
        drawQuizzQuestions();
    }
}

function drawQuizzQuestions() {
    for (let i = 1;i <= numQuestions;i++){
        sectionQuizzQuestions.innerHTML += 
        `<div class="container-create">
                <div class="box-question closed" onclick="toggleCollapsedQuestion(this)">
                    <span>Pergunta ${i}</span>
                    <img src="assets/edit_icon.png" alt="Edite a pergunta">
                </div>
                <div class="content-question">
                    <div class="info-question">
                        <input type="text" class="question-text" placeholder="Texto da pergunta">
                        <p class="error hidden">A pergunta deve conter no mínimo 20 caracteres</p>
                        <input type="text" class="question-background-color" placeholder="Cor de fundo da pergunta">
                        <p class="error hidden">A cor de fundo deve estar em hexadecimal <br> Exemplo: #FFFFFF</p>
                    </div>
                    <span>Resposta correta</span>
                    <div class="answer">
                        <input type="text" class="text-answer" placeholder="Resposta correta">
                        <p class="error hidden">A resposta não pode estar vazia</p>
                        <input type="text" class="url-img-answer" placeholder="URL da imagem">
                        <p class="error hidden">A URL informada não é válida</p>
                    </div>
                    <span>Respostas incorretas</span>
                    <p class="error min-one-incorrect hidden">É necessário que tenha pelo menos uma resposta incorreta</p>
                    <div class="answer">
                        <input type="text" class="text-answer" placeholder="Resposta incorreta 1">
                        <p class="error hidden">A resposta não pode estar vazia</p>
                        <input type="text" class="url-img-answer" placeholder="URL da imagem 1">
                        <p class="error hidden">A URL informada não é válida</p>
                    </div>
                    <div class="answer">
                        <input type="text" class="text-answer" placeholder="Resposta incorreta 2">
                        <p class="error hidden">A resposta não pode estar vazia</p>
                        <input type="text" class="url-img-answer" placeholder="URL da imagem 2">
                        <p class="error hidden">A URL informada não é válida</p>
                    </div>
                    <div class="answer">
                        <input type="text" class="text-answer" placeholder="Resposta incorreta 2">
                        <p class="error hidden">A resposta não pode estar vazia</p>
                        <input type="text" class="url-img-answer" placeholder="URL da imagem 2">
                        <p class="error hidden">A URL informada não é válida</p>
                    </div>
                </div>
            </div>
        </div>
    `}
    sectionQuizzQuestions.innerHTML += `<button class="default-button next-button" onclick="checkAllQuizzQuestions()">Prosseguir para criar níveis</button>`
}

function toggleCollapsedQuestion(select) {
    const content = select.nextElementSibling;

    select.classList.toggle("closed");
    if (content.style.maxHeight) content.style.maxHeight = null;
    else content.style.maxHeight = content.scrollHeight + "px";
}


function checkQuizzQuestions(select) {

    let hasError = false;
    let question = {};
    let answers = [];

    //Todos os parágrafos já são criados com a classe hidden
    //select.querySelectorAll("p").forEach(e => {e.classList.add("hidden")});

    const questionText = select.querySelector(".question-text").value;
    const backgroundColorQuestion = select.querySelector(".question-background-color").value;

    if (questionText.length < 20 || questionText.length < 1) {
        select.querySelector(".question-text").nextElementSibling.classList.remove("hidden");
        hasError = true;
    }
    if (backgroundColorQuestion[0] !== "#" || backgroundColorQuestion.length !== 7) {
        select.querySelector(".question-background-color").nextElementSibling.classList.remove("hidden");
        hasError = true;
    }

    select.querySelectorAll(".answer").forEach((e,i) => {
        const answerText = e.querySelector(".text-answer").value;
        const answerImageUrl = e.querySelector(".url-img-answer").value;

        if (i <= 1) {
            if (answerText.length < 1) {
                if (i<= 1) e.querySelector(".text-answer").nextElementSibling.classList.remove("hidden");
                hasError = true;
            }
            if (!isValidURL(answerImageUrl)){
                e.querySelector(".url-img-answer").nextElementSibling.classList.remove("hidden");
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

    if (!hasError && answers !== {}) {
        question = {
            title: questionText,
            color: backgroundColorQuestion,
            answers: answers,
        }
        questions.push(question);
    }
}

const checkAllQuizzQuestions = () => {
    const allQuestions = sectionQuizzQuestions.querySelectorAll(".content-question");
    allQuestions.forEach(e => checkQuizzQuestions(e));

    if (questions.length === numQuestions) changePage(sectionQuizzLevels);
    else questions = [];
}


function isValidURL(url) {
    let result = url.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    return (result !== null);
}

changePage(sectionQuizzQuestions);
drawQuizzQuestions();
