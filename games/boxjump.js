		const refresh = 16;
		const initialG = 0.015;
		const gIncreaseRate = 0.000001;
		const gMax = 0.05;
		const player = document.getElementById('Player');
		const arrow = document.getElementById('Arrow');
		const halfWidth = 5;
		const initialHealth = 3;
		const halfVertWidth = 0.5;
		const halfVertLength = 10;	
		const dropWait = 10000;
		
		const launchMin = 2;
		const launchPoint = 400;
		
		const fallingVerts = [];
		const fallingHearts = [];
		
		
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
		
		let vh = window.innerHeight;
		let vw = window.innerWidth;
		let playerUnits = '';
		
		if (vw > vh) {
			playerUnits = 'vh';
		}
		else {
			playerUnits = 'vw';
		}
		
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
		let posX = 0;
		let posY = 0;
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
		
		let growing = false;
		let running = true;
		
		function restart(){
			G = initialG;
			maxVerts = 5;
			health = initialHealth;
			posX = 0;
			posY = 0;
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

			setTimeout( () => {running = true; }, refresh * 10)
		}
		
		function gravity() {
			velY += G;
			for (const vert of fallingVerts) {
				vert.velY += G * 2;
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
		
		
		function makeVerts() {
			setTimeout( () => {
				if (fallingVerts.length < maxVerts){
					const vert = document.createElement("div");
					vert.classList.add("fallingVert");
					vertSpawnX = Math.random() * 100;
					vert.style.left = vertSpawnX.toString() + "vw";
					vert.style.top = vertSpawnY.toString() + "vh";
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
				//collision detection
				} else {
					
					if ( playerUnits == 'vh' ){
						if ( Math.abs(vert.x - (posX + 50) + halfVertWidth) < ( halfWidth * (vh/vw)) && Math.abs(vert.y - (posY + 50) + halfWidth) < (halfWidth * 2)){
							fallingVerts.splice(i, 1);
							vert.div.remove();
							if (running) {
								health--;
							}
						}
					} else {
						if ( Math.abs(vert.x - (posX + 50) + halfVertWidth) < halfWidth && Math.abs(vert.y - (posY + 50) + (halfWidth * (vw / vh))) < halfVertLength){
							fallingVerts.splice(i, 1);
							vert.div.remove();
							if (running) {
								health--;
							}
						}
					}
				}
				
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
									}
									else {
										playerUnits = 'vw';
									}
									
									document.body.style.fontSize = "7" + playerUnits;
									
									tilt = Math.atan((cursorY - posY - 50) / (cursorX - posX - 50.00001)) + 1.57;
									
									
									if(cursorX - posX - 50 < 0){
										tilt = 3.14 + tilt;
									} 
									
									if (running) {
										gravity();
										updatePlayerPos();
										makeVerts();
										
										score += 0.1;
										
										updateScore();
										updateHealth();
										growArrow();
										updateVerts();
										
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

									if (health <= 0 || posX < -50 - (halfWidth) || posX > 50 + (halfWidth) || posY < -50 - (halfWidth) || posY > 50 + (halfWidth)) { growing = false; running = false; }
									
									player.style.left = "calc(50vw - " + halfWidth + playerUnits + " + " + posX + "vw";
									player.style.top = "calc(50vh - " + halfWidth + playerUnits + " + " + posY + "vh"; 
									player.style.width = (halfWidth * 2) + playerUnits;
									player.style.height = (halfWidth * 2) + playerUnits;
									player.style.transform = "rotate(" + Math.sin(tilt) + "rad)";
									
									arrow.style.height = arrowHeight + playerUnits;
									arrow.style.width = arrowWidth + playerUnits;
									
									arrow.style.left = "calc(50vw - " + arrowOffsetX + playerUnits + " + " + posX + "vw";
									arrow.style.top = "calc(50vh - " + arrowOffsetY + playerUnits + " + " + posY + "vh"; 
									
									arrow.style.transform = "rotate(" + tilt + "rad)";
									
									if (score > highScore) {
										highScore = score;
										updateHighScore();
									}
									
									gameLoop();
									
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
			velY = ( Math.sin(tilt - 1.57) * (launch / 200) );
			velX = ( Math.cos(tilt - 1.57) * (launch / 200) );
				
			launch = launchMin;
			arrowHeight = 20;
			arrowWidth = 20;
			
			growing = false;
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