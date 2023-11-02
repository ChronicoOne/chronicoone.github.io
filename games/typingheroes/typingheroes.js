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

body = document.getElementsByTagName("body")[0];

playerTypeBox = new TypeBox(body, "hello");

function typeListener(event) {
	if(event.key.length == 1){
		playerTypeBox.typeChar(event.key);
	}
}

document.addEventListener("keydown", typeListener);

let i = 0;

function checkBox(){
	if(playerTypeBox.boxStatus == SUCCESS){
		playerTypeBox.resetBox(threeWordPhrases[i % threeWordPhrases.length]);
		i++;
	} else if(playerTypeBox.boxStatus == FAIL){
		playerTypeBox.resetBox(threeWordPhrases[i % threeWordPhrases.length]);
		i++;
	}
}

const timeout = 1000;

function checkBoxLoop(){
	checkBox();
	setTimeout( () => {checkBoxLoop();}, timeout);
}

checkBoxLoop();