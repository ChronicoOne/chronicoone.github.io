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
const towerFiles = {
	idleFiles : towerIdleFiles,
};

const fireBallIdleFiles = ["sprites/blueFireBall_idle/blueFireBall_idle1.svg"];
const fireBallFiles = {
	idleFiles : fireBallIdleFiles,
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
				target.destroy();
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

let activeBuilding = null;

const store = {
	baseButtonDiv : document.getElementById("baseButton"),
	
	gunTowerButtonDiv : document.getElementById("gunTowerButton"),
	
	tiles: [],
	
	initialize(){
		this.baseButtonDiv.addEventListener("mousedown", (event) => {activeBuilding = "base";});
		this.gunTowerButtonDiv.addEventListener("mousedown", (event) => {activeBuilding = "gunTower";});
		
		this.tileDivs = document.querySelectorAll(".tile");
		
		for(const tileDiv of this.tileDivs){
			this.tiles.push(new Tile(tileDiv));
		}
	},
	
	build(){
		
	},
};

class Tile {
	div;
	x;
	y;
	full;
	structure;
	
	constructor(div){
		this.div = div;
		this.x = Number(div.getAttribute("index"));
		this.y = Number(div.parentElement.getAttribute("index"));
		this.full = false;
		this.div.addEventListener("mousedown", this.build.bind(this));
	}
	
	build(){
		if(!this.full && activeBuilding != null){
			if(activeBuilding == "gunTower"){
				this.structure = new gunTower(this, 95);
			} else if(activeBuilding == "base"){
				this.structure = new Building("base", baseFiles, this, 40, 200);
			}
			this.full = true;
			gameManager.listOfTargets.push(this.structure);
			gameManager.updateEnemyTargets();
			gameManager.updateBuildingTargets();
		}
	}
}
class Enemy {
	x;
	y;
	z;
	div;
	name;
	target;
	health;
	#currentFrame;
	#movementFrames;
	#activeFrames;
	#movementID;
	animationID;
	attackID;
	#transformString;
	#speed;
	#attackDamage;
	
	constructor(name, animationFilesObj, posX, posY, posZ, speed, attackDamage, health, transformString){
		this.x = posX;
		this.y = posY;
		this.z = posZ;
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
		this.animationID = null;
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
		clearTimeout(this.animationID);
		if(animation == "move"){
			this.#activeFrames = this.#movementFrames;
		}
		this.updateFrame();
	}
	
	updateFrame(){
		
		this.animationID = setTimeout( () => {
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
				this.div.style.transform = "translateZ(" + this.z + "px)"  + this.#transformString;
			} else if(this.x > this.target.x + this.#speed){
				this.x -= this.#speed;
				this.div.style.transform = "translateZ(" + this.z + "px) "  + this.#transformString + " scaleX(-1)";
			} else if(this.y < this.target.y - this.#speed){
				this.y += this.#speed;
				this.div.style.transform = "translateZ(" + this.z + "px) "  + this.#transformString;
			} else if(this.y > this.target.y - this.#speed){
				this.y -= this.#speed;
				this.div.style.transform = "translateZ(" + this.z + "px) "  + this.#transformString + " scaleX(-1)";
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
	z;
	health;
	div;
	attachmentDiv;
	tile;
	
	#activeFrames;
	#idleFrames;
	attachmentFrames;
	#currentFrame;
	#currentAttachmentFrame;
	animationID;
	attachmentAnimationID;
	
	constructor(name, animationFilesObj, tile, posZ, maxHealth){
		
		this.x = tile.x * tileSize;
		this.y = tile.y * tileSize;
		this.z = posZ;
		this.tile = tile;
		this.health = maxHealth;
		
		this.div = document.createElement('div');
		this.div.setAttribute('class', name);
		this.div.appendChild(document.createElement('img'));
		grid.appendChild(this.div);
		
		this.#idleFrames = [];
		this.attachmentFrames = [];
		this.mountFilesObj(animationFilesObj);
		
		if(this.attachmentFrames.length > 0){
			this.attachmentDiv = document.createElement('div');
			this.attachmentDiv.setAttribute('class', name + "Attachment");
			this.attachmentDiv.appendChild(document.createElement('img'));
			grid.appendChild(this.attachmentDiv);
		}
		this.#activeFrames = this.#idleFrames;
		this.animationID = null;
		this.attachmentAnimationID = null;
		this.#currentFrame = 0;
		this.#currentAttachmentFrame = 0;
		
		this.updatePos();
		this.animate("idle");
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
				this.attachmentFrames.push(svg);
			}
		}
	}
	animate(animation){
		clearTimeout(this.animationID);
		if(animation == "idle"){
			this.#activeFrames = this.#idleFrames;
		}
		this.animateAttachment();
		this.updateFrame();
	}
	
	updateFrame(){
		
		this.animationID = setTimeout( () => {
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
		if(this.attachmentFrames.length > 0){
			clearTimeout(this.attachmentAnimationID);
			this.updateAttachmentFrame();
		}
	}
	
	updateAttachmentFrame(){
		
		this.attachmentAnimationID = setTimeout( () => {
			// increment the current frame index and wrap around if needed
			this.#currentAttachmentFrame = (this.#currentAttachmentFrame + 1) % this.attachmentFrames.length;
			// remove the current SVG file from the container
			this.attachmentDiv.removeChild(this.attachmentDiv.lastChild);
			// add the next SVG file to the container
			this.attachmentDiv.appendChild(this.attachmentFrames[this.#currentAttachmentFrame]);
			// request the next animation frame

			this.updateAttachmentFrame();
		},
		frameWait);
	}
	
	updatePos(){
		this.div.style.left = this.x + "px";
		this.div.style.bottom = this.y + "px";
		
		if(this.attachmentFrames.length > 0){
			this.attachmentDiv.style.left = this.x + "px";
			this.attachmentDiv.style.bottom = this.y + "px";
		}
	}
	
	destroy(){
		clearTimeout(this.animationID);
		clearTimeout(this.attachmentAnimationID);
		this.div.remove();
		this.tile.full = false;
		if(this.attachmentFrames.length > 0){
			this.attachmentDiv.remove();
		}
	}
}

class attackBuilding extends Building {
	
	target;
	attackRange;
	attackDamage;
	attackID;
	constructor(name, animationFilesObj, tile, posZ, maxHealth, range, damage){
		super(name, animationFilesObj, tile, posZ, maxHealth);
		
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
	
	destroy(){
		clearTimeout(this.animationID);
		clearTimeout(this.attachmentAnimationID);
		clearTimeout(this.attackID);
		this.div.remove();
		this.tile.full = false;
		if(this.attachmentFrames.length > 0){
			this.attachmentDiv.remove();
		}
	}
}

class fireBall {
	
	x;
	y;
	z;
	xHome;
	yHome;
	zHome;
	target;
	speed;
	hitRadius;
	attackDamage
	ready;
	div;
	#idleFrames;
	#activeFrames
	#movementID;
	#currentFrame;
	
	constructor(name, animationFilesObj, posX, posY, posZ, target, speed, hitRadius, damage){
		this.x = posX;
		this.y = posY;
		this.z = posZ;
		this.name = name;
		this.xHome = posX;
		this.yHome = posY;
		this.zHome = posZ;
		this.target = target;
		this.speed = speed;
		this.hitRadius = hitRadius;
		this.attackDamage = damage;
		this.ready = true;
		this.#idleFrames = [];
		this.#activeFrames = [];
		this.#currentFrame = 0;
		this.mountFilesObj(animationFilesObj);
		this.movementID = null;
		
		this.div = document.createElement('div');
		this.div.setAttribute('class', name);
		this.div.appendChild(document.createElement('img'));
		grid.appendChild(this.div);
		
		this.animate("idle");
		this.updatePos();
	}
	
	mountFilesObj(filesObj){
		for (let i = 0; i < filesObj.idleFiles.length; i++) {
			const svg = new Image();
			svg.src = filesObj.idleFiles[i];
			this.#idleFrames.push(svg);
		}
	}
	
	moveTowardTarget() {
		const vectorX = this.target.x - this.x;
		const vectorY = this.target.y - this.y;
		const vectorZ = this.target.z - this.z;
		
		const vectorLength = Math.sqrt((vectorX ** 2) + (vectorY ** 2) + (vectorZ ** 2));
		
		const speedX = this.speed * vectorX/vectorLength;
		const speedY = this.speed * vectorY/vectorLength;
		const speedZ = this.speed * vectorZ/vectorLength;
		
		const inRange = (vectorLength < this.hitRadius) || (vectorLength === NaN);
		
		if(inRange){
			this.ready = true;
			this.target.health -= this.attackDamage;
			this.returnHome();
		} else {
			this.x += speedX;
			this.y += speedY;
			this.z += speedZ;
			this.updatePos();
			this.#movementID = setTimeout(() => {this.moveTowardTarget();}, frameWait);
		}
	}
	
	updatePos() {
		this.div.style.left = this.x + "px";
		this.div.style.bottom = this.y + "px";
		this.div.style.transform = "translateZ(" + this.z + "px) " + "rotateZ(-45deg) rotateX(-55deg)";
	}
	
	returnHome(){
		this.x = this.xHome;
		this.y = this.yHome;
		this.z = this.zHome;
		this.updatePos();
	}
	
	cancelMovement(){
		clearTimeout(this.#movementID);
	}
	
	animate(animation){
		clearTimeout(this.animationID);
		if(animation == "idle"){
			this.#activeFrames = this.#idleFrames;
		}
		this.updateFrame();
	}
	
	updateFrame(){
		
		this.animationID = setTimeout( () => {
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
	
	destroy(){
		clearTimeout(this.animationID);
		this.cancelMovement();
		this.div.remove();
	}
	
}

class gunTower extends attackBuilding{
	
	fireBall;
	
	constructor(tile, posZ){
		super("tower", towerFiles, tile, posZ, 200, 100, 5);
		this.fireBall = new fireBall("fireBall", fireBallFiles, this.x, this.y, posZ, this.target, 5, 4, 5);
	}
	
	fireTurret(){
		this.fireBall.ready = false;
		this.fireBall.target = this.target;
		this.fireBall.moveTowardTarget();
	}
	
	attackTarget(){
		
		if(this.target != null && this.inRange() && this.fireBall.ready){
			if(this.target.health > 0) {
				this.fireTurret();
			} else {
				this.fireBall.cancelMovement();
				gameManager.removeDeadEnemies();
			}
		}
	}

	cancelAttackLoop() {
		clearTimeout(this.attackID);
		this.fireBall.cancelMovement();
	}
	
	destroy(){
		clearTimeout(this.animationID);
		clearTimeout(this.attachmentAnimationID);
		clearTimeout(this.attackID);
		this.div.remove();
		this.fireBall.destroy();
		this.tile.full = false;
		if(this.attachmentFrames.length > 0){
			this.attachmentDiv.remove();
		}
	}
	
}

// const base1 = new Building("base", baseFiles, 1, 1, 40, 200);
// const base2 = new Building("base", baseFiles, 4, 2, 40, 200);
// const base3 = new Building("base", baseFiles, 6, 3, 40, 200);
// const base4 = new Building("base", baseFiles, 8, 4, 40, 200);
// const base5 = new Building("base", baseFiles, 1, 6, 40, 200);
// const base6 = new Building("base", baseFiles, 4, 7, 40, 200);
// const base7 = new Building("base", baseFiles, 6, 8, 40, 200);
// const base8 = new Building("base", baseFiles, 8, 5, 40, 200);

// const tower1 = new gunTower(5, 5, 95);
// tower1.animate("idle");
// const tower2 = new gunTower(2, 7, 95);
// tower2.animate("idle");

// const targets = [base1, base2, base3, base4, base5, base6, base7, base8, tower1, tower2];

const alien1 = new Enemy("alien", alienFiles, 200, 200, 40, 2, 1, 50, "translateX(-20px) translateY(20px) rotateZ(-45deg) rotateX(-55deg)");
alien1.animate("move");
const alien2 = new Enemy("alien", alienFiles, 100, 200, 40,  2, 1, 50, "translateX(-20px) translateY(20px) rotateZ(-45deg) rotateX(-55deg)");
alien2.animate("move");
const alien3 = new Enemy("alien", alienFiles, 20, 10, 40,  2, 1, 50, "translateX(-20px) translateY(20px) rotateZ(-45deg) rotateX(-55deg)");
alien3.animate("move");
const alien4 = new Enemy("alien", alienFiles, 30, 300, 40, 2, 1, 50, "translateX(-20px) translateY(20px) rotateZ(-45deg) rotateX(-55deg)");
alien4.animate("move");

const enemies = [alien1, alien2, alien3, alien4];

// gameManager.setTargets(targets);
gameManager.setEnemies(enemies);

gameManager.updateEnemyTargets();
gameManager.updateBuildingTargets();
store.initialize();