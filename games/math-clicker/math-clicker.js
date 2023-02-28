const refresh = 100;
const currencySpan = document.getElementById("currency");
const inputSpan = document.getElementById("type-input");
const problemSpan = document.getElementById("problem-span");
const currencyName = "Solves";
const decimalPlaces = 2;

let currency = 0;

function getValue(x){
	if(!isNaN(x)){
			return x;
		} else {
			return x.getSolution();
	}
}

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
						'*': Problem.multOp,
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
	}
	
	setLeft(problem){
		this.#problemLeft = problem;
		this.#solutionLeft = problem.getSolution();
	}
	
	setRight(problem){
		this.#problemRight = problem;
		this.#solutionRight = problem.getSolution();
	}
	
	getProblemLeft() {
		return this.#problemLeft;
	}
	
	getProblemRight() {
		return this.#problemRight;
	}
	
	getSolution(){
		const op = Problem.operations[this.#operator];
		return op(this.#solutionLeft, this.#solutionRight);
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

function randomInt(max){
  return Math.floor(Math.random() * max);
}

const problemManager = {
	currentProblem: new Problem(4, '+', 6),
	
	ops: {'+':25, '-':25, '*':12},
	
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
			while(op == '*' &&  leftProblem.getSolution() > this.ops['*']){
				op = this.newOp();
			}
			leftProblem = new Problem(leftProblem, op, this.newArg(op));
			op = this.newOp();
			i++;
		}
		
		i = 0;
		let rightProblem = this.newArg(op);
		while(i < this.rightProblemCount){
			while(op == '*' &&  rightProblem.getSolution() > this.ops['*']){
				op = this.newOp();
			}
			rightProblem = new Problem(this.newArg(op), op, rightProblem);
			op = this.newOp();
			i++;
		}
		
		while(op == '*' && ((rightProblem.getSolution() > this.ops['*']) ||  (leftProblem.getSolution() > this.ops['*']))){
				op = this.newOp();
		}
		
		this.currentProblem = new Problem(leftProblem, op, rightProblem);
	},
	
	submitInput() {
		if (this.currentProblem.solved(+inputCollector.currentInput)) {
			currency++;
			this.switchProblem();
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
		inputCollector.clearInput();
	} else if (event.key == 'Delete' || event.key == 'Backspace'){
		inputCollector.backspace();
	}
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