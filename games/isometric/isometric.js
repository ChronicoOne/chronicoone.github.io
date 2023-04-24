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

const grid = document.getElementById('grid');

class Enemy {
	x;
	y;
	div;
	name;
	#currentFrame;
	#movementFrames;
	#activeFrames;
	#animationID;
	
	constructor(name, animationFilesObj, posX, posY){
		this.x = posX;
		this.y = posY;
		this.name = name;
		this.div = document.createElement('div');
		this.div.setAttribute('class', name);
		grid.appendChild(this.div);
		this.div.appendChild(document.createElement('img'));
		
		this.#movementFrames = [];
		this.#animationID = null;
		this.#activeFrames = [];
		this.#movementFrames = [];
		this.#currentFrame = 0;
		for (let i = 0; i < animationFilesObj.movementFiles.length; i++) {
			const svg = new Image();
			svg.src = animationFilesObj.movementFiles[i];
			this.#movementFrames.push(svg);
		}
		this.updatePos();
	}
	
	animate(animation){
		if(animation == "move"){
			this.#activeFrames = this.#movementFrames;
		}
		cancelAnimationFrame(this.#animationID);
		this.#animationID = requestAnimationFrame(this.updateFrame.bind(this));
	}
	
	updateFrame(){
		// increment the current frame index and wrap around if needed
		this.#currentFrame = (this.#currentFrame + 1) % this.#activeFrames.length;
		
		// remove the current SVG file from the container
		this.div.removeChild(this.div.lastChild);
  
		// add the next SVG file to the container
		this.div.appendChild(this.#activeFrames[this.#currentFrame]);

		// request the next animation frame
		requestAnimationFrame(this.updateFrame.bind(this));
	}
	
	updatePos(){
		this.div.style.left = this.x + "px";
		this.div.style.bottom = this.y + "px";
	}
}
/* class Building {
	
	constructor(){
	
	}
} */

const alien1 = new Enemy("alien", alienFiles, 200, 20);
alien1.animate("move");