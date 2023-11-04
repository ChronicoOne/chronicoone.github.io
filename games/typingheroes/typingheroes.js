const FAIL = 0;
const SUCCESS = 1;
const PROCEED = 2;

const uniqueWordsAndPhrases = [
  "about to",
  "above all",
  "absolutely",
  "after all",
  "according to",
  "actually",
  "add up",
  "all of a sudden",
  "all the best",
  "along the way",
  "although",
  "almost",
  "an amazing time",
  "any chance",
  "around the clock",
  "as a matter of fact",
  "as far as I know",
  "as soon as possible",
  "at first glance",
  "at the same time",
  "at your earliest convenience",
  "back and forth",
  "back to the drawing board",
  "bear in mind",
  "better late than never",
  "between you and me",
  "by all means",
  "by chance",
  "by the way",
  "call it a day",
  "can't wait",
  "catch up",
  "change your mind",
  "cheer up",
  "come to think of it",
  "cut to the chase",
  "did you know that",
  "don't forget",
  "don't worry about it",
  "drop in the bucket",
  "easy as pie",
  "every now and then",
  "fair enough",
  "fall into place",
  "far and wide",
  "feel free",
  "few and far between",
  "figure something out",
  "find out",
  "for crying out loud",
  "for good measure",
  "for the first time",
  "for the sake of argument",
  "get along with",
  "get back to you",
  "get going",
  "get in touch",
  "get over it",
  "give it a try",
  "go ahead",
  "go figure",
  "go for it",
  "go the extra mile",
  "good luck",
  "got it?",
  "got to go",
  "had a blast",
  "hang on a minute",
  "happy to help",
  "hard to say",
  "have fun",
  "here we go",
  "hold on",
  "hold your breath",
  "honest to God",
  "how about",
  "I couldn't agree more",
  "I don't think so",
  "I feel you",
  "I see what you mean",
  "I'm all ears",
  "I'm in",
  "I'm listening",
  "I'm on it",
  "I'm with you",
  "in a nutshell",
  "in case you didn't know",
  "in other words",
  "in the meantime",
  "it's a good thing",
  "it's all good",
  "it's up to you",
  "just kidding",
  "keep in touch",
  "let me know",
  "let's face it",
  "let's roll",
  "likewise",
  "listen up",
  "long time no see",
  "make a difference",
  "make sense?",
  "my bad",
  "never mind",
  "no problem",
  "not at all",
  "not to mention",
  "now or never",
  "no way",
  "no worries",
  "no wonder",
  "off the cuff",
  "on the other hand",
  "on the same page",
  "once in a while",
  "out of the question",
  "over and done with",
  "piece of cake",
  "please and thank you",
  "point in case",
  "put another way",
  "right on",
  "see you around",
  "see you later",
  "take care",
  "take it easy",
  "that's for sure",
  "that's all folks",
  "the best of luck",
  "think again",
  "this and that",
  "to be honest",
  "to make a long story short",
  "to put it another"]
  
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

const fightingWords = [
  "Arise, my minions!",
  "As I have sworn!",
  "Avenge my family!",
  "Beware my wrath!",
  "Bring it on, beast!",
  "By my power, I command you!",
  "Cease your foulness!",
  "Come at me, bro!",
  "Coward! Face me!",
  "Die, fiend, die!",
  "Do not defy me!",
  "Draw your weapon!",
  "Eat my dust!",
  "En garde, foul beast!",
  "Enough of your games!",
  "Experience my fury!",
  "Face your doom!",
  "Fall, monster!",
  "Feel my wrath!",
  "Fight me, you coward!",
  "For glory!",
  "For the kingdom!",
  "Foul creature, be gone!",
  "Get thee hence!",
  "Give up now, and be spared!",
  "Have at thee!",
  "Heed my command!",
  "I am not afraid of you!",
  "I will not be defeated!",
  "I will send you back to hell!",
  "I'll carve you up!",
  "I'll grind your bones to dust!",
  "I'll make you pay!",
  "In the name of all that is good!",
  "It's over for you, monster!",
  "Kneel before me!",
  "Let the battle begin!",
  "May the gods protect me!",
  "My blade hungers for your blood!",
  "My power is too great for you!",
  "None shall escape my wrath!",
  "On your guard!",
  "Prepare to meet your maker!",
  "Prepare to be vanquished!",
  "Relish your final moments!",
  "Repent, sinner!",
  "Stand down, or face my wrath!",
  "Take this!",
  "Taste my power!",
  "That's all you've got?",
  "This is for all the lives you've taken!",
  "Thou art no match for me!",
  "Tremble before me!",
  "Unhand me, beast!",
  "Unleash your fury!",
  "Very well, then. Die!",
  "What are you waiting for? Attack!",
  "Where is your courage now?",
  "You are no match for my skills!",
  "You will die today!",
  "Your time has come!",
];

const fightingInsults = [
  "You worthless maggot!",
  "You hideous creature!",
  "You foul abomination!",
  "You despicable wretch!",
  "You loathsome fiend!",
  "You vile beast!",
  "You putrid scum!",
  "You wretched miscreant!",
  "You miserable vermin!",
  "You abhorrent creature!",
  "You despicable fiend!",
  "You disgusting maggot!",
  "You vile monster!",
  "You wretched scum!",
  "You miserable vermin!",
  "You abominable fiend!",
  "You despicable wretch!",
  "You foul abomination!",
  "You hideous creature!",
  "You loathsome miscreant!",
  "You miserable vermin!",
  "You putrid scum!",
  "You vile beast!",
  "You wretched scum!",
  "You abhorrent creature!",
  "You despicable fiend!",
  "You disgusting maggot!",
  "You vile monster!",
  "You wretched scum!",
  "You miserable vermin!",
  "You contemptible cur!",
  "You degenerate fiend!",
  "You loathsome vermin!",
  "You miserable maggot!",
  "You putrid monster!",
  "You vile creature!",
  "You wretched wretch!",
];

const monsterPhrases = [
  "Prepare to meet your doom, hero!",
  "I hunger for your fear!",
  "You can't escape the darkness!",
  "Witness true evil's power!",
  "Your bravery is futile!",
  "Your fate is sealed!",
  "This is the end for you!",
  "I'll crush you like an insect!",
  "I am darkness incarnate!",
  "Your destiny ends here!",
  "I relish your despair!",
  "Your hope is fleeting!",
  "I'll feast on your soul!",
  "Your valor wanes!",
  "You're no match for me!",
  "Surrender, and I may spare you!",
  "No mercy for you!",
  "Shadows are my allies!",
  "Escape your fate?",
  "I'm your nightmare!",
  "Courage is empty!",
  "I'll enjoy tearing you apart!",
  "Your death is my masterpiece!",
  "Enter a realm of terror!",
  "Darkness consumes you!",
  "I'm amused by your struggles!",
  "Serve as my amusement!",
  "No hope, only despair!",
  "Fear in your eyes!",
  "Defiance is futile!",
  "This battle is your last!",
  "Bathe in your fear!",
  "I'm the warned monster!",
  "Unending terror!",
  "Your presence, a mistake!",
  "Rue the day you crossed me!",
  "I bring ultimate demise!",
  "No escape from fate!",
  "Worthy opponent at last!",
  "Your life is forfeit!",
  "I savor your suffering!",
  "Courage can't match my power!",
  "Darkness and doom are eternal!",
];

// You can access these phrases using monsterPhrases[index], where index is the desired phrase.



const fullWordList = threeWordPhrases.concat(uniqueWordsAndPhrases).concat(fightingWords).concat(fightingInsults);

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
		
		this.typeBox = new TypeBox(masterElem, "Ready?");
		this.vocab = new Vocab(fullWordList);
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
		
		this.typeBox.resetBox("Ready?");
		this.health = this.maxHealth;
		this.updateUI();
	}
	
	restart(){
		// resets current typer
		this.health = this.maxHealth;
		this.typeBox.resetBox("Ready?");
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
		this.vocab.wordList = monsterPhrases;
		
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
		
		this.typeBox.resetBox("Ready?");
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
