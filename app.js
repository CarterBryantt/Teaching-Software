let questionCount = 10;
let difficulties = ["easy", "medium", "hard"];
let types = ["multiple", "boolean"]
let url = `https://opentdb.com/api.php?amount=${questionCount}&category=9&difficulty=${difficulties[1]}&type=${types[0]}`;
fetch(url).then(response => response.json()).then(jsondata => parseQuiz(jsondata));

let answerIndicies = [];
let questions
let activeQuestion = 0;
let selectedAnswer;
let answers;
let endScreens;
let buttons;

let randomSubmitPhrases = ["Shoot for the stars", "I think I've got it!", "I'm feeling lucky!", "I know this one!", "Got it!", "Clear as day.", "For the big bucks!", "Show me the money!"];

function shuffleArray(arr) {
	let currentIndex = arr.length;
	let randomIndex;

	while (currentIndex != 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		[arr[currentIndex], arr[randomIndex]] = [arr[randomIndex], arr[currentIndex]];
	}

	return arr;
}

function parseQuiz(json) {
	let quiz = document.createElement('div');
	quiz.classList.add('quiz');
	for (let i = 0; i < json.results.length; i++) {
		let result = json.results[i];

		let container = document.createElement('div')
		container.classList.add('question');

		let question = document.createElement('h3');
		question.innerHTML = result.question;

		container.appendChild(question);
		
		let orderedList = document.createElement('ol');
		result.incorrect_answers.push(result.correct_answer)
		let shuffledQuestions = shuffleArray(result.incorrect_answers);
		for (let i = 0; i < shuffledQuestions.length; i++) {
			let listItem = document.createElement('li');
			listItem.classList.add('option-interact');
			listItem.innerHTML = shuffledQuestions[i];
			orderedList.appendChild(listItem);
		}
		
		container.appendChild(orderedList);
		let submit = document.createElement('div');
		submit.classList.add('submit-button', 'button', 'button-interact');
		submit.innerHTML = "<span class=\"material-icons-outlined\">stars</span>" + randomSubmitPhrases[Math.floor(Math.random() * randomSubmitPhrases.length)];
		container.appendChild(submit);

		quiz.appendChild(container);
		answerIndicies.push(shuffledQuestions.indexOf(result.correct_answer));
		// let answer = document.createElement('div');
		// answer.classList.add('answer');
		// let incorrect = document.createElement('p');
		// incorrect.classList.add('incorrect');
		// incorrect.innerHTML = result.answer.incorrect;
		// answer.appendChild(incorrect);
		// let correct = document.createElement('p');
		// correct.classList.add('correct');
		// correct.innerHTML = result.answer.correct;
		// answer.appendChild(correct);
		// quiz.appendChild(answer);
	}
	document.body.appendChild(quiz);
	setup();
}

function updateQuiz() {
	for (let i = 0; i < questions.length; i++) {

		if (i < activeQuestion) {
			questions[i].children[0].style.backgroundColor = 'var(--question-null)';
			buttons[i].classList.remove('button-interact');
			buttons[i].style.backgroundColor = 'var(--button-null)';
			let questionOptions = questions[i].children[1].children;
			for (let j = 0; j < questionOptions.length; j++) {
				questionOptions[j].classList.remove('option-interact');

				if (i == activeQuestion - 1) {
					questionOptions[j].style.backgroundColor = 'var(--option-null)';
					questionOptions[answerIndicies[i]].style.backgroundColor = 'var(--option-correct)';
					questionOptions[selectedAnswer].style.backgroundColor = selectedAnswer == answerIndicies[i] ? 'var(--option-correct)' : 'var(--option-incorrect)';
				} // Color last question's options
			}
		}

		if (i <= activeQuestion) {
			questions[i].style.display = "block";
			continue;
		}

		questions[i].style.display = "none";
	}

	selectedAnswer = undefined;

	window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

function setup() {
	questions = document.querySelectorAll('.question');
	answers = document.querySelectorAll('.answer');
	buttons = document.querySelectorAll('.button');
	
	for (let i = 0; i < questions.length; i++) {
		let questionOptions = questions[i].children[1].children;
		for (let j = 0; j < questionOptions.length; j++) {
			questionOptions[j].addEventListener('click', () => {
				if (i != activeQuestion) return;
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
			if (selectedAnswer == undefined) return;
			if (i == activeQuestion) {
				activeQuestion++;
				updateQuiz();
			}
		});
	}
	
	updateQuiz();
}
