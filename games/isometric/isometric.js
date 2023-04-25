const tileSize = 40;
const frameWait = 40;
const alienWalkFiles = ["sprites/alien_walk/alien_walk1.svg",
						"sprites/alien_walk/alien_walk2.svg",
						"sprites/alien_walk/alien_walk3.svg",
						"sprites/alien_walk/alien_walk4.svg",
						"sprites/alien_walk/alien_walk5.svg",
						"sprites/alien_walk/alien_walk6.svg",
						"sprites/alien_walk/alien_walk7.svg",
						"sprites/alien_walk/alien_walk8.svg",
						"sprites/alien_walk/alien_walk9.svg"];

const alienFiles = {
	movementFiles : alienWalkFiles,
};
		
const baseIdleFiles = ["sprites/base_idle/base_idle1.svg"];
const baseFiles = {
	idleFiles : baseIdleFiles,
};

const grid = document.getElementById('grid');

class Enemy {
	x;
	y;
	div;
	name;
	target;
	#currentFrame;
	#movementFrames;
	#activeFrames;
	#animationID;
	#transformString;
	#speed;
	
	constructor(name, animationFilesObj, posX, posY, speed, transformString){
		this.x = posX;
		this.y = posY;
		this.name = name;
		this.target = this;
		this.div = document.createElement('div');
		this.div.setAttribute('class', name);
		this.div.appendChild(document.createElement('img'));
		grid.appendChild(this.div);

		this.#movementFrames = [];
		this.mountFilesObj(animationFilesObj);
		this.#animationID = null;
		this.#activeFrames = this.#movementFrames;
		this.#currentFrame = 0;
		this.#transformString = transformString;
		this.#speed = speed;
		
		this.updatePos();
	}
	
	mountFilesObj(filesObj){
		for (let i = 0; i < filesObj.movementFiles.length; i++) {
			const svg = new Image();
			svg.src = filesObj.movementFiles[i];
			this.#movementFrames.push(svg);
		}
	}
	
	animate(animation){
		clearTimeout(this.#animationID);
		if(animation == "move"){
			this.#activeFrames = this.#movementFrames;
		}
		this.updateFrame();
	}
	
	updateFrame(){
		
		this.#animationID = setTimeout( () => {
			// increment the current frame index and wrap around if needed
			this.#currentFrame = (this.#currentFrame + 1) % this.#activeFrames.length;
		
			// remove the current SVG file from the container
			this.div.removeChild(this.div.lastChild);
			// add the next SVG file to the container
			this.div.appendChild(this.#activeFrames[this.#currentFrame]);
			// request the next animation frame

			this.updateFrame();
		},
		frameWait);
	}
	
	
	updatePos(){
		this.div.style.left = this.x + "px";
		this.div.style.bottom = this.y + "px";
	}
	
	setTarget(target){
		this.target = target;
	}
	
	moveTowardTarget(){
		if(this.x < this.target.x){
			this.x +=  this.#speed;
			this.div.style.transform = this.#transformString;
		} else if(this.x > this.target.x){
			this.x -= this.#speed;
			this.div.style.transform = this.#transformString + " scaleX(-1)";
		} else if(this.y < this.target.y){
			this.y += this.#speed;
			this.div.style.transform = this.#transformString;
		} else if(this.y > this.target.y){
			this.y -= this.#speed;
			this.div.style.transform = this.#transformString + " scaleX(-1)";
		}
		this.updatePos();
		
		if(Math.abs(this.x - this.target.x) > 1 || Math.abs(this.y - this.target.y) > 1){
			setTimeout( () => this.moveTowardTarget(), frameWait);
		}
	}
	
	goToTarget(){
		this.animate("move");
		this.moveTowardTarget();
	}
	
}

class Building {
	
	x;
	y;
	maxHealth;
	health;
	div;
	
	#activeFrames;
	#idleFrames;
	#currentFrame;
	#animationID;
	
	constructor(name, animationFramesObj, posX, posY, maxHealth){
		this.x = posX * tileSize;
		this.y = posY * tileSize;
		this.maxHealth = maxHealth;
		this.health = maxHealth;
		
		this.div = document.createElement('div');
		this.div.setAttribute('class', name);
		this.div.appendChild(document.createElement('img'));
		grid.appendChild(this.div);
		
		this.#idleFrames = [];
		this.mountFilesObj(baseFiles);
		this.#activeFrames = this.#idleFrames;
		this.#animationID = null;
		this.#currentFrame = 0;
		
		this.updatePos();
	}
	
	mountFilesObj(filesObj){
		for (let i = 0; i < filesObj.idleFiles.length; i++) {
			const svg = new Image();
			svg.src = filesObj.idleFiles[i];
			this.#idleFrames.push(svg);
		}
	}
	animate(animation){
		clearTimeout(this.#animationID);
		if(animation == "idle"){
			this.#activeFrames = this.#idleFrames;
		}
		this.updateFrame();
	}
	
	updateFrame(){
		
		this.#animationID = setTimeout( () => {
			// increment the current frame index and wrap around if needed
			this.#currentFrame = (this.#currentFrame + 1) % this.#activeFrames.length;
			console.log(this.div)
			console.log(this.#activeFrames)
			// remove the current SVG file from the container
			this.div.removeChild(this.div.lastChild);
			// add the next SVG file to the container
			this.div.appendChild(this.#activeFrames[this.#currentFrame]);
			// request the next animation frame

			this.updateFrame();
		},
		frameWait);
	}
	
	updatePos(){
		this.div.style.left = this.x + "px";
		this.div.style.bottom = this.y + "px";
	}
} 
const alien1 = new Enemy("alien", alienFiles, 0, 0, 2, "translateZ(40px) translateX(-20px) translateY(20px) rotateZ(-45deg) rotateX(-55deg)");
alien1.animate("move");
const base1 = new Building("base", baseFiles, 1, 1, 2);
base1.animate("idle");
const base2 = new Building("base", baseFiles, 4, 6, 2);
base2.animate("idle");
alien1.setTarget(base2);