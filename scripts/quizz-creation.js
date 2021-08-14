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
    let hasError = false;

    if (titleLength < 20 || titleLength > 65) { 
        sectionBasicInfo.querySelector(".title-error").classList.remove("hidden");
        hasError = true;
    }
    if (!isValidURL(sectionBasicInfo.querySelector(".url-img").value)) {
        sectionBasicInfo.querySelector(".url-error").classList.remove("hidden");
        hasError = true;
    }
    if (sectionBasicInfo.querySelector(".number-questions").value < 3) { 
        sectionBasicInfo.querySelector(".questions-error").classList.remove("hidden");
        hasError = true;
    }
    if (sectionBasicInfo.querySelector(".number-levels").value < 2) { 
        sectionBasicInfo.querySelector(".levels-error").classList.remove("hidden");
        hasError = true;
    }
    
    if (!hasError) {
        sectionBasicInfo.querySelectorAll("p").forEach(e => {e.classList.add("hidden")});
        return true;
    }
}

function isValidURL(url) {
    let result = url.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    return (result !== null);
}

changePage(sectionBasicInfo);