// function createQuiz() {
// 	let quizDivs = document.querySelector('.quiz').children;

// 	let quiz = [];
// 	for (let i = 0; i < quizDivs.length; i++) {
// 		if (quizDivs[i].classList.contains('question')) {
// 			let children = quizDivs[i].children;
// 			let question = {
// 				"question": children[0].innerHTML,
// 				"options": []
// 			}
// 			for (let i = 1; i < children.length; i++) {
// 				question.options.push(children[i].innerHTML);
// 			}
// 			quiz.push(question);
// 		} else if (quizDivs[i].classList.contains('text')) {
// 			let text = {
// 				"text": quizDivs[i].innerHTML
// 			}
// 			quiz.push(text);
// 		}
// 	}

// 	return quiz;
// }

// function downloadJSON(object, fileName) {
// 	var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(object));
// 	var dlAnchorElem = document.createElement('a');
// 	dlAnchorElem.setAttribute("href", dataStr);
// 	dlAnchorElem.setAttribute("download", fileName + "application/json");
// 	document.body.appendChild(dlAnchorElem);
// 	dlAnchorElem.click();
// 	dlAnchorElem.remove();
// }

// document.getElementById('select-quiz-button').onclick = () => document.getElementById('select-quiz-handler').click(); // Select File Button
// document.getElementById('select-quiz-handler').onchange = (e) => document.getElementById('selected-file').innerHTML = e.target.files[0].name;
// document.getElementById('import-quiz-button').onclick = () => {
// 	let fileReader = new FileReader()
// 	fileReader.onload = (e) => parseQuiz(JSON.parse(e.target.result));
// 	fileReader.readAsText(document.getElementById('select-quiz-handler').files[0]);
// }; // Import File

// let jsonQuiz = JSON.stringify(createQuiz());
// downloadJSON(jsonQuiz, "new-quiz");

fetch("./example-quiz.json").then(response => response.json()).then(jsondata => parseQuiz(jsondata));

let answerIndicies = [];
let questions
let activeQuestion = 0;
let selectedAnswer;
let answers;
let endScreens;

function parseQuiz(json) {
	endScreens = json[json.length-1];
	let quiz = document.createElement('div');
	quiz.classList.add('quiz');
	for (let i = 0; i < json.length; i++) {
		let object = json[i];
		if (object.hasOwnProperty("question")) {
			let container = document.createElement('div');
			container.classList.add('question');
			let question = document.createElement('h3');
			question.innerHTML = object.question;
			container.appendChild(question);
			
			let orderedList = document.createElement('ol');
			for (let i = 0; i < object.options.length; i++) {
				let listItem = document.createElement('li');
				listItem.innerHTML = object.options[i];
				orderedList.appendChild(listItem);
			}
			container.appendChild(orderedList);

			let submit = document.createElement('div');
			submit.classList.add('submit-button', 'button');
			submit.innerHTML = "<span class=\"material-icons-outlined\">stars</span>" + object.submit;
			container.appendChild(submit);
			
			quiz.appendChild(container);

			answerIndicies.push(object.answer.index);
			let answer = document.createElement('div');
			answer.classList.add('answer');
			let incorrect = document.createElement('p');
			incorrect.classList.add('incorrect');
			incorrect.innerHTML = object.answer.incorrect;
			answer.appendChild(incorrect);
			let correct = document.createElement('p');
			correct.classList.add('correct');
			correct.innerHTML = object.answer.correct;
			answer.appendChild(correct);
			quiz.appendChild(answer);
		} else if (object.hasOwnProperty("text")) {
			let text = document.createElement('p');
			text.innerHTML = object.text;
			document.body.appendChild(text);
		}
	}
	document.body.appendChild(quiz);
	setup();
}

function updateQuiz() {
	selectedAnswer = undefined;
	for (let i = 0; i < questions.length; i++) {
		if (i <= activeQuestion) {
			questions[i].style.display = "block";
			continue;
		}

		questions[i].style.display = "none";
	}
}

function setup() {
	questions = document.querySelectorAll('.question');
	answers = document.querySelectorAll('.answer');
	
	for (let i = 0; i < questions.length; i++) {
		let questionOptions = questions[i].children[1].children;
		for (let j = 0; j < questionOptions.length; j++) {
			questionOptions[j].addEventListener('click', () => {
				selectedAnswer = j;
				questionOptions[j].style.setProperty('--before-content', "\'radio_button_checked\'");
				for (let k = 0; k < questionOptions.length; k++) {
					if (questionOptions[k] != questionOptions[j]) {
						questionOptions[k].style.setProperty('--before-content', "\'radio_button_unchecked\'");
					}
				}
			});
		}
	}
	
	
	for (let i = 0; i < document.querySelectorAll('.submit-button').length; i++) {
		document.querySelectorAll('.submit-button')[i].addEventListener('click', () => {
			if (!selectedAnswer) return;
			if (i == activeQuestion) {
				let answerResponses = answers[activeQuestion].children;
				if ((selectedAnswer != answerIndicies[activeQuestion] && answerResponses[0].innerHTML == 'end quiz') || (selectedAnswer == answerIndicies[activeQuestion] && answerResponses[1].innerHTML == 'end quiz')) {
					let index = activeQuestion - (questions.length - endScreens.length);
					console.log("works", index)
					let endScreen = document.createElement('div');
					endScreen.classList.add('end-screen');
					endScreen.innerHTML = endScreens[index].text;
					document.body.appendChild(endScreen);
					return;
				}
				if (selectedAnswer != answerIndicies[activeQuestion]) {
					answerResponses[0].style.display = "block";
				} else {
					answerResponses[1].style.display = "block";
				}
				answers[activeQuestion].style.display = "block";
	
				activeQuestion++;
				updateQuiz();
			}
		});
	}
	
	updateQuiz();
}
