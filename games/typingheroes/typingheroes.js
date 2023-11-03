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
	
	typeBox;
	vocab;
	timeout;
	timer;
	
	constructor(masterElem){
		this.typeBox = new TypeBox(masterElem, "Ready");
		this.vocab = new Vocab(threeWordPhrases);
		this.timeout = 10;
		this.timer = this.timeout;
	}
	
	typeLoop() {
		const countDone = (this.timer == 0);
		
		if(this.typeBox.boxStatus == SUCCESS){
			if(countDone){
				this.typeBox.resetBox(this.vocab.newWord());
				this.timer = this.timeout;
				// Make player deal damage
			} else {
				this.timer--;
			}
		} else if(this.typeBox.boxStatus == FAIL) {
			if(countDone){
				this.typeBox.resetBox(this.vocab.newWord());
				this.timer = this.timeout;
				//Make player take damage
			} else {
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
		
	constructor(masterElem){
		super(masterElem);
	}
}

body = document.getElementsByTagName("body")[0];
player = new Player(body); 
player.typeLoop();

function typeListener(event) {
	if(event.key.length == 1){
		player.type(event.key);
	}
}

document.addEventListener("keydown", typeListener);
