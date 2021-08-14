const mainQuizzCreate = document.querySelector(".quizz-create");
const sectionBasicInfo = document.querySelector(".basic-info");
const sectionQuizzQuestions = document.querySelector(".quizz-questions");
const sectionQuizzLevels = document.querySelector(".quizz-levels");
const sectionQuizzSuccess = document.querySelector(".quizz-success");

function changePage(page) {
    document.querySelectorAll("main section").forEach(e => {e.classList.add("hidden")});
    window.scrollTo({top: 0, left: 0, behavior: 'auto'});
    mainQuizzCreate.classList.remove("hidden");
    page.classList.remove("hidden");
}

function checkBasicInfo() {
    const titleLength = sectionBasicInfo.querySelector(".your-quizz-title").value.length;
    if (titleLength >= 20 && titleLength <= 65) {
        return "É valido.";
    } else {
        sectionBasicInfo.querySelector(".title-error").classList.remove("hidden");
    }
}

changePage(sectionBasicInfo);