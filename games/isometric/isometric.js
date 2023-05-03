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


const towerIdleFiles = ["sprites/tower_idle/tower_idle1.svg"];
const towerAttachmentFiles = ["sprites/tower_attachment/tower_attachment1.svg"];
const towerFiles = {
	idleFiles : towerIdleFiles,
	attachmentFiles : towerAttachmentFiles,
};

const grid = document.getElementById('grid');

const gameManager = {
	listOfTargets: [],
	listOfEnemies: [],
	
	updateEnemyTargets() {
		for(let i = 0; i < this.listOfEnemies.length; i++){
			const enemy = this.listOfEnemies[i];
			enemy.target = null;
			enemy.findNearestTarget();
			enemy.cancelMovement();
			enemy.goToTarget();
		}
	},
	
	removeDeadTargets() {
		for(let i = 0; i < this.listOfTargets.length; i++){
			const target = this.listOfTargets[i];
			
			if(target.health <= 0){
				target.removeDiv()
				if(target instanceof attackBuilding){
					target.cancelAttackLoop();
				}
				this.listOfTargets.splice(i, 1);
			}
		}
		this.updateEnemyTargets();
	},
	
	updateBuildingTargets() {
		for(let i = 0; i < this.listOfTargets.length; i++){
			const tower = this.listOfTargets[i];
			if(tower instanceof attackBuilding){
				tower.target = null;
				tower.findNearestTarget();
			}
		}
	},
	
	removeDeadEnemies() {
		for(let i = 0; i < this.listOfEnemies.length; i++){
			const enemy = this.listOfEnemies[i];
			
			if(enemy.health <= 0){
				enemy.cancelAttackLoop();
				enemy.removeDiv()
				this.listOfEnemies.splice(i, 1);
			}
		}
		this.updateBuildingTargets();
	},
	
	setTargets(targets) {
		this.listOfTargets = targets;
	},
	
	setEnemies(enemies) {
		this.listOfEnemies = enemies;
	},
	
	
};

class Enemy {
	x;
	y;
	div;
	name;
	target;
	health;
	#currentFrame;
	#movementFrames;
	#activeFrames;
	#movementID;
	#animationID;
	attackID;
	#transformString;
	#speed;
	#attackDamage;
	
	constructor(name, animationFilesObj, posX, posY, speed, attackDamage, health, transformString){
		this.x = posX;
		this.y = posY;
		this.name = name;
		this.health = health;
		this.target = null;
		this.findNearestTarget();
		this.div = document.createElement('div');
		this.div.setAttribute('class', name);
		this.div.appendChild(document.createElement('img'));
		grid.appendChild(this.div);

		this.#movementFrames = [];
		this.mountFilesObj(animationFilesObj);
		this.#movementID = null;
		this.attackID = null;
		this.#animationID = null;
		this.#activeFrames = this.#movementFrames;
		this.#currentFrame = 0;
		this.#transformString = transformString;
		this.#speed = speed;
		this.#attackDamage = attackDamage;
		
		this.updatePos();
		this.attackLoop();
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
	
	removeDiv(){
		this.div.remove();
	}
	
	updatePos(){
		this.div.style.left = this.x + "px";
		this.div.style.bottom = this.y + "px";
	}
	
	setTarget(target){
		this.target = target;
	}
	
	moveTowardTarget(){
		if(this.x - this.target.x > this.#speed + tileSize || this.y - this.target.y > this.#speed + tileSize || this.target.x - this.x > this.#speed || this.target.y - this.y > this.#speed){
			if(this.x < this.target.x + this.#speed){
				this.x +=  this.#speed;
				this.div.style.transform = this.#transformString;
			} else if(this.x > this.target.x + this.#speed){
				this.x -= this.#speed;
				this.div.style.transform = this.#transformString + " scaleX(-1)";
			} else if(this.y < this.target.y - this.#speed){
				this.y += this.#speed;
				this.div.style.transform = this.#transformString;
			} else if(this.y > this.target.y - this.#speed){
				this.y -= this.#speed;
				this.div.style.transform = this.#transformString + " scaleX(-1)";
			}
			this.updatePos();
	
			this.#movementID = setTimeout( () => this.moveTowardTarget(), frameWait);
		}
	}
	
	cancelMovement(){
		clearTimeout(this.#movementID);
	}
	
	goToTarget(){
		this.animate("move");
		if(this.target != null){
			this.moveTowardTarget();
		}
	}
	
	findNearestTarget(){
		if(this.target == null){
			if(gameManager.listOfTargets.length > 0){
				this.target = gameManager.listOfTargets[0];
			} else {
				this.target = null;
			}
		}
		
		for(const target of gameManager.listOfTargets){
			if(Math.abs(this.x - this.target.x) + Math.abs(this.y - this.target.y) > Math.abs(this.x - target.x) + Math.abs(this.y - target.y)){
				this.setTarget(target);
			}
		}
	}
	
	atTarget(){
		const isTargetInRangeY = Math.abs(this.y - this.target.y) <= this.#speed + tileSize;
		const isTargetInRangeX = Math.abs(this.x - this.target.x) <= this.#speed + tileSize;
		
		if(isTargetInRangeX && isTargetInRangeY){
			return true;
		} else {
			return false;
		}
	}
	
	attackTarget(){
		const targetExists = !(this.target == null);
		
		if(targetExists && this.atTarget()){
			if(this.target.health > this.#attackDamage){
				this.target.health -= this.#attackDamage;
			} else {
				this.target.health = 0;
			}
			if(this.target.health <= 0){
				gameManager.removeDeadTargets();
			}
		}
	}
	
	attackLoop() {
		this.attackTarget();
		this.attackID = setTimeout( () => {this.attackLoop();}, frameWait);
	}
	
	cancelAttackLoop() {
		clearTimeout(this.attackID);
	}
}

class Building {
	
	x;
	y;
	health;
	div;
	attachmentDiv;
	
	#activeFrames;
	#idleFrames;
	#attachmentFrames;
	#currentFrame;
	#currentAttachmentFrame;
	#animationID;
	#attachmentAnimationID;
	
	constructor(name, animationFilesObj, posX, posY, maxHealth){
		this.x = posX * tileSize;
		this.y = posY * tileSize;
		this.health = maxHealth;
		
		this.div = document.createElement('div');
		this.div.setAttribute('class', name);
		this.div.appendChild(document.createElement('img'));
		grid.appendChild(this.div);
		
		this.#idleFrames = [];
		this.#attachmentFrames = [];
		this.mountFilesObj(animationFilesObj);
		
		if(this.#attachmentFrames.length > 0){
			this.attachmentDiv = document.createElement('div');
			this.attachmentDiv.setAttribute('class', name + "Attachment");
			this.attachmentDiv.appendChild(document.createElement('img'));
			grid.appendChild(this.attachmentDiv);
		}
		this.#activeFrames = this.#idleFrames;
		this.#animationID = null;
		this.#attachmentAnimationID = null;
		this.#currentFrame = 0;
		this.#currentAttachmentFrame = 0;
		
		this.updatePos();
	}
	
	mountFilesObj(filesObj){
		for (let i = 0; i < filesObj.idleFiles.length; i++) {
			const svg = new Image();
			svg.src = filesObj.idleFiles[i];
			this.#idleFrames.push(svg);
		}
		
		if(filesObj.attachmentFiles !== undefined){
			for (let i = 0; i < filesObj.attachmentFiles.length; i++) {
				const svg = new Image();
				svg.src = filesObj.attachmentFiles[i];
				this.#attachmentFrames.push(svg);
			}
		}
	}
	animate(animation){
		clearTimeout(this.#animationID);
		if(animation == "idle"){
			this.#activeFrames = this.#idleFrames;
		}
		this.animateAttachment();
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
	
	animateAttachment(){
		if(this.#attachmentFrames.length > 0){
			clearTimeout(this.#attachmentAnimationID);
			this.updateAttachmentFrame();
		}
	}
	
	updateAttachmentFrame(){
		
		this.#attachmentAnimationID = setTimeout( () => {
			// increment the current frame index and wrap around if needed
			this.#currentAttachmentFrame = (this.#currentAttachmentFrame + 1) % this.#attachmentFrames.length;
			// remove the current SVG file from the container
			this.attachmentDiv.removeChild(this.attachmentDiv.lastChild);
			// add the next SVG file to the container
			this.attachmentDiv.appendChild(this.#attachmentFrames[this.#currentAttachmentFrame]);
			// request the next animation frame

			this.updateAttachmentFrame();
		},
		frameWait);
	}
	
	updatePos(){
		this.div.style.left = this.x + "px";
		this.div.style.bottom = this.y + "px";
		
		if(this.#attachmentFrames.length > 0){
			this.attachmentDiv.style.left = this.x + "px";
			this.attachmentDiv.style.bottom = this.y + "px";
		}
	}
	
	removeDiv(){
		this.div.remove();
		if(this.#attachmentFrames.length > 0){
			this.attachmentDiv.remove();
		}
	}
}

class attackBuilding extends Building {
	
	target;
	attackRange;
	attackDamage;
	attackID;
	constructor(name, animationFilesObj, posX, posY, maxHealth, range, damage){
		super(name, animationFilesObj, posX, posY, maxHealth);
		
		this.target = null;
		this.attackRange = range;
		this.attackDamage = damage;
		this.attackID = null;
		
		this.attackLoop();
	}
	
	setTarget(target){
		this.target = target;
	}
	
	inRange(){
		return Math.sqrt(((this.target.x - this.x)**2) + ((this.target.y - this.y)**2)) < this.attackRange;
	}
	
	findNearestTarget(){
		const doEnemiesExist = gameManager.listOfEnemies.length > 0;
		
		if(this.target == null && doEnemiesExist){
			this.target = gameManager.listOfEnemies[0];
		}
		
		if(doEnemiesExist){
			for(const target of gameManager.listOfEnemies){
				const newTargetIsCloser = Math.sqrt(((this.target.x - this.x)**2) + ((this.target.y - this.y)**2)) > Math.sqrt(((target.x - this.x)**2) + ((target.y - this.y)**2));
				if(newTargetIsCloser){
					this.setTarget(target);
				}
			}
		}
	}
	
	attackTarget(){
		if(this.target != null && this.inRange()){
			if(this.target.health > 0) {
				this.target.health -= this.attackDamage;
			} else {
				gameManager.removeDeadEnemies();
			}
		}
	}
	
	attackLoop() {
		this.attackTarget();
		this.attackID = setTimeout( () => {this.attackLoop();}, frameWait);
	}
	
	cancelAttackLoop() {
		clearTimeout(this.attackID);
	}
}

class gunTower extends attackBuilding{
	
	fireBallSpeed;
	turretReady;
	fireBallDiv;
	fireBallPos;
	fireBallHitRadius;
	
	#fireBallID;
	
	constructor(posX, posY){
		super("tower", towerFiles, posX, posY, 200, 100, 1);
		this.turretReady = true;
		this.fireBallDiv = this.attachmentDiv;
		this.fireBallSpeed = 10;
		this.fireBallHitRadius = 3;
		
		this.fireBallPos = {x: posX * tileSize, y: posY * tileSize};
		this.#fireBallID;
	}
	
	fireTurret(){
		this.turretReady = false;
		this.moveFireBall();
	}
	
	updateFireBallPos() {
		this.fireBallDiv.style.left = this.fireBallPos.x + "px";
		this.fireBallDiv.style.bottom = this.fireBallPos.y + "px";
	}
	
	moveFireBall() {
		const vectorX = this.target.x - this.x;
		const vectorY = this.target.y - this.y;
		
		const fireBallInRangeX = Math.abs(this.fireBallPos.x - this.target.x) < this.fireBallHitRadius;
		const fireBallInRangeY = Math.abs(this.fireBallPos.y - this.target.y) < this.fireBallHitRadius;
		
		const thetaX = Math.atan(vectorX/(vectorY+0.000001));
		const thetaY = Math.atan(vectorY/(vectorX+0.000001));
		const speedX = this.fireBallSpeed * Math.sin(thetaX);
		const speedY = this.fireBallSpeed * Math.sin(thetaY);
		
		this.fireBallPos.x += speedX;
		this.fireBallPos.y += speedY;
		
		if(fireBallInRangeX && fireBallInRangeY){
			this.target.health -= this.attackDamage;
			this.fireBallPos.x = this.x;
			this.fireBallPos.y = this.y;
			this.updateFireBallPos();
			this.turretReady = true;
		} else {
			this.#fireBallID = setTimeout(() => {this.moveFireBall();}, frameWait);
			this.updateFireBallPos();
		}
	}
	
	attackTarget(){
		if(this.target != null && this.inRange() && this.turretReady){
			if(this.target.health > 0) {
				this.fireTurret();
			} else {
				gameManager.removeDeadEnemies();
			}
		}
	}

	cancelAttackLoop() {
		clearTimeout(this.attackID);
		clearTimeout(this.#fireBallID);
	}
}

const base1 = new Building("base", baseFiles, 1, 1, 200);
base1.animate("idle");
const base2 = new Building("base", baseFiles, 4, 2, 200);
base2.animate("idle");
const base3 = new Building("base", baseFiles, 6, 3, 200);
base3.animate("idle");
const base4 = new Building("base", baseFiles, 8, 4, 200);
base4.animate("idle");
const base5 = new Building("base", baseFiles, 1, 6, 200);
base5.animate("idle");
const base6 = new Building("base", baseFiles, 4, 7, 200);
base6.animate("idle");
const base7 = new Building("base", baseFiles, 6, 8, 200);
base7.animate("idle");
const base8 = new Building("base", baseFiles, 8, 5, 200);
base8.animate("idle");

const tower1 = new gunTower(5, 5);
tower1.animate("idle");

const targets = [base1, base2, base3, base4, base5, base6, base7, base8, tower1];

const alien1 = new Enemy("alien", alienFiles, 200, 200, 2, 1, 50, "translateZ(40px) translateX(-20px) translateY(20px) rotateZ(-45deg) rotateX(-55deg)");
alien1.animate("move");
const alien2 = new Enemy("alien", alienFiles, 100, 200, 2, 1, 50, "translateZ(40px) translateX(-20px) translateY(20px) rotateZ(-45deg) rotateX(-55deg)");
alien2.animate("move");
const alien3 = new Enemy("alien", alienFiles, 20, 10, 2, 1, 50, "translateZ(40px) translateX(-20px) translateY(20px) rotateZ(-45deg) rotateX(-55deg)");
alien3.animate("move");
const alien4 = new Enemy("alien", alienFiles, 30, 300, 2, 1, 50, "translateZ(40px) translateX(-20px) translateY(20px) rotateZ(-45deg) rotateX(-55deg)");
alien4.animate("move");

const enemies = [alien1, alien2, alien3, alien4];

gameManager.setTargets(targets);
gameManager.setEnemies(enemies);

gameManager.updateEnemyTargets();
gameManager.updateBuildingTargets();