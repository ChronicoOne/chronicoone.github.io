const editor = document.getElementById("outer");

const refresh = 16;
const initialG = 0.015;
const gIncreaseRate = 0.000001;
const gMax = 0.05;
const player = document.getElementById('Player');
const arrow = document.getElementById('Arrow');
const halfWidth = 5;
const initialHealth = 3;
const halfVertWidth = 0.5;
const halfVertHeight = 5;	
const dropWait = 10000;

const launchMin = 2;
const launchPoint = 355;


const heartCoinDropMin = -30;
const heartCoinDropVariation = 10;
const heartCoinDropOffsetInitial = -10;

const halfHeartHeight = 4;
const halfHeartWidth = 4;
const heartCoinElem = document.getElementById("HeartCoin");

const heartCoin = {elem : heartCoinElem, x : Math.random() * 100, y : heartCoinDropMin + heartCoinDropOffsetInitial, w : halfHeartWidth * 2, h : halfHeartHeight * 2, tag : "HeartCoin", velY : 0};

const fallingVerts = [];
const fallingItems = [heartCoin];

const scoreBox = document.getElementById('Score');
const healthBox = document.getElementById('Health');
const highScoreBox = document.getElementById('HighScore');

const gradientTopInitial = [45, 45, 154];
const gradientBottomInitial = [45, 45, 154];

const gradientTop = [0, 0, 0];
const gradientBottom = [0, 0, 0];

for(let i = 0; i < 3; i++){
		gradientTop[i] = gradientTopInitial[i];
		gradientBottom[i] = gradientBottomInitial[i];
}
	
const gradientSpeed = 20;
const gradientInc = [0.75 , 0.5, 1];

const defaultHat = document.createElement('svg');
defaultHat.setAttribute('id', 'head-hat');

let storeOpen = false;

let vh = window.innerHeight;
let vw = window.innerWidth;
let playerUnits = '';

if (vw > vh) {
	playerUnits = 'vh';
}
else {
	playerUnits = 'vw';
}

heartCoinElem.style.width = (halfHeartWidth * 2) + playerUnits;
heartCoinElem.style.height = (halfHeartHeight * 2) + playerUnits;

let highScore = 0;

const scoreCookie = localStorage.getItem('highScore');

if (typeof localStorage.getItem('highScore') === 'undefined') {
	localStorage.setItem('highScore', '0');
} else {
	highScore = +(scoreCookie);
	updateHighScore();
}

let G = initialG;
let maxVerts = 5;
let health = initialHealth;
let posX = 50;
let posY = 50;
let velX = 0;
let velY = 0;
let launch = launchMin;
let score = 0;
let cursorX = 0;
let cursorY = 0;
let tilt = 0;
let arrowHeight = 20;
let arrowWidth = 20;
let arrowOffsetY = 10;
let arrowOffsetX = 10;
let vertSpawnX = 50;
let vertSpawnY = -10;
let heartCoinDropOffset = heartCoinDropOffsetInitial;

let growing = false;
let running = true;

let headHat = defaultHat;
document.body.appendChild(headHat);

function vRatio(v){
		if (playerUnits == "vh") {
			return vh / v ;
		} else {
			return vw / v ;
		}
}

function restart(){
	G = initialG;
	maxVerts = 5;
	health = initialHealth;
	posX = 50;
	posY = 50;
	velX = 0;
	velY = 0;
	launch = launchMin;
	score = 0;
	arrowHeight = 20;
	arrowWidth = 20;
	arrowOffsetY = 10;
	arrowOffsetX = 10;
	vertSpawnX = 50;
	vertSpawnY = -10;
	
	for(let i = 0; i < 3; i++){
		gradientTop[i] = gradientTopInitial[i];
		gradientBottom[i] = gradientBottomInitial[i];
	}
	
	for( const item of fallingItems ){
		if( item.tag == "HeartCoin" ){
			item.y  = 200;
		}		
	}
	
	updateItems();
	
	setTimeout( () => {running = true; }, refresh * 10)
}

function gravity() {
	velY += G;
	for (const vert of fallingVerts) {
		vert.velY += G * 2;
	}
	for (const item of fallingItems) {
		item.velY += G;
	}
}

function updatePlayerPos() {
	posX += velX;
	posY += velY;
}
	
function growArrow() {
	if(growing === true && (launch * 1.8 < launchPoint)){
		arrowHeight += 2;
		launch *= 1.8;
	} else {
		growing = false;
	}	

	arrowOffsetY = arrowHeight / 2;
}

function itemCollide(item) {
		let rect1 = item.elem.getBoundingClientRect();
		let rect2 = player.getBoundingClientRect();

		collide = (
			rect1.left < rect2.right &&
			rect1.right > rect2.left &&
			rect1.top < rect2.bottom &&
			rect1.bottom > rect2.top
		);		
	return collide;
}

function vertCollide(vert) {
	let collide = false;
	let rect1 = vert.div.getBoundingClientRect();
	let rect2 = player.getBoundingClientRect();

	collide = (
		rect1.left < rect2.right &&
		rect1.right > rect2.left &&
		rect1.top < rect2.bottom &&
		rect1.bottom > rect2.top
	);
	
	return collide;
}

function makeVerts() {
	setTimeout( () => {
		if (fallingVerts.length < (maxVerts * (vw / 1000) )){
			const vert = document.createElement("div");
			vert.classList.add("fallingVert");
			vertSpawnX = Math.random() * 100;
			vert.style.left = vertSpawnX + "vw";
			vert.style.top = vertSpawnY + "vh";
			vert.style.width = (halfVertWidth * 2) + playerUnits;
			vert.style.height = (halfVertHeight * 2) + playerUnits;
			fallingVerts.push({div : vert, x : vertSpawnX, y : vertSpawnY, velY : 0});
			document.body.append(vert);
		}
	}, refresh * Math.random() * dropWait);
}

function updateVerts() {
	let i = 0;
	
	for (const vert of fallingVerts) {
		vert.y += vert.velY;
		vert.div.style.top = vert.y.toString() + "vh";
		
		
		if (vert.y > 100) { 
			fallingVerts.splice(i, 1);
			vert.div.remove();

		} else {
			if (vertCollide(vert)){
					fallingVerts.splice(i, 1);
					vert.div.remove();
					if (running) {
						health--;
					}
				}
		}
		
		i++;
	}
}

function updateItems() {
	let i = 0;
	for (const item of fallingItems) {
		if (item.tag == "HeartCoin") {
			if (itemCollide(item)) {
					item.y  = heartCoinDropMin + heartCoinDropOffset - (Math.random() * heartCoinDropVariation);
					item.x = Math.random() * 100;
					item.velY = 0;
					
					if (running) {
						health++;
					}
			}
			
			if (item.y > 100){
				item.y  = heartCoinDropMin + heartCoinDropOffset - (Math.random() * heartCoinDropVariation);
				item.x = Math.random() * 100;
				item.velY = 0;
			}
			item.y += item.velY;
		}
		
		item.elem.style.top = item.y + "vh";
		item.elem.style.left = item.x + "vw";
		item.elem.style.width = item.w + playerUnits;
		item.elem.style.height = item.h + playerUnits;
		
		i++;
	}
}

function updateScore(){
	scoreBox.textContent = Math.trunc(score).toString();
}

function updateHealth(){
	healthBox.textContent = health.toString();
}

function updateHighScore(){
	highScoreBox.textContent = Math.trunc(highScore).toString();
}

function gradientLoop() {
	setTimeout(() => {
		document.body.style.backgroundImage = ("linear-gradient(rgb(" + 
											   (200 + gradientTop[0]) + ", " + (200 + gradientTop[1]) + ", " + (100 + gradientTop[2]) + "), " +
											   "rgb( " + (200 + gradientBottom[0]) + ", " + (200 + gradientBottom[1]) + ", " + (100 + gradientBottom[2]) + ")" + ")");
	
		gradientTop[0] = (gradientTop[0] - gradientInc[0]);
		gradientTop[1] = (gradientTop[1] - gradientInc[1]);
		//gradientTop[2] = (gradientTop[2] - gradientInc[2]);
		
		gradientBottom[0] = (gradientBottom[0] - gradientInc[0]);
		gradientBottom[1] = (gradientBottom[1] - gradientInc[1]);
		//gradientBottom[2] = (gradientBottom[2] - gradientInc[2]);

		if(Math.abs(gradientTop[0]) >= 54){
			gradientInc[0] = -gradientInc[0];
		}
		
		if(Math.abs(gradientTop[1]) >= 54){
			gradientInc[1] = -gradientInc[1];
		}
		
		if(Math.abs(gradientTop[2]) >= 154){
			gradientInc[2] = -gradientInc[2];
		}
		
		gradientLoop();
		
	}, refresh * gradientSpeed)
}

function gameLoop(){
	
	
	setTimeout(() => {  	
							vh = window.innerHeight;
							vw = window.innerWidth;
							
							if (vw > vh) {
								playerUnits = 'vh';
							} else {
								playerUnits = 'vw';
							}
							
							document.body.style.fontSize = "7" + playerUnits;
							
							tilt = Math.atan((cursorY - posY - (halfWidth * vRatio(vh))) / (cursorX - posX - (halfWidth * vRatio(vw)) + 0.0000001)) + 1.57;
							
							if(cursorX - (posX + (halfWidth * vRatio(vw))) < 0){
								tilt = 3.14 + tilt;
							} 
							
							playerTilt = Math.sin(tilt);
							
							if (running) {
								gravity();
								updatePlayerPos();
								makeVerts();
								
								score += 0.1;
								
								updateScore();
								updateHealth();
								growArrow();
								updateVerts();
								updateItems();
								
								if (maxVerts < 5000) {
									maxVerts += 0.003;
								}
								
								if (G < gMax) {
									G += gIncreaseRate;
								}
								
							} else {
								while(fallingVerts.length > 0){
									fallingVerts[0].div.remove();
									fallingVerts.shift();
								}
								
								localStorage.setItem('highScore', highScore.toString());
								
								restart();
								
							}

							if (health <= 0 || posX < 0 - (halfWidth * vRatio(vw) * 2) || posX > 100 + (halfWidth * vRatio(vw)) || posY < 0 - (halfWidth * vRatio(vh)) || posY > 100 + (halfWidth * vRatio(vh))) { growing = false; running = false; }
							
							headHat = document.getElementById('head-hat');
							hatOffset = halfWidth * 1.5;
							hatOffsetX = Math.sin(playerTilt) * hatOffset * vRatio(vw);
							hatOffsetY = Math.cos(playerTilt) * hatOffset * vRatio(vh);
							
							player.style.left = posX + "vw";
							player.style.top = posY + "vh"; 
							player.style.width = (halfWidth * 2) + playerUnits;
							player.style.height = (halfWidth * 2) + playerUnits;
							player.style.transform = "rotate(" + playerTilt + "rad)";
							
							headHat.style.left = (posX + hatOffsetX) + "vw";
							headHat.style.top = (posY - hatOffsetY) + "vh"; 
							headHat.style.width = (halfWidth * 2) + playerUnits;
							headHat.style.height = (halfWidth * 2) + playerUnits;
							headHat.style.transform = "rotate(" + playerTilt + "rad)";
							
							arrow.style.height = arrowHeight + playerUnits;
							arrow.style.width = arrowWidth + playerUnits;
							
							arrow.style.left = "calc(" + (-halfWidth) + playerUnits + " + " + posX + "vw)";
							arrow.style.top = "calc(" + (halfWidth - arrowOffsetY) + playerUnits + " + " + posY + "vh)"; 
							
							arrow.style.transform = "rotate(" + tilt + "rad)";
							
							if (score > highScore) {
								highScore = score;
								updateHighScore();
							}
							
							if(!storeOpen){
								gameLoop();
							}
	}, refresh);
}
	
function trackMouse(event) {
	cursorX = (event.clientX / vw) * 100;
	cursorY = (event.clientY / vh) * 100; 
}

function startGrow() {
	if (launch === launchMin){
		growing = true;
	} 
}

function release() {
	velY = ( Math.sin(tilt - 1.57) * (launch / 130) * vRatio(vh));
	velX = ( Math.cos(tilt - 1.57) * (launch / 130) * vRatio(vw));
		
	launch = launchMin;
	arrowHeight = 20;
	arrowWidth = 20;
	
	growing = false;
}

function toggleStore(){
	if(storeOpen){
		editor.style.visibility = "hidden";
		gameLoop();
	}
	else{
		editor.style.visibility = "visible";
	}
	storeOpen = !storeOpen;
}

document.addEventListener('keydown', (event) => {
	let name = event.code;
	
	if (name === "KeyR"){
		running = false;
	}

	if (name == "Space" && launch < launchPoint){
		startGrow();
	}
	
});

document.addEventListener('keyup', (event) => {
	let name = event.code;
	
	if (name == "Space"){
		release();
	}
	
});

document.addEventListener('pointerdown', (event) => {
	startGrow();
	trackMouse(event);
});

document.addEventListener('pointerup', (event) => {
	release();
});

document.addEventListener('pointermove', trackMouse);

gradientLoop();
gameLoop();