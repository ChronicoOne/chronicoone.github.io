		const refresh = 17;
		const G = 0.02;
		const player = document.getElementById('Player');
		const arrow = document.getElementById('Arrow');
		
		const fallingVerts = [];
		const fallingHearts = [];
		
		const scoreBox = document.getElementById('Score');
		const healthBox = document.getElementById('Health');
		const highScoreBox = document.getElementById('HighScore');
		
		let highScore = 0;
		
		const scoreCookie = localStorage.getItem('highScore');
		
		if (typeof localStorage.getItem('highScore') === 'undefined') {
			localStorage.setItem('highScore', '0');
		} else {
			highScore = +(scoreCookie);
			updateHighScore();
		}
		
		
		let maxVerts = 5;
		let dropInterval = 10000;
		let health = 10;
		let posX = 0;
		let posY = 0;
		let velX = 0;
		let velY = 0;
		let launch = 50;
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
		
		let vh = window.innerHeight;
		let vw = window.innerWidth;
		
		function restart(){
			maxVerts = 5;
			dropInterval = 10000;
			health = 10;
			posX = 0;
			posY = 0;
			velX = 0;
			velY = 0;
			launch = 50;
			score = 0;
			arrowHeight = 20;
			arrowWidth = 20;
			arrowOffsetY = 10;
			arrowOffsetX = 10;
			vertSpawnX = 50;
			vertSpawnY = -10;
		
			setTimeout( () => {running = true; }, refresh * 10)
		}
		
		function gravity() {
			velY += G;
			for (const vert of fallingVerts) {
				vert.velY += G;
			}
		}
		
		function updatePlayerPos() {
			posX += velX;
			posY += velY;
		}
			
		function growArrow() {
			if(growing === true && (launch < 200)){
				arrowHeight += 2;
				launch = launch + refresh;
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
			}, refresh * Math.random() * dropInterval);
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
				} else if ( Math.abs(vert.x - (posX + 50)) < ( 5 * (vh/vw)) && Math.abs(vert.y - (posY + 45)) < 9){
					fallingVerts.splice(i, 1);
					vert.div.remove();
					if (running) {
						health--;
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
		
		function gameLoop(){
			
			
			setTimeout(() => {  	
									vh = window.innerHeight;
									vw = window.innerWidth;
									
									
									tilt = Math.atan((cursorY - posY - 50) / (cursorX - posX - 49.99)) + 1.57;
									
									if(cursorX - posX - 49.99 < 0){
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
										
										if (dropInterval > 100) {
											dropInterval -= 1;
										}
										
										if (maxVerts < 5000) {
											maxVerts += 0.003;
										}
										
									} else {
										while(fallingVerts.length > 0){
											fallingVerts[0].div.remove();
											fallingVerts.shift();
										}
										
										localStorage.setItem('highScore', highScore.toString());
										
										restart();
										
									}

									if (health <= 0 || posX < -55 || posX > 55 || posY < -55 || posY > 55) { growing = false; running = false; }
									
									player.style.left = "calc(50vw - 5vh + " + posX.toString() + "vw";
									player.style.top = "calc(45vh + " + posY.toString() + "vh"; 
									
									arrow.style.height = arrowHeight.toString() + "vh";
									arrow.style.width = arrowWidth.toString() + "vh";
									
									arrow.style.left = "calc(50vw - " + arrowOffsetX.toString() + "vh + " + posX.toString() + "vw";
									arrow.style.top = "calc(50vh - " + arrowOffsetY.toString() + "vh + " + posY.toString() + "vh"; 
									
									arrow.style.transform = "rotate(" + tilt.toString() + "rad)";
									
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
			if (launch === 50){
				growing = true;
			} 
		}
		
		function release() {
			velY = ( Math.sin(tilt - 1.57) * (launch / 200) );
			velX = ( Math.cos(tilt - 1.57) * (launch / 200) );
				
			launch = 50;
			arrowHeight = 20;
			arrowWidth = 20;
			
			growing = false;
		}
		
		document.addEventListener('keydown', (event) => {
			let name = event.code;
			
			if (name === "KeyR"){
				running = false;
			}

			if (name == "Space" && launch < 200){
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
		
		gameLoop();