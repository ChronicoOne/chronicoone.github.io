const FAIL = 0;
const SUCCESS = 1;
const PROCEED = 2;

const threeWordPhrases = [
  "Blue sky above",
  "Peaceful river flows",
  "Gentle breeze whispers",
  "Chasing dreams endlessly",
  "Golden sunsets linger",
  "Silent night descends",
  "Laughing with friends",
  "Warm fireside conversations",
  "Coffee in hand",
  "Rainy days bring",
  "Books transport us",
  "Love conquers all",
  "Starlit skies shine",
  "Morning dew glistens",
  "Children playing outside",
  "Nature's beauty inspires",
  "Endless possibilities await",
  "Music soothes souls",
  "Hope springs eternal",
  "New beginnings flourish",
  // Add more phrases here...
  "Whispers in shadows",
  "Colors of autumn",
  "Ocean waves crash",
  "Whispering wind calls",
  "Adventure awaits you",
  "Dancing under stars",
  "Infinite possibilities arise",
  "Lost in thought",
  "Eyes wide open",
  "Joyful hearts sing",
  "Learning never ends",
  "Happiness fills hearts",
  "Walking through history",
  "Bright stars twinkle",
  "Changing seasons bring",
  "Magic in the air",
  "Guided by stars",
  "Dreams come true",
  "Life's sweet surprises",
  "Laughter heals wounds",
  "Calm waters flow",
  "Wildflowers in bloom",
  // Continue adding more phrases as needed...
];

class TypeBox {
	
	currentWord;
	typedString;
	typeDiv;
	typeSpan;
	failSpan;
	wordSpan;
	boxStatus;
	
	constructor(masterElem, startWord){
		// Set up html Elements
		this.typeDiv = document.createElement("div");
		this.typeDiv.className = "tdiv-in-progress";
		this.typeSpan = document.createElement("span");
		this.typeSpan.className = "type-span";
		this.failSpan = document.createElement("span");
		this.failSpan.className = "fail-span";
		this.wordSpan = document.createElement("span");
		this.wordSpan.className = "word-span";
		this.typeDiv.appendChild(this.typeSpan);
		this.typeDiv.appendChild(this.failSpan);
		this.typeDiv.appendChild(this.wordSpan);
		masterElem.appendChild(this.typeDiv);
		
		// Reset Box with startWord
		this.resetBox(startWord);
		
	}
	
	getNextLetter(){
		return this.currentWord.substring(this.typedString.length, this.typedString.length + 1);
	}
	
	resetBox(word){
		this.currentWord = word;
		this.typedString = "";
		this.failSpan.textContent = "";
		this.boxStatus = PROCEED;
		this.typeDiv.className = "tdiv-in-progress";
		this.update();
	}
	
	update(){
		this.typeSpan.textContent = this.typedString;
		this.wordSpan.textContent = this.currentWord.substring(this.typedString.length, this.currentWord.length);
	}
	
	fail(letter){
		this.boxStatus = FAIL;
		this.failSpan.textContent = letter;
		this.wordSpan.textContent = this.currentWord.substring(this.typedString.length + 1, this.currentWord.length);
		this.typeDiv.className = "tdiv-failure";
	}
	
	success(){
		this.update();
		this.boxStatus = SUCCESS;
		this.typeDiv.className = "tdiv-success";
	}
	
	typeChar(letter){
		
		if(this.boxStatus != PROCEED){return null;}
		
		const newString = this.typedString + letter;
		
		// Check if typedString matches beginning of currentWord
		const typingCorrect = this.currentWord.substring(0, newString.length) == newString;
		// Check if word is completely typed
		const typingSuccess = this.currentWord == newString;
		
		if(typingSuccess){
			this.typedString = newString;
			this.success();

		} else if(typingCorrect) {
			this.typedString = newString;
			this.update();
			this.boxStatus = PROCEED;
		} else {
			this.fail(letter);
		}
	}
	
}

class Vocab {
	wordList;
	currentWord;
	
	constructor(wordList){
		this.wordList = wordList;
		this.newWord();
	}

	newWord(){
		const index = Math.round(Math.random() * (this.wordList.length - 1));
		this.currentWord = this.wordList[index];
		return this.currentWord;
	}
}

class Typer {
	static tickLength = 20;
	static failureDamage = 5;
	maxHealth;
	health;
	attackDamage;
	target;
	typerUI;
	typerInfo;
	healthBar;
	healthBarOutline;
	healthText;
	typeBox;
	vocab;
	timeout;
	timer;
	
	constructor(masterElem, health, attackDamage){
		this.health = health;
		this.maxHealth = health;
		this.attackDamage = attackDamage;
		this.target = null;
		
		this.typerUI = document.createElement("div");
		this.typerInfo = document.createElement("div");
		this.healthBarOutline = document.createElement("div");
		this.healthBar = document.createElement("div");
		this.healthText = document.createElement("span");
		this.healthBarOutline.appendChild(this.healthBar);
		
		this.typerUI.appendChild(this.typerInfo);
		this.typerUI.appendChild(this.healthBarOutline);
		this.typerUI.appendChild(this.healthText);
		masterElem.appendChild(this.typerUI);	
		
		this.typerUI.setAttribute("class", "ui");
		this.typerInfo.setAttribute("class", "typer-info");
		this.healthBarOutline.setAttribute("class", "health-bar-outline");
		this.healthBar.setAttribute("class", "health-bar");
		this.healthText.setAttribute("class", "health-text");
		this.updateUI();
		
		this.typeBox = new TypeBox(masterElem, "Ready");
		this.vocab = new Vocab(threeWordPhrases);
		this.timeout = 10;
		this.timer = this.timeout;
	}
	
	attack(){
		if(this.target){
			this.target.damage(this.attackDamage * this.typeBox.currentWord.length);
		}
	}
	
	damage(amount){
		this.health -= Math.round(amount);
		if(this.health <= 0){
			this.die();
		}
		this.updateUI();
	}
	
	die(){
		if(this.target){
			this.target.restart()
		}
		this.health = this.maxHealth;
		this.updateUI();
	}
	
	restart(){
		// resets current typer
		this.health = this.maxHealth;
		this.updateUI();
	}
	
	updateUI(){
		this.healthBar.setAttribute("style", "width: " + (this.health * 100 / this.maxHealth) + "%");
		this.healthText.textContent = this.health + "/" + this.maxHealth;
	}
	
	onSuccess(){
		this.attack();
	}
	
	onFailure(){
		this.damage(Typer.failureDamage);
	}
	
	typeLoop() {
		const countDone = (this.timer == 0);
		const countStart = (this.timer == this.timeout);
		
		if(this.typeBox.boxStatus == SUCCESS){
			if(countDone){
				this.typeBox.resetBox(this.vocab.newWord());
				this.timer = this.timeout;
				// Make player deal damage
			} else {
				if(countStart){
					this.onSuccess();
				}
				this.timer--;
			}
		} else if(this.typeBox.boxStatus == FAIL) {
			if(countDone){
				this.typeBox.resetBox(this.vocab.newWord());
				this.timer = this.timeout;
				//Make player take damage
			} else {
				if(countStart){
					this.onFailure();
				}
				this.timer--;
			}
		}
		
		setTimeout( () => {this.typeLoop();}, Typer.tickLength);
	}
	
	type(letter) {
		this.typeBox.typeChar(letter);
	}
	
}

class Player extends Typer {
	
	constructor(uiParent, health, attackDamage){
		super(uiParent, health, attackDamage);
		this.typerUI.setAttribute("id", "player-ui");
		this.healthBarOutline.setAttribute("id", "player-health-bar-outline");
		this.healthBar.setAttribute("id", "player-health-bar");
		
		this.typerInfo.textContent = "Player";
	}
	
}

class Monster extends Typer {
	
	typeSpeed;
	typeAccuracy;
	level;
	
	constructor(uiParent, level){
		const health = 100 + (level * 5);
		const attackDamage = 1 + (level / 5);
		super(uiParent, health, attackDamage);
		
		this.level = level;
		this.typeSpeed = 1 + (level / 20);
		this.typeAccuracy = Math.min(0.95 + (level / 1000), 1);
		
		this.typerUI.setAttribute("id", "monster-ui");
		this.healthBarOutline.setAttribute("id", "monster-health-bar-outline");
		this.healthBar.setAttribute("id", "monster-health-bar");
		this.updateUI();
	}
	
	levelUp(){
		this.level++;
		this.maxHealth = 100 + (this.level * 5);
		this.attackDamage = 1 + (this.level / 5);
		this.typeSpeed = 1 + (this.level / 20);
		this.typeAccuracy = Math.min(0.95 + (this.level / 1000), 1);
	}
	
	die(){
		this.levelUp();
		
		if(this.target){
			this.target.restart()
		}
		
		this.health = this.maxHealth;
		this.updateUI();
	}
	
	updateUI(){
		this.healthBar.setAttribute("style", "width: " + (this.health * 100 / this.maxHealth) + "%");
		this.healthText.textContent = this.health + "/" + this.maxHealth;
		this.typerInfo.textContent = "Monster lvl. " + this.level;
	}
	
	battleLoop(){
		const nextLetter = this.typeBox.getNextLetter();
		if(Math.random() > this.typeAccuracy){
			this.type(String.fromCharCode(nextLetter.charCodeAt(0) + 1));
		} else {
			this.type(nextLetter);
		}
		
		setTimeout( () => {this.battleLoop();}, 1000 / this.typeSpeed);
	}
}

gameArea = document.getElementById("game-area");

monsterStage = document.createElement("div");
monsterStage.setAttribute("id", "monster-stage");
playerStage = document.createElement("div");
playerStage.setAttribute("id", "player-stage");

gameArea.appendChild(playerStage);
gameArea.appendChild(monsterStage);


player = new Player(playerStage, 100, 1); 
player.typeLoop();

monster = new Monster(monsterStage, 1); 
monster.typeLoop();
monster.battleLoop();
monster.target = player;
player.target = monster;

function typeListener(event) {
	if(event.key.length == 1){
		player.type(event.key);
	}
}

document.addEventListener("keydown", typeListener);
