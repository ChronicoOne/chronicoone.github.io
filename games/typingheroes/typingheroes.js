// Author: Connor Bowman 
// This code was written solely to be used on the chronico.one site for entertainment.

// In honor of Roshan's 21st birthday

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
  "if it doesn't kill you",
  "that's impossible",
  "payment will come due",
  "can't keep going",
  "destruction is inevitable",
  "take your last breath",
  "it will be sweet",
  "I have the launch codes",
  "surrender, foul beast",
  "the time has come",
  "it's all over",
  "about those teeth",
  "for those toenails",
  "so freaking ugly",
  "get out of here",
  "you're bound to lose",
  "I get a little lonely",
  "thinking about us",
  "scoop me up",
  "the end is near",
  "face me IRL",
  "I'll end you",
  "put up your dukes",
  "the incoming skull pound",
  "you're gonna be shattered",
  "into a million tiny pieces",
  "engaging turbo drive",
  "are you my dad?",
  "all of these taxes",
  "my fingers are mighty",
  "you keyboard warrior",
  "I'll blend you",
  "into a charcuterie display",
  "blasting your brain out",
  "into the pavement",
  "you dumb idiot",
  "stay away, you stink",
  "gigantic fool",
  "you were a mistake",
  "GGEZ",
  "get lost bum",
  "I could destroy you",
  "but I'll take it easy on you",
  "you are just",
  "a loser and a freak",
  "but you're just",
  "you could do better",
  "it's not that hard",
  "just get good",
  "touch grass brother",
  "I can not believe",
  "breathe again. I dare you.",
  "at the end of the road pal",
  "sorry it has to be this way",
  "no hard feelings",
  "you ruined my day",
  "you deserve to rot",
  "1990 called",
  "the exorcist called",
  "my backup is here",
  "just kidding",
  "the dinosaurs called",
  "my grandma called",
  "look out for losers",
  "they want their pants back",
  "they said you're stupid",
  "they want their nose back",
  "she wants her lumps back",
  "they told me you suck",
  "or I'll come after you",
  "bring a weapon",
  "but who cares",
  "I'll call your mom",
  "tell her you're dead",
  "off a cliff",
  "or something similar",
  "I'll turn you",
  "I'll rip you",
  "I'll slice you",
  "I'll stab you",
  "I'll cook you",
  "I'll tear you",
  "all over your apartment",
  "in your neighbor's yard"
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

function svgFromXml(xmlString){
	const parser = new DOMParser();
	const xmlDoc = parser.parseFromString(xmlString, 'image/svg+xml');
	const svgElement = xmlDoc.querySelector('svg');
	return svgElement;
}

const heartSvgString = '<svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 210.47 168.73">' +
  '<defs>' +
    '<style>' +
      '.cls-1{fill:#6a1054;}.cls-1,.cls-2,.cls-3,.cls-4,.cls-5{stroke-width:0px;}.cls-3{fill:#f8f6c2;}.cls-4{fill:#624da0;}.cls-5{fill:#8a181a;}.cls-6{fill:#231f20;}.cls-6,.cls-7{stroke:#000;stroke-linejoin:round;stroke-width:8px;}.cls-7{fill:none;}' +
    '</style>' +
  '</defs>' +
  '<g id="heart">' +
    '<path class="cls-5" d="m104.96,164.73c-.91,0-1.83-.31-2.57-.94L22.63,96.8C4.84,81.76-.79,57.53,8.29,35.06,15.03,18.37,35.37,4.45,53.62,4.03c1-.02,1.99-.03,2.98-.03,24.79,0,41.45,7.53,48.62,21.57,7.17-14.04,23.83-21.57,48.62-21.57,1,0,2,.01,3.01.04,17.72.41,37.75,13.64,44.65,29.51,10.89,25.02,3.21,52.54-18.67,66.99l-75.3,63.26c-.74.62-1.66.94-2.57.94Z"/>' +
    '<path class="cls-2" d="m153.84,8c.97,0,1.94.01,2.92.03,16,.37,34.69,12.42,41.08,27.1,11.00,25.29,1.25,49.98-17.40,62.18l-75.48,63.41L26.03,94.43l-.82-.69c-15.12-12.78-22.32-34.64-13.21-57.18,6.22-15.40,25.11-28.14,41.71-28.52.97-.02,1.93-.03,2.89-.03,26.85,0,48.62,8.85,48.62,35.70,0-26.85,21.77-35.70,48.62-35.70m0-8h0c-16.19,0-29.20,3.04-38.66,9.02-3.96,2.51-7.29,5.53-9.96,9.02-2.68-3.49-6-6.51-9.96-9.02C85.80,3.04,72.79,0,56.60,0c-1.01,0-2.04.01-3.07.04C33.49.49,11.99,15.22,4.58,33.56c-9.74,24.10-3.67,50.12,15.46,66.29l.83.70,78.94,66.30c1.49,1.25,3.32,1.87,5.15,1.87s3.66-.62,5.15-1.87l75.13-63.12c10.77-7.19,18.81-17.90,22.66-30.22,4.20-13.45,3.26-27.82-2.72-41.57C197.58,14.50,176.40,0.48,156.94,0.04c-1.04-.02-2.09-.04-3.10-.04h0Z"/>' +
  '</g>' +
  '<path id="eye_white" class="cls-3" d="m164.38,76.28c-1.83,2.60-20.75,20.51-58.84,20.03-35.23-.44-56.42-17.18-58.84-20.36,2.42-3.18,22.76-28.93,57.99-29.37,38.09-.48,57.86,26.45,59.70,29.05"/>' +
  '<ellipse id="eye_iris" class="cls-4" cx="118.06" cy="64.56" rx="21.65" ry="17.98"/>' +
  '<circle id="eye_pupil" class="cls-6" cx="118.03" cy="63.72" r="8.51"/>' +
  '<path id="eye_lid" class="cls-7" d="m164.38,73.51c-8.29-9.23-21.47-29.40-59.70-29.05-35.23.33-55.56,26.19-57.99,29.37"/>' +
  '<path id="heart_shadow" class="cls-1" d="m104.72,160.73l59.10-49.65s-60.38,49.01-119.80-1.33"/>' +
'</svg>';

function animateHeart(heartSvg) {
	//pass
}


const fullWordList = threeWordPhrases.concat(uniqueWordsAndPhrases).concat(fightingWords).concat(fightingInsults);
const playerDialogue = fightingInsults.concat(uniqueWordsAndPhrases).concat(fightingWords);

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
	typerName;
	chatNum;
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
	timerID;
	chat;
	
	constructor(masterElem, chat, health, attackDamage){
		this.health = health;
		this.maxHealth = health;
		this.attackDamage = attackDamage;
		this.target = null;
		this.timerID = null;
		this.chat = chat;
		
		this.typerName = "Typer";
		this.typerUI = document.createElement("div");
		this.typerInfo = document.createElement("div");
		this.healthBarOutline = document.createElement("div");
		this.healthBar = document.createElement("div");
		this.healthText = document.createElement("span");
		this.healthBarOutline.appendChild(this.healthBar);
		this.healthDiv = document.createElement("div");
		this.healthDiv.setAttribute("class", "health-div");
		this.heartSvg = svgFromXml(heartSvgString);
		this.heartSvg.setAttribute("class", "heart-svg");
		this.healthDiv.appendChild(this.heartSvg);
		this.healthDiv.appendChild(this.healthBarOutline);
		this.healthDiv.appendChild(this.healthText);
		
		this.typerUI.appendChild(this.typerInfo);
		this.typerUI.appendChild(this.healthDiv);

		
		masterElem.appendChild(this.typerUI);	
		
		this.typerUI.setAttribute("class", "ui");
		this.typerInfo.setAttribute("class", "typer-info");
		this.healthBarOutline.setAttribute("class", "health-bar-outline");
		this.healthBar.setAttribute("class", "health-bar");
		this.healthText.setAttribute("class", "health-text");
		
		this.typeBox = new TypeBox(masterElem, "Ready?");
		this.vocab = new Vocab(fullWordList);
		this.timeout = 10;
		this.timer = this.timeout;
		this.chatNum = 0;
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
		this.chat.announceDeath(this);
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
		this.chat.post(this.typerInfo.textContent, this.typeBox.currentWord, this.chatNum);
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
		} else {
			this.timer = this.timeout;
		}
		
		this.timerID = setTimeout( () => {this.typeLoop();}, Typer.tickLength);
	}
	
	type(letter) {
		this.typeBox.typeChar(letter);
	}
	
}

class Player extends Typer {
	
	credits;
	store;
	game;
	
	constructor(game, uiParent, chat, health, attackDamage){
		super(uiParent, chat, health, attackDamage);
		this.game = game;
		this.typerUI.setAttribute("id", "player-ui");
		this.healthBarOutline.setAttribute("id", "player-health-bar-outline");
		this.healthBar.setAttribute("id", "player-health-bar");
		this.typerName = "Player";
		this.typerInfo.textContent = this.typerName;
		
		this.credits = 0;
		this.vocab.wordList = playerDialogue;
		this.store = null;
		this.updateUI();
	}
	
	restart(){
		// resets current typer
		this.game.save();
		this.health = this.maxHealth;
		this.typeBox.resetBox("Ready?");
		this.updateUI();
	}
	
	pay(amount){
		this.credits += amount;
		if(this.store){
			this.store.updateUI();
		}
	}
}

class Monster extends Typer {
	
	typeSpeed;
	typeAccuracy;
	level;
	maxLevel;
	levelDownBtn;
	levelUpBtn;
	heartSvg;
	
	constructor(uiParent, chat, level){
		const health = 100 + (level * level);
		const attackDamage = 1 + (level / 5);
		super(uiParent, chat, health, attackDamage);
		this.vocab.wordList = monsterPhrases;
		
		this.typerName 
		this.chatNum = 1;
		this.level = level;
		this.maxLevel = level;
		this.typeSpeed = 1 + (level / 20);
		this.typeAccuracy = Math.min(0.95 + (level / 1000), 1);
		
		this.levelDownBtn = document.createElement("div");
		this.levelDownBtn.setAttribute("id", "level-down-btn");
		this.levelDownBtn.textContent = "⬅️";
		this.levelDownBtn.addEventListener("mousedown", this.switchLevelLower.bind(this));
		
		this.levelUpBtn = document.createElement("div");
		this.levelUpBtn.setAttribute("id", "level-up-btn");
		this.levelUpBtn.textContent = "➡️";
		this.levelUpBtn.addEventListener("mousedown", this.switchLevelHigher.bind(this));
		
		this.typerUI.insertBefore(this.levelDownBtn, this.healthDiv);
		this.typerUI.insertBefore(this.levelUpBtn, this.healthDiv);
		
		this.typerUI.setAttribute("id", "monster-ui");
		
		this.healthBarOutline.setAttribute("id", "monster-health-bar-outline");
		this.healthBar.setAttribute("id", "monster-health-bar");
		this.updateUI();
	}
	
	setStats(){
		this.maxHealth = 100 + (this.level * this.level);
		this.attackDamage = 1 + (this.level / 5);
		this.typeSpeed = 1 + (this.level / 20);
		this.typeAccuracy = Math.min(0.95 + (this.level / 1000), 1);
	}
	
	switchLevelHigher() {
		if(this.level != this.maxLevel){
			this.level++;
			this.setStats();
			if(this.target){
				this.target.restart();
			}
			this.restart();
		}
	}
	
	switchLevelLower() {
		if(this.level > 1){
			this.level--;
			this.setStats();
			if(this.target){
				this.target.restart();
			}
			this.restart();
		}
		
	}
	
	maxLevelUp(){
		this.level++;
		this.maxLevel = this.level;
		this.setStats();
	}
	
	die(){
		
		if(this.target instanceof Player){
			this.target.pay(this.level);
		}
		
		this.typeBox.resetBox("Ready?");
		this.health = this.maxHealth;
		this.chat.announceDeath(this);
		this.chat.announceExit(this);
		if(this.level == this.maxLevel){
			this.maxLevelUp();
		}
		if(this.target){
			this.target.restart()
		}
		this.updateUI();
		this.chat.announceEntrance(this);
	}
	
	updateUI(){
		this.healthBar.setAttribute("style", "width: " + (this.health * 100 / this.maxHealth) + "%");
		this.healthText.textContent = this.health + "/" + this.maxHealth;
		this.typerName = "Monster lvl. " + this.level;
		this.typerInfo.textContent = this.typerName;
		
		if(this.level == this.maxLevel){
			this.levelUpBtn.textContent = "🚫";
		} else {
			this.levelUpBtn.textContent = "➡️";
		}
		
		if(this.level == 1){
			this.levelDownBtn.textContent = "🚫";
		} else {
			this.levelDownBtn.textContent = "⬅️";
		}
		
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

class Store {
	
	static healthPrice = 5;
	static healthBuyAmount = 5;
	player;
	bankArea;
	creditsText;
	storeArea;
	healthButton;
	heartSvg;
	healthPriceSpan;
	healthPriceImg;
	healthPriceBox;
	
	constructor(parentElem, player){
		this.player = player;
		this.player.store = this;
		this.storeArea = document.createElement("div");
		this.storeArea.setAttribute("id", "store-area");
		
		this.bankArea = document.createElement("div");
		this.bankArea.setAttribute("id", "store-bank");
		this.creditsText = document.createElement("span");
		this.creditsText.setAttribute("id", "store-text-credits");
		this.creditsImg = document.createElement("span");
		this.creditsImg.setAttribute("id", "store-img-credits");
		this.bankArea.appendChild(this.creditsText);
		this.bankArea.appendChild(this.creditsImg);
		
		this.healthButton = document.createElement("div");
		this.healthButton.setAttribute("id", "store-btn-health");
		this.healthButton.addEventListener("mousedown", this.buyHealth.bind(this));
		this.heartSvg = svgFromXml(heartSvgString);
		this.heartSvg.setAttribute("class", "heart-svg");
		this.heartSvg.setAttribute("id", "store-heart-svg");
		this.healthButton.appendChild(this.heartSvg);
		this.healthPriceBox = document.createElement("span");
		this.healthPriceBox.className = "store-price-box";
		this.healthPriceSpan = document.createElement("span");
		this.healthPriceSpan.className = "store-price-span";
		this.healthPriceSpan.textContent = Store.healthPrice.toString();
		this.healthPriceImg = document.createElement("div");
		this.healthPriceImg.className = "store-price-img";
		this.healthPriceBox.appendChild(this.healthPriceSpan);
		this.healthPriceBox.appendChild(this.healthPriceImg);
		this.healthButton.appendChild(this.healthPriceBox);
		this.storeArea.appendChild(this.bankArea);
		this.storeArea.appendChild(this.healthButton);
		parentElem.appendChild(this.storeArea);
		
		this.updateUI();
	}
	
	updateUI() {
		this.creditsText.textContent = this.player.credits;
	}
	
	buyHealth(){
		if(this.player.credits >= Store.healthPrice){
			this.player.maxHealth += Store.healthBuyAmount;
			this.player.health += Store.healthBuyAmount;
			this.player.credits -= Store.healthPrice;
			this.player.game.save()
			this.player.updateUI();
			this.updateUI();
		}
	}
}

class Chat {
	
	static deathMessages = ["has been slain!",
							"is knocked out!",
							"had no chance!",
							"couldn't hold out.",
							"got splattered.",
							"died :("];
	chatArea;
	
	constructor(parentElem){
		this.chatArea = document.createElement("div");
		this.chatArea.setAttribute("id", "chat-area");
		parentElem.appendChild(this.chatArea);
	}
	
	post(user, message, userNum){
		const usernameText = document.createElement("span");
		const messageText = document.createElement("span");
		const messageBox = document.createElement("div");
		
		let userClass = "player-user-text";
		if(userNum != 0){
			userClass = "enemy-user-text";
		}
		
		usernameText.setAttribute("class", userClass);
		messageText.setAttribute("class", "message-text");
		messageBox.setAttribute("class", "message-box");
		
		messageText.textContent = ": " + message;
		usernameText.textContent = user;
		messageBox.appendChild(usernameText);
		messageBox.appendChild(messageText);
		
		this.chatArea.insertBefore(messageBox, this.chatArea.children[0]);
	}
	
	announceDeath(user){
		const messageBox = document.createElement("div");
		const messageText = document.createElement("span");
		messageText.className = "death-announce-text";
		messageBox.className = "death-announce-box";
		
		const deathMessage = Chat.deathMessages[Math.round(Math.random() * (Chat.deathMessages.length - 1 ))];
		messageText.textContent = user.typerName + " " + deathMessage;
		messageBox.appendChild(messageText);
		this.chatArea.insertBefore(messageBox, this.chatArea.children[0]);
	}
	
	announceExit(user){
		const messageBox = document.createElement("div");
		const messageText = document.createElement("span");
		messageText.className = "exit-announce-text";
		messageBox.className = "exit-announce-box";
		
		const exitMessage = "has left the lobby.";
		messageText.textContent = user.typerName + " " + exitMessage;
		messageBox.appendChild(messageText);
		this.chatArea.insertBefore(messageBox, this.chatArea.children[0]);
	}
	
	announceEntrance(user){
		const messageBox = document.createElement("div");
		const messageText = document.createElement("span");
		messageText.className = "entrance-announce-text";
		messageBox.className = "entrance-announce-box";
		
		const entranceMessage = "has entered the lobby.";
		messageText.textContent = user.typerName + " " + entranceMessage;
		messageBox.appendChild(messageText);
		this.chatArea.insertBefore(messageBox, this.chatArea.children[0]);
	}
}

class TypingHeroesGame {
	static startHealth = 100;
	static startDamage = 1;
	
	player;
	monster;
	store;
	chat;
	
	monsterStage;
	playerStage;
	gameArea;
	body;
	
	constructor(){
		this.monsterStage = document.createElement("div");
		this.monsterStage.setAttribute("id", "monster-stage");
		this.playerStage = document.createElement("div");
		this.playerStage.setAttribute("id", "player-stage");
		this.body = document.getElementsByTagName("body")[0];
		this.gameArea = document.createElement("div");
		this.gameArea.setAttribute("id", "game-area");
		this.chat = new Chat(this.gameArea);
		this.gameArea.appendChild(this.playerStage);
		this.gameArea.appendChild(this.monsterStage);
		this.body.appendChild(this.gameArea);

		this.loadPlayer();
		this.loadMonster();
		this.monster.target = this.player;
		this.player.target = this.monster;

		this.store = new Store(this.body, this.player);
		
	}
	
	play(){
		this.player.typeLoop();
		this.monster.typeLoop();
		this.monster.battleLoop();
	}
	
	save(){
		localStorage.setItem('player-credits', this.player.credits.toString());
		localStorage.setItem('player-health', this.player.maxHealth.toString());
		localStorage.setItem('player-damage', this.player.attackDamage.toString());
		
		localStorage.setItem('monster-level', this.monster.maxLevel.toString());
	}
	
	loadPlayer(){
		const healthStr = localStorage.getItem('player-health');
		const creditsStr = localStorage.getItem('player-credits');
		const damageStr = localStorage.getItem('player-damage');
		let health = null;
		let credits = null;
		let damage = null;
		
		if(healthStr == null){
			health = TypingHeroesGame.startHealth;
		} else {
			health = Number(healthStr);
		}
		
		if(creditsStr == null){
			credits = 0;
		} else {
			credits = Number(creditsStr);
		}
		
		if(damageStr == null){
			damage = TypingHeroesGame.startDamage;
		} else {
			damage = Number(damageStr);
		}
		
		this.player = new Player(this, this.playerStage, this.chat, health, damage);
		this.player.credits = credits;
	}
	
	loadMonster(){
		const levelStr = localStorage.getItem("monster-level");
		let level = null;
		if(levelStr == null){
			level = 1;
		} else {
			level = Number(levelStr);
		}
		
		this.monster = new Monster(this.monsterStage, this.chat, level);
	}
}


game = new TypingHeroesGame();

function typeListener(event) {
	if(event.key.length == 1){
		game.player.type(event.key);
	}
}

document.addEventListener("keydown", typeListener);

game.play();
