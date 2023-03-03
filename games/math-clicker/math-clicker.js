const refresh = 100;
const currencySpan = document.getElementById("currency");
const totalEarnedSpan = document.getElementById("total-earned");
const inputSpan = document.getElementById("type-input");
const inputArea = document.getElementById("input-area");
const problemSpan = document.getElementById("problem-span");
const currencyName = "Solves";
const decimalPlaces = 2;

let currency = 0;
let totalEarned = 0;
let allowNegatives = false;

function incCurrency(inc){
	currency += inc;
	totalEarned += inc;
}

Number.prototype.getSolution = function () {
	return this.valueOf();
}
Number.prototype.isSimple = function () {
	return false;
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
	
	isSimple() {
		return !isNaN(this.#problemLeft) && !isNaN(this.#problemRight);
	}
	
	getLeft(){
		return this.#problemLeft;
	}
	
	getRight(){
		return this.#problemRight;
	}
	
	getOp(){
		return this.#operator;
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
	
	static backColor = '#E1E1E1';
	static hoverColor = '#DADADA';
	static clickColor = '#CACACA';
	name;
	price;
	speed;
	desc;
	maxCount;
	maxed = false;
	unlocked = false;
	count = 0;
	ticker = 1000;
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
		this.maxCount = 500 / (refresh * speed);
	}
	
	buy() {
		if(currency >= this.price && this.count < this.maxCount){
			currency -= this.price;
			this.count++;
			if(this.count == 1){
				levelUp();
			}
			
			if(this.count >= this.maxCount){
				levelUp();
				this.maxed = true;
			}
		}
	}
	
	createStoreElement() {
		this.storeElement = document.createElement('li');
		this.storeElement.setAttribute('id', "store-" + this.name);
		this.storeElement.setAttribute('class', "store-entry");
		
		this.elementTitle = document.createElement('div');
		this.elementTitle.textContent = this.name + " (" + this.price + ")";
		this.storeElement.appendChild(this.elementTitle);
		
		this.elementDesc = document.createElement('span');
		this.elementDesc.textContent = this.desc;
		this.storeElement.appendChild(this.elementDesc);
		
		this.elementState = document.createElement('span');
		this.elementState.textContent = this.count + " Owned. " + (this.speed * this.count).toFixed(2) + " Solves/sec.";
		if(this.maxed){
			this.elementState.textContent += " (MAX)";
		}
		this.storeElement.appendChild(this.elementState);
		
		this.storeElement.addEventListener('mousedown', this.mouseDown.bind(this));
		this.storeElement.addEventListener('mouseover', this.mouseOver.bind(this));
		
		this.storeElement.addEventListener('mouseup', this.mouseOver.bind(this));
		this.storeElement.addEventListener('mouseleave', this.mouseLeave.bind(this));
	}
	
	unlock() {
		this.unlocked = true;
	}
	
	solveProblem(problem) {}
	
	tick() {
		if(this.ticker > 0){
			this.ticker -= this.speed * this.count * refresh;
		} else {
			this.solveProblem(problemManager.currentProblem);
			this.ticker = 1000;
		}
	}
	
	mouseDown(event) {
		this.storeElement.style.backgroundColor = Solver.clickColor;
		this.buy();
	}
	
	mouseLeave(event) {
		this.storeElement.style.backgroundColor = Solver.backColor;
	}
	
	mouseOver(event) {
		this.storeElement.style.backgroundColor = Solver.hoverColor;
	}
	
	draw() {
		this.elementTitle.textContent = this.name + " (" + this.price + ")";
		this.elementState.textContent = this.count + " Owned. " + (this.speed * this.count).toFixed(2) + " Solves/sec.";
		if(this.maxed){
			this.elementState.textContent += " (MAX)";
		}
	}
}

class Adder extends Solver {
	static desc = "A little bird who can solve inner addition problems...";
	constructor(){
		super('Adder', 15, 0.1, Adder.desc);
	}
	
	solveProblem(problem){
		if(problem.isSimple() || !isNaN(problem)){
			return false;
		} else if(problem.getLeft().isSimple() && problem.getLeft().getOp() == '+'){
			problem.solveLeft();
			return true;
		} else if(problem.getRight().isSimple() && problem.getRight().getOp() == '+'){
			problem.solveRight();
			return true;
		} else if(this.solveProblem(problem.getLeft())){
			return true;
		} else if(this.solveProblem(problem.getRight())){
			return true;
		} else {
			return false;
		}
	}
}

class Subtractor extends Solver {
	static desc = "A large panda who can solve inner subtraction problems...";
	constructor(){
		super('Subtractor', 40, 0.1, Subtractor.desc);
	}
	
	solveProblem(problem){
		if(problem.isSimple() || !isNaN(problem)){
			return false;
		} else if(problem.getLeft().isSimple() && problem.getLeft().getOp() == '-'){
			problem.solveLeft();
			return true;
		} else if(problem.getRight().isSimple() && problem.getRight().getOp() == '-'){
			problem.solveRight();
			return true;
		} else if(this.solveProblem(problem.getLeft())){
			return true;
		} else if(this.solveProblem(problem.getRight())){
			return true;
		} else {
			return false;
		}
	}
}

class Multiplier extends Solver {
	static desc = "A wise tortoise who can solve inner multiplication problems...";
	constructor(){
		super('Multiplier', 100, 0.03, Multiplier.desc);
	}
	
	solveProblem(problem){
		if(problem.isSimple() || !isNaN(problem)){
			return false;
		} else if(problem.getLeft().isSimple() && problem.getLeft().getOp() == 'x'){
			problem.solveLeft();
			return true;
		} else if(problem.getRight().isSimple() && problem.getRight().getOp() == 'x'){
			problem.solveRight();
			return true;
		} else if(this.solveProblem(problem.getLeft())){
			return true;
		} else if(this.solveProblem(problem.getRight())){
			return true;
		} else {
			return false;
		}
	}
}

function randomInt(max){
  return Math.floor(Math.random() * max);
}

const problemManager = {
	currentProblem: new Problem(4, '+', 6),
	
	ops: {'+':25, '-':25, 'x':12},
	
	leftProblemCount: 0,
	
	rightProblemCount: 0,
	
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
			incCurrency(1 + this.leftProblemCount + this.rightProblemCount);
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
	entries : [new Adder(), new Subtractor(), new Multiplier()],
	unlocked : 1,
	buyMenu: document.getElementById('buy-menu'),
	
	setupMenu() {
		this.buyMenu.innerHTML = '';
		for(const entry of this.entries.slice(0, this.unlocked)){
			this.buyMenu.appendChild(entry.storeElement);
		}
	},
	
	unlockNext(){
		if(this.entries.length > this.unlocked){
			const entry = this.entries[this.unlocked];
			entry.unlock();
			this.unlocked++;
			this.buyMenu.appendChild(entry.storeElement);
		}
	},
	
	tick(){
		for(const entry of this.entries.slice(0, this.unlocked)){
			entry.tick();
		}
	},
	
	draw(){
		for(const entry of this.entries.slice(0, this.unlocked)){
			entry.draw();
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

function levelUp() {
	store.unlockNext();
	problemManager.increaseDifficulty();
}

function drawCurrency(){
	currencySpan.textContent = currency + " " + currencyName + ".";
}

function drawTotalEarned(){
	totalEarnedSpan.textContent = totalEarned + " Total " + currencyName + ".";
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
	drawTotalEarned();
	store.draw();
	store.tick();
}

function gameLoop(){
	drawGame();
	setTimeout( () => {gameLoop()}, refresh);
}

document.addEventListener("keydown", typeListener);

store.setupMenu();
problemManager.switchProblem();
gameLoop();