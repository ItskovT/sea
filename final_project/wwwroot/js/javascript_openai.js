const baseUrl = "https://localhost:7036/api/";

let questionCount = 0;

let nextButton = null;

async function getQuestion() {

    document.getElementById("generate-button").style.display = "none";

    const subject = document.getElementById("subject").value;
    const level = document.getElementById("levels").value;
    const language = document.getElementById("languages").value;

    const prompt = {
        "Subject": subject,
        "Level": level,
        "Language": language
    };

    const url = baseUrl + "GPT/GPTChat";
    const params = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(prompt)
    };

    const response = await fetch(url, params);
    
    if (response.ok) {
        let data = await response.json();
        data = JSON.parse(data);

        const currentQuestionIndex = questionCount;
        const questionContainer = document.createElement("div");
        questionContainer.className = "question-container";

        const questionItem = document.createElement("li");
        const questionText = document.createTextNode(data.question);
        questionItem.appendChild(questionText);
        questionContainer.appendChild(questionItem);

        const answersList = document.createElement("ul");
        answersList.className = "answers-list";

        data.answers.forEach((answer) => {
            const answerItem = document.createElement("li");
            const label = document.createElement("label");
            const radioButton = document.createElement("input");
            radioButton.type = "radio";
            radioButton.name = "answers" + questionCount;
            radioButton.value = answer;
            label.appendChild(radioButton);
            label.appendChild(document.createTextNode(answer));
            answerItem.appendChild(label);
            answersList.appendChild(answerItem);
        });

        questionContainer.appendChild(answersList);

        const feedbackElement = document.createElement("div");
        questionContainer.appendChild(feedbackElement);

        const checkButton = document.createElement("button");
        checkButton.textContent = "בדיקה";
        checkButton.classList.add("button_yellow");
        questionContainer.appendChild(checkButton);

        const generateButton = document.getElementById("generate-button");

        checkButton.addEventListener("click", () => {
        
            const selectedAnswer = document.querySelector(`input[name="answers${currentQuestionIndex}"]:checked`);
            if (!selectedAnswer) {
                feedbackElement.textContent = "נא לבחור תשובה";
                feedbackElement.style.color = "orange";
            } else {
                checkButton.remove();
                if (selectedAnswer.value === data.right_answer) {
                    feedbackElement.textContent = "תשובה נכונה!";
                    feedbackElement.style.color = "green";
                } else {
                    feedbackElement.textContent = `לא, תשובה נכנונה היא: ${data.right_answer}`;
                    feedbackElement.style.color = "red";
                }
            }
        });

        document.getElementById("questions").appendChild(questionContainer);
        questionCount++;


        if (nextButton) {
            nextButton.remove();
        }

        if (questionCount >= 5) {
            // Показываем текст "סיימת את השאלון, כל הכבוד!" и "חושבים מה עוד אפשר לעשות בים? עברו לעמוד הבא לחיפוש רעיונות מגוונים!"
            const congratsHeader = document.createElement("h3");
            congratsHeader.textContent = "סיימת את השאלון, כל הכבוד!";
            congratsHeader.classList.add("title");
            questionContainer.appendChild(congratsHeader);

            const nextPageText = document.createElement("h5");
            nextPageText.textContent = "חושבים מה עוד אפשר לעשות בים? עברו לעמוד הבא לחיפוש רעיונות מגוונים!";
            nextPageText.classList.add("title_explane");
            questionContainer.appendChild(nextPageText);

            nextButton = document.createElement("button");
            nextButton.textContent = "לעמוד הבא";
            nextButton.classList.add("button_blue");
            nextButton.addEventListener("click", () => {
                window.location.href = 'bored.html';
            });
        } else {
            
            nextButton = document.createElement("button");
            nextButton.textContent = "לשאלה הבאה";
            nextButton.classList.add("button_blue");
            nextButton.onclick = getQuestion;
        }

        questionContainer.appendChild(nextButton);
    } else {
        console.error("Failed to fetch question");
    }

    
}
