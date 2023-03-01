const refresh = 100;
const currencySpan = document.getElementById("currency");
const inputSpan = document.getElementById("type-input");
const inputArea = document.getElementById("input-area");
const problemSpan = document.getElementById("problem-span");
const currencyName = "Solves";
const decimalPlaces = 2;

let currency = 0;
let allowNegatives = false;

Number.prototype.getSolution = function () {
	return this.valueOf();
}

class Problem {
	static addOp(a, b){
		return a+b;
	}

	static subtractOp(a, b){
		return a-b;
	}

	static multOp(a, b){
		return a*b;
	}

	static divideOp(a, b){
		return a/b;
	}
	
	static operations = {'+': Problem.addOp,
						'-': Problem.subtractOp,
						'x': Problem.multOp,
						'/': Problem.divideOp};
						
	#problemLeft;
	#problemRight;
	#operator;
	
	#solutionLeft;
	#solutionRight;
	
	
	constructor(problemLeft, operator, problemRight) {
		this.#problemLeft = problemLeft;
		this.#operator = operator;
		this.#problemRight = problemRight;
		
		this.#solutionLeft = problemLeft.getSolution();
		this.#solutionRight = problemRight.getSolution();
		
		if(!allowNegatives){
			if(this.getSolution() < 0){
				this.#problemLeft = problemRight;
				this.#solutionLeft = problemRight.getSolution();
				
				this.#problemRight = problemLeft;
				this.#solutionRight = problemLeft.getSolution();
			}
		}
	}
	
	getSolution(){
		const op = Problem.operations[this.#operator];
		return op(this.#solutionLeft, this.#solutionRight);
	}
	
	solveLeft(){
		this.#problemLeft = this.#solutionLeft;
	}
	
	solveRight(){
		this.#problemRight = this.#solutionRight;
	}
	
	toString(){
		return "(" + this.#problemLeft.toString() + " " + this.#operator + " " + this.#problemRight.toString() + ")";
	}
	
	prettyString(){
		const uglyString = this.toString();
		return uglyString.substring(1, uglyString.length - 1);
	}
	
	solved(solution){
		return solution == this.getSolution();
	}
}

class Solver {
	name;
	price;
	speed;
	desc;
	unlocked = false;
	count = 0;
	storeElement;
	elementTitle;
	elementDesc;
	elementState;
	
	constructor(name, price, speed, desc){
		this.name = name;
		this.price = price;
		this.speed = speed;
		this.desc = desc;
		this.createStoreElement();
	}
	
	buy() {
		if(currency >= this.price){
			currency -= this.price;
			this.count++;
		}
	}
	
	createStoreElement() {
		this.storeElement = document.createElement('li');
		this.storeElement.setAttribute('id', "store-" + this.name);
		this.storeElement.setAttribute('class', "store-entry");
		
		this.elementTitle = document.createElement('div');
		this.elementTitle.textContent = this.name;
		this.storeElement.appendChild(this.elementTitle);
		
		this.elementDesc = document.createElement('span');
		this.elementDesc.textContent = this.desc;
		this.storeElement.appendChild(this.elementDesc);
		
		this.elementState = document.createElement('span');
		this.elementState.textContent = "Owned: " + this.count + "  Solves/sec: " + this.speed * this.count;
		this.storeElement.appendChild(this.elementState);
	}
	
	unlock() {
		this.unlocked = true;
	}
}

class Adder extends Solver {
	static desc = "A little man who helps you add...";
	constructor(){
		super('Adder', 15, 0.2, Adder.desc);
	}
}

function randomInt(max){
  return Math.floor(Math.random() * max);
}

const problemManager = {
	currentProblem: new Problem(4, '+', 6),
	
	ops: {'+':25, '-':25, 'x':12},
	
	leftProblemCount: 1,
	
	rightProblemCount:1,
	
	newArg(op) {
		return randomInt(this.ops[op]);
	},
	
	newOp() {
		const keys = Object.keys(this.ops);
		return keys[randomInt(keys.length)];
	},
	
	switchProblem() {
		let i = 0;
		let op = this.newOp();
		let leftProblem = this.newArg(op);
		while(i < this.leftProblemCount){
			while(op == 'x' &&  leftProblem.getSolution() > this.ops['x']){
				op = this.newOp();
			}
			leftProblem = new Problem(leftProblem, op, this.newArg(op));
			op = this.newOp();
			i++;
		}
		
		i = 0;
		let rightProblem = this.newArg(op);
		while(i < this.rightProblemCount){
			while(op == 'x' &&  rightProblem.getSolution() > this.ops['x']){
				op = this.newOp();
			}
			rightProblem = new Problem(this.newArg(op), op, rightProblem);
			op = this.newOp();
			i++;
		}
		
		while(op == 'x' && ((rightProblem.getSolution() > this.ops['x']) ||  (leftProblem.getSolution() > this.ops['x']))){
				op = this.newOp();
		}
		
		this.currentProblem = new Problem(leftProblem, op, rightProblem);
	},
	
	submitInput() {
		if (this.currentProblem.solved(+inputCollector.currentInput)) {
			currency++;
			this.switchProblem();
			inputCollector.clearInput();
		} else {
			wrongAnswer();
		}
	},
	
	increaseDifficulty() {
		if(this.leftProblemCount <= this.rightProblemCount){
			this.leftProblemCount++;
		} else {
			this.rightProblemCount++;
		}
	},
};

const store = {
	entries : [new Adder()],
	buyMenu: document.getElementById('buy-menu'),
	
	setupMenu() {
		this.buyMenu.innerHTML = '';
		for(const entry of this.entries){
			if(entry.unlocked){
				this.buyMenu.appendChild(entry.storeElement);
			}
		}
	},
	
};

const inputCollector = {
	currentInput: '',
	
	collectChar(c) {
		this.currentInput += c;
	},
	
	negate() {
		if (this.currentInput == ''){
			this.currentInput = '-';
		} else if(this.currentInput[0] != '-'){
			this.currentInput = '-' + this.currentInput;
		} else {
			this.currentInput = this.currentInput.substring(1);
		}	
	},
	
	backspace() {
		const len = this.currentInput.length;
		
		if (len > 0){
			this.currentInput = this.currentInput.substring(0, len - 1)
		}
	},
	
	clearInput() {
		this.currentInput = '';
	},
	
};

function typeListener(event) {
	if (!isNaN(event.key)){
		inputCollector.collectChar(event.key);
	} else if(event.key == '-'){
		inputCollector.negate();
	} else if (event.key == 'Enter'){
		problemManager.submitInput();
	} else if (event.key == 'Delete' || event.key == 'Backspace'){
		inputCollector.backspace();
	}
}

function wrongAnswer() {
	inputArea.style.backgroundColor = "#EEE0E0";
	setTimeout( () => {
		inputArea.style.backgroundColor = "#E0EEE0";
		inputCollector.clearInput();
	}, refresh * 5);
}

function drawCurrency(){
	currencySpan.textContent = currency + " " + currencyName;
}

function drawInput(){
	inputSpan.textContent = inputCollector.currentInput;
}

function drawProblem(){
	problemSpan.textContent = problemManager.currentProblem.prettyString();
}

function drawGame(){
	drawProblem();
	drawInput();
	drawCurrency();
}

function gameLoop(){
	drawGame();
	setTimeout( () => {gameLoop()}, refresh);
}

document.addEventListener("keydown", typeListener);

problemManager.switchProblem();
gameLoop();