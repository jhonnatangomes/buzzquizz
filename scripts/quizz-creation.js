const mainQuizzCreate = document.querySelector(".quizz-create");
const sectionBasicInfo = document.querySelector(".basic-info");
const sectionQuizzQuestions = document.querySelector(".quizz-questions");
const sectionQuizzLevels = document.querySelector(".quizz-levels");
const sectionQuizzSuccess = document.querySelector(".quizz-success");

let title, titleImageUrl, numQuestions = 3 /*teste*/, numLevels;

let questionText, backgroundColorQuestion, answerText, answerImageUrl = [];  


function changePage(page) {
    document.querySelectorAll("main section").forEach(e => {e.classList.add("hidden")});
    window.scrollTo({top: 0, left: 0, behavior: 'auto'});
    mainQuizzCreate.classList.remove("hidden");
    page.classList.remove("hidden");
}

function checkBasicInfo() {
    title = sectionBasicInfo.querySelector(".your-quizz-title").value;
    titleImageUrl = sectionBasicInfo.querySelector(".url-img").value;
    numQuestions = sectionBasicInfo.querySelector(".number-questions").value;
    numLevels = sectionBasicInfo.querySelector(".number-levels").value;

    let hasError = false;

    if (title.length < 20 || title.length > 65) { 
        sectionBasicInfo.querySelector(".title-error").classList.remove("hidden");
        hasError = true;
    }
    if (!isValidURL(titleImageUrl)) {
        sectionBasicInfo.querySelector(".url-error").classList.remove("hidden");
        hasError = true;
    }
    if (numQuestions < 3 || isNaN(numQuestions)) { 
        sectionBasicInfo.querySelector(".questions-error").classList.remove("hidden");
        hasError = true;
    }
    if (numLevels < 2 || isNaN(numLevels)) { 
        sectionBasicInfo.querySelector(".levels-error").classList.remove("hidden");
        hasError = true;
    }

    if (!hasError) {
        sectionBasicInfo.querySelectorAll("p").forEach(e => {e.classList.add("hidden")});
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
                        <input type="text" class="question-background-color" placeholder="Cor de fundo da pergunta">
                    </div>
                    <span>Resposta correta</span>
                    <div class="correct-answer">
                        <input type="text" class="correct-answer" placeholder="Resposta correta">
                        <input type="text" class="question-background-color" placeholder="URL da imagem">
                    </div>
                    <span>Respostas incorretas</span>
                    <div class="incorrect-answer">
                        <input type="text" class="incorrect-answer" placeholder="Resposta incorreta 1">
                        <input type="text" class="question-background-color" placeholder="URL da imagem 1">
                    </div>
                    <div class="incorrect-answer">
                        <input type="text" class="incorrect-answer" placeholder="Resposta incorreta 2">
                        <input type="text" class="question-background-color" placeholder="URL da imagem 2">
                    </div>
                    <div class="incorrect-answer">
                        <input type="text" class="incorrect-answer" placeholder="Resposta incorreta 3">
                        <input type="text" class="question-background-color" placeholder="URL da imagem 3">
                    </div>
                </div>
            </div>
        </div>
        `}
}

function toggleCollapsedQuestion(select) {
    select.classList.toggle("closed");
    
    const content = select.nextElementSibling;

    if (content.style.maxHeight) content.style.maxHeight = null;
    else content.style.maxHeight = content.scrollHeight + "px";
}


function checkQuizzQuestions() {
    questionText = sectionQuizzQuestions.querySelector(".question-text").value;
    backgroundColorQuestion = sectionQuizzQuestions.querySelector(".question-text").value;
    answerText = sectionQuizzQuestions.querySelector(".question-text").value;
    //Incompleto.
}


function isValidURL(url) {
    let result = url.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    return (result !== null);
}

//changePage(sectionQuizzQuestions);/*teste*/
//drawQuizzQuestions(); /*teste*/
