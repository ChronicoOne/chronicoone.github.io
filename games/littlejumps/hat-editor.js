const ellipseButton = document.getElementById("ellipse-button");
const rectButton = document.getElementById("rect-button");
const polygonButton = document.getElementById("polygon-button");
const deleteButton = document.getElementById("delete-button");

const activeColor = "#DDDDDD";
const inactiveColor = "#EEEEEE";
const shapeCost = 8;
const shapeSellValue = 5;

const hatPath = document.getElementById("path");
const hatPathAnc = document.getElementById("anc-hat-path");

const defaultPath = document.createElementNS('http://www.w3.org/2000/svg', "path");
defaultPath.setAttribute('id', 'path');
defaultPath.setAttribute('d', "M 5 97 Q 50 -85 95 97 Z");
defaultPath.setAttribute('stroke', 'none');
defaultPath.setAttribute('stroke-width', '0.5');
defaultPath.setAttribute('fill', '#9900FF');

const defaultHat = document.createElementNS('http://www.w3.org/2000/svg', "svg");
defaultHat.setAttribute('id', 'hat');
defaultHat.setAttribute('class', 'editor-svg');
defaultHat.setAttribute('viewBox', '0 0 100 100');
defaultHat.appendChild(defaultPath);

const defaultPathAnchor = document.createElementNS('http://www.w3.org/2000/svg', "circle");
defaultPathAnchor.setAttribute('class', 'anchor');
defaultPathAnchor.setAttribute('id', 'anc-hat-path');
defaultPathAnchor.setAttribute('cx', '50');
defaultPathAnchor.setAttribute('cy', '6');
defaultPathAnchor.setAttribute('r', '2');
defaultPathAnchor.setAttribute('stroke', 'none');
defaultPathAnchor.setAttribute('fill', '#453215');

const defaultAnchors = document.createElementNS('http://www.w3.org/2000/svg', "svg");
defaultAnchors.setAttribute('id', 'anchors');
defaultAnchors.setAttribute('class', 'editor-svg');
defaultAnchors.setAttribute('viewBox', '0 0 100 100');
defaultAnchors.appendChild(defaultPathAnchor);

let hat = document.getElementById("hat");
let anchorOverlay = document.getElementById("anchors");

const anchorOffsetX = 2;
const anchorOffsetY = 2;
const anchorRadius = 2;

let activeAnchor = hatPathAnc;
let activeShape = hatPath;

let activeButton = null;

let currentShape = "";

let shapeCounts = {"ellipse" : 0, "polygon" : 0, "rect" : 0}

let down = false;
let build = false;

let fillColor = "#9900FF";


function setHat(){
	const XMLS = new XMLSerializer();
	const hatStr = XMLS.serializeToString(document.getElementById('hat'));
	const hatAnchorsStr = XMLS.serializeToString(document.getElementById('anchors'));
	localStorage.setItem('hat', hatStr);
	localStorage.setItem('hatAnchors', hatAnchorsStr);	
}

function getHatRaw() {
	const parser = new DOMParser();
	let fetchedHat = localStorage.getItem('hat');
	if(fetchedHat === null){
		setHat();
		fetchedHat = localStorage.getItem('hat');
	}
	const doc = parser.parseFromString(fetchedHat, "image/svg+xml");
	return doc.firstChild;
}

function getHat(){
	const hatCopy = getHatRaw().cloneNode(true);
	hatCopy.setAttribute('id', 'head-hat');
	hatCopy.setAttribute('class', '');
	for(const node of hatCopy.children){
		node.setAttribute('id', '');
	}
	return hatCopy;
}

function getHatAnchors(){
	const parser = new DOMParser();
	let fetchedAnchors = localStorage.getItem('hatAnchors');
	if(fetchedAnchors === null){
		setHat();
		fetchedAnchors = localStorage.getItem('hatAnchors');
	}
	const doc = parser.parseFromString(fetchedAnchors, "image/svg+xml");
	return doc.firstChild;
}

function setupHatAnchors(){
	const anchorSVG = document.getElementById('anchors');
	anchorSVG.addEventListener('mousemove', makeMoves);
	anchorSVG.addEventListener('mousedown', (event) => {if (build){buildShape(event.offsetX / 4, event.offsetY / 4); event.stopPropagation();}});
	for(const hatAnchor of anchorSVG.children){
		const tag = hatAnchor.getAttribute('id').split('-')[2];	
		hatAnchor.addEventListener('mousedown', (event) => {
											down = true;
											activeAnchor = hatAnchor;
											setActiveShape(document.getElementById(tag));
											event.stopPropagation();
											});
	}
}

function refreshHat(){
	document.getElementById('head-hat').replaceWith(getHat());
	document.getElementById('anchors').replaceWith(getHatAnchors());
	setupHatAnchors();
	document.getElementById('hat').replaceWith(getHatRaw());
	shapeCounts = {"ellipse" : 0, "polygon" : 0, "rect" : 0}
	for(const shape of document.getElementById('hat').children){
		const tag = shape.getAttribute('id');
		const subTag = tag.substring(0, tag.length-1);
		if(subTag[0] + subTag[1] != 'pa'){
			shapeCounts[subTag]++;
		}
	}
	hat = document.getElementById('hat');
	anchorOverlay = document.getElementById('anchors');
}

function sellHat(){
	const shapesNum = +(document.getElementById('hat').childElementCount);
	if (shapesNum > 1){
		document.getElementById("Coins").textContent = +(document.getElementById("Coins").textContent) + ((shapesNum - 1) * shapeSellValue);
	}
	
	document.getElementById('hat').replaceWith(defaultHat);
	document.getElementById('anchors').replaceWith(defaultAnchors);
	
	hat = document.getElementById('hat');
	anchorOverlay = document.getElementById('anchors');

	setHat();
	refreshHat();
}

function setActiveShape(shape){
	if (activeShape != null) {
		activeShape.setAttribute('stroke', 'none');
	}
	
	if (shape != null){
		shape.setAttribute('stroke-width', '0.5');
		shape.setAttribute('stroke', 'red');
	}
	activeShape = shape;
}

function setActiveButton(button){
	if (activeButton != null){
		activeButton.style.backgroundColor = inactiveColor;
	}
	if (button != null){
		button.style.backgroundColor = activeColor;
		activeButton = button;
		build = true;
		if (activeButton == deleteButton){
			setTimeout(() => {activeButton.style.backgroundColor = inactiveColor; activeButton = null;}, 100);
		}
	} else {
		build = false;
	}
}

function deleteShape(){
	if (activeShape != null){
		let postID = activeShape.getAttribute('id');
	
		if (postID[0] == "e"){
			document.getElementById('anc-c-' + postID).remove();
			document.getElementById('anc-rx-' + postID).remove();
			document.getElementById('anc-ry-' + postID).remove();
			shapeCounts["ellipse"]--;
			for(const shape of hat.children){
				const shapeId = shape.getAttribute('id');
				let shapeNum = 0;
				if(shapeId[0] == "e"){
					shapeNum = +(shapeId[shapeId.length - 1]);
					if(shapeNum > +(postID[postID.length - 1])){
						shapeNum--;
					}
					shape.setAttribute("id", "ellipse" + shapeNum);
				}
			}
			for(const shapeAnchor of anchorOverlay.children){
				const anchorId = shapeAnchor.getAttribute('id');
				const splitId = anchorId.split('-');
				const shapeId = splitId[splitId.length - 1];
				let shapeNum = 0;
				if(shapeId[0] == "e"){
					shapeNum = +(shapeId[shapeId.length - 1]);
					if(shapeNum > +(postID[postID.length - 1])){
						shapeNum--;
					}
					shapeAnchor.setAttribute("id", splitId[0] + "-" + splitId[1] + "-" + "ellipse" + shapeNum);
				}
			}
			
		}
		
		if (postID[0] == "r"){
			document.getElementById('anc-c-' + postID).remove();
			document.getElementById('anc-rx-' + postID).remove();
			document.getElementById('anc-ry-' + postID).remove();
			shapeCounts["rect"]--;
			for(const shape of hat.children){
				const shapeId = shape.getAttribute('id');
				let shapeNum = 0;
				if(shapeId[0] == "r"){
					shapeNum = +(shapeId[shapeId.length - 1]);
					if(shapeNum > +(postID[postID.length - 1])){
						shapeNum--;
					}
					shape.setAttribute("id", "rect" + shapeNum);
				}
			}
			for(const shapeAnchor of anchorOverlay.children){
				const anchorId = shapeAnchor.getAttribute('id');
				const splitId = anchorId.split('-');
				const shapeId = splitId[splitId.length - 1];
				let shapeNum = 0;
				if(shapeId[0] == "r"){
					shapeNum = +(shapeId[shapeId.length - 1]);
					if(shapeNum > +(postID[postID.length - 1])){
						shapeNum--;
					}
					shapeAnchor.setAttribute("id", splitId[0] + "-" + splitId[1] + "-" + "rect" + shapeNum);
				}
			}
			
		}
		
		if (postID[0] == "p" && postID[1] == "o"){
			document.getElementById('anc-a-' + postID).remove();
			document.getElementById('anc-b-' + postID).remove();
			document.getElementById('anc-c-' + postID).remove();
			shapeCounts["polygon"]--;
			for(const shape of hat.children){
				const shapeId = shape.getAttribute('id');
				let shapeNum = 0;
				if(shapeId[0] + shapeId[1] == "po"){
					shapeNum = +(shapeId[shapeId.length - 1]);
					if(shapeNum > +(postID[postID.length - 1])){
						shapeNum--;
					}
					shape.setAttribute("id", "polygon" + shapeNum);
				}
			}
			for(const shapeAnchor of anchorOverlay.children){
				const anchorId = shapeAnchor.getAttribute('id');
				const splitId = anchorId.split('-');
				const shapeId = splitId[splitId.length - 1];
				let shapeNum = 0;
				if(shapeId[0] + shapeId[1] == "po"){
					shapeNum = +(shapeId[shapeId.length - 1]);
					if(shapeNum > +(postID[postID.length - 1])){
						shapeNum--;
					}
					shapeAnchor.setAttribute("id", splitId[0] + "-" + splitId[1] + "-" + "polygon" + shapeNum);
				}
			}
		}
	
		if (postID[0] == "p" && postID[1] == "a"){
			document.getElementById('anc-hat-' + postID).remove();
		}
		
		activeShape.remove();
		activeShape = null;
		document.getElementById("Coins").textContent = +(document.getElementById("Coins").textContent) + shapeSellValue;
	}
	setupHatAnchors();
}

function buildShape(x, y) {
	build = false;
	if (activeButton != null){
		activeButton.style.backgroundColor = inactiveColor;
	}
	if(+(document.getElementById("Coins").textContent) >= shapeCost){
		document.getElementById("Coins").textContent = +(document.getElementById("Coins").textContent) - shapeCost;
		const shape = document.createElementNS('http://www.w3.org/2000/svg', currentShape);
		shape.setAttribute('id', currentShape + shapeCounts[currentShape]);
		shape.setAttribute('fill', fillColor);
		
		if (currentShape == "ellipse") {
			shape.setAttribute('cx', x);
			shape.setAttribute('cy', y);
		
			shape.setAttribute('rx', 5);
			shape.setAttribute('ry', 5);
		
			let rxAnchor = document.createElementNS('http://www.w3.org/2000/svg', "circle");
			rxAnchor.setAttribute('class', 'anchor');
			rxAnchor.setAttribute('id', 'anc-rx-' + currentShape + shapeCounts[currentShape]);
			rxAnchor.setAttribute('r', anchorRadius);
			rxAnchor.setAttribute('cx', x + 5 + anchorOffsetX);
			rxAnchor.setAttribute('cy', y);
			rxAnchor.setAttribute('stroke', 'none');
			rxAnchor.setAttribute('fill', '#453215');
		
			anchorOverlay.appendChild(rxAnchor);
		
			rxAnchor.addEventListener('mousedown', (event) => {
												down = true;
												activeAnchor = rxAnchor;
												setActiveShape(document.getElementById(activeAnchor.id.substring(7)));
												event.stopPropagation();
												});
		
			let ryAnchor = document.createElementNS('http://www.w3.org/2000/svg', "circle");
			ryAnchor.setAttribute('class', 'anchor');
			ryAnchor.setAttribute('id', 'anc-ry-' + currentShape + shapeCounts[currentShape]);
			ryAnchor.setAttribute('r', anchorRadius);
			ryAnchor.setAttribute('cx', x);
			ryAnchor.setAttribute('cy', y - 5 - anchorOffsetY);
			ryAnchor.setAttribute('stroke', 'none');
			ryAnchor.setAttribute('fill', '#453215');
		
			anchorOverlay.appendChild(ryAnchor);
		
			ryAnchor.addEventListener('mousedown', (event) => {
												down = true;
												activeAnchor = ryAnchor;
												setActiveShape(document.getElementById(activeAnchor.id.substring(7)));
												event.stopPropagation();
												});
												
			let cAnchor = document.createElementNS('http://www.w3.org/2000/svg', "circle");
		
			cAnchor.setAttribute('class', 'anchor');
			cAnchor.setAttribute('id', 'anc-c-' + currentShape + shapeCounts[currentShape]);
			cAnchor.setAttribute('r', anchorRadius);
			cAnchor.setAttribute('cx', x);
			cAnchor.setAttribute('cy', y);
			cAnchor.setAttribute('stroke', 'none');
			cAnchor.setAttribute('fill', 'red');
		
			anchorOverlay.appendChild(cAnchor);
			
			cAnchor.addEventListener('mousedown', (event) => {
												down = true;
												activeAnchor = cAnchor;
												setActiveShape(document.getElementById(activeAnchor.id.substring(6)));
												event.stopPropagation();
												});
			activeAnchor = cAnchor;
		}
		
		if (currentShape == "rect"){
			
			shape.setAttribute('width', 10);
			shape.setAttribute('height', 10);
			
			shape.setAttribute('x', x - (10/2));
			shape.setAttribute('y', y - (10/2));
			
		
			let rxAnchor = document.createElementNS('http://www.w3.org/2000/svg', "circle");
			rxAnchor.setAttribute('class', 'anchor');
			rxAnchor.setAttribute('id', 'anc-rx-' + currentShape + shapeCounts[currentShape]);
			rxAnchor.setAttribute('r', anchorRadius);
			rxAnchor.setAttribute('cx', x + 5 + anchorOffsetX);
			rxAnchor.setAttribute('cy', y);
			rxAnchor.setAttribute('stroke', 'none');
			rxAnchor.setAttribute('fill', '#453215');
		
			anchorOverlay.appendChild(rxAnchor);
		
			rxAnchor.addEventListener('mousedown', (event) => {
												down = true;
												activeAnchor = rxAnchor;
												setActiveShape(document.getElementById(activeAnchor.id.substring(7)));
												event.stopPropagation();
												});
		
			let ryAnchor = document.createElementNS('http://www.w3.org/2000/svg', "circle");
			ryAnchor.setAttribute('class', 'anchor');
			ryAnchor.setAttribute('id', 'anc-ry-' + currentShape + shapeCounts[currentShape]);
			ryAnchor.setAttribute('r', anchorRadius);
			ryAnchor.setAttribute('cx', x);
			ryAnchor.setAttribute('cy', y - 5 - anchorOffsetY);
			ryAnchor.setAttribute('stroke', 'none');
			ryAnchor.setAttribute('fill', '#453215');
		
			anchorOverlay.appendChild(ryAnchor);
		
			ryAnchor.addEventListener('mousedown', (event) => {
												down = true;
												activeAnchor = ryAnchor;
												setActiveShape(document.getElementById(activeAnchor.id.substring(7)));
												event.stopPropagation();
												});
												
			let cAnchor = document.createElementNS('http://www.w3.org/2000/svg', "circle");
		
			cAnchor.setAttribute('class', 'anchor');
			cAnchor.setAttribute('id', 'anc-c-' + currentShape + shapeCounts[currentShape]);
			cAnchor.setAttribute('r', anchorRadius);
			cAnchor.setAttribute('cx', x);
			cAnchor.setAttribute('cy', y);
			cAnchor.setAttribute('stroke', 'none');
			cAnchor.setAttribute('fill', 'red');
		
			anchorOverlay.appendChild(cAnchor);
			
			cAnchor.addEventListener('mousedown', (event) => {
												down = true;
												activeAnchor = cAnchor;
												setActiveShape(document.getElementById(activeAnchor.id.substring(6)));
												event.stopPropagation();
												});
			activeAnchor = cAnchor;
		}
		
		if (currentShape == "polygon"){
			let pointA = x + "," + (y - 5);
			let pointB = (x - 5) + "," + (y + 5);
			let pointC = (x + 5) + "," + (y + 5);
			
			shape.setAttribute('points', pointA + " " + pointB + " " + pointC);
			
			let anchorA = document.createElementNS('http://www.w3.org/2000/svg', "circle");
			anchorA.setAttribute('class', 'anchor');
			anchorA.setAttribute('id', 'anc-a-' + currentShape + shapeCounts[currentShape]);
			anchorA.setAttribute('r', anchorRadius);
			anchorA.setAttribute('cx', pointA.split(',')[0]);
			anchorA.setAttribute('cy', pointA.split(',')[1]);
			anchorA.setAttribute('stroke', 'none');
			anchorA.setAttribute('fill', '#453215');
		
			anchorOverlay.appendChild(anchorA);
		
			anchorA.addEventListener('mousedown', (event) => {
												down = true;
												activeAnchor = anchorA;
												setActiveShape(document.getElementById(activeAnchor.id.substring(6)));
												event.stopPropagation();
												});
			
			let anchorB = document.createElementNS('http://www.w3.org/2000/svg', "circle");
			anchorB.setAttribute('class', 'anchor');
			anchorB.setAttribute('id', 'anc-b-' + currentShape + shapeCounts[currentShape]);
			anchorB.setAttribute('r', anchorRadius);
			anchorB.setAttribute('cx', pointB.split(',')[0]);
			anchorB.setAttribute('cy', pointB.split(',')[1]);
			anchorB.setAttribute('stroke', 'none');
			anchorB.setAttribute('fill', '#453215');
		
			anchorOverlay.appendChild(anchorB);
		
			anchorB.addEventListener('mousedown', (event) => {
												down = true;
												activeAnchor = anchorB;
												setActiveShape(document.getElementById(activeAnchor.id.substring(6)));
												event.stopPropagation();
												});
			
			let anchorC = document.createElementNS('http://www.w3.org/2000/svg', "circle");
			anchorC.setAttribute('class', 'anchor');
			anchorC.setAttribute('id', 'anc-c-' + currentShape + shapeCounts[currentShape]);
			anchorC.setAttribute('r', anchorRadius);
			anchorC.setAttribute('cx', pointC.split(',')[0]);
			anchorC.setAttribute('cy', pointC.split(',')[1]);
			anchorC.setAttribute('stroke', 'none');
			anchorC.setAttribute('fill', '#453215');
		
			anchorOverlay.appendChild(anchorC);
		
			anchorC.addEventListener('mousedown', (event) => {
												down = true;
												activeAnchor = anchorC;
												setActiveShape(document.getElementById(activeAnchor.id.substring(6)));
												event.stopPropagation();
												});
			activeAnchor = anchorA;
		}
		
		shapeCounts[currentShape]++;
		setActiveShape(shape);
		hat.appendChild(shape);
	}
}

function moveHatTip(x, y){
	activeShape.setAttribute('d', "M 5 97 Q " + x + " " + ((y * 2) - 97) + " 95 97 Z");
	activeAnchor.setAttribute('cx', x);
	activeAnchor.setAttribute('cy', y);
}

function moveEllipseRX(x){
	let cx = activeShape.getAttribute('cx');
	
	let rx = x - cx;

	if (rx > 0){
		activeShape.setAttribute('rx', rx);
		activeAnchor.setAttribute('cx', x + anchorOffsetX);
	}
}

function moveEllipseRY(y){
	let cy = activeShape.getAttribute('cy');
	
	let ry = cy - y;

	if (ry > 0){
		activeShape.setAttribute('ry', ry);
		activeAnchor.setAttribute('cy', y - anchorOffsetY);
	}
}

function moveEllipseC(x, y){
	
	let postID = activeShape.getAttribute('id');
	
	activeShape.setAttribute('cx', x);
	activeShape.setAttribute('cy', y);
	
	activeAnchor.setAttribute('cx', x);
	activeAnchor.setAttribute('cy', y);
	
	let rxAnchor = document.getElementById('anc-rx-' + postID);
	
	rxAnchor.setAttribute('cx', Number(activeShape.getAttribute('rx')) + x + anchorOffsetX);
	rxAnchor.setAttribute('cy', y);
	
	let ryAnchor = document.getElementById('anc-ry-' + postID);
	
	ryAnchor.setAttribute('cx', x);
	ryAnchor.setAttribute('cy', y - anchorOffsetY - Number(activeShape.getAttribute('ry')));
	
}

function moveRectRX(x){
	let cornerX = Number(activeShape.getAttribute('x'));
	let rx = x - cornerX;

	if (rx > 0){
		let postID = activeShape.getAttribute('id');
		let cAnchor = document.getElementById('anc-c-' + postID);
		let centerX = cAnchor.getAttribute('cx');
		
		activeShape.setAttribute('width', rx);
		activeShape.setAttribute('x', centerX - (rx/2));
		
		activeAnchor.setAttribute('cx', x + anchorOffsetX);
	}
}

function moveRectRY(y){
	let postID = activeShape.getAttribute('id');
	let cAnchor = document.getElementById('anc-c-' + postID);
	let centerY = cAnchor.getAttribute('cy');
	let ry = centerY - y;

	if (ry > 0){				
		activeShape.setAttribute('height', ry * 2);
		activeShape.setAttribute('y', y);
		
		activeAnchor.setAttribute('cy', y - anchorOffsetX);
	}
}

function moveRectC(x, y){
	
	let postID = activeShape.getAttribute('id');
	let width = Number(activeShape.getAttribute('width'));
	let height = Number(activeShape.getAttribute('height'));
	
	activeShape.setAttribute('x', x - (width/2));
	activeShape.setAttribute('y', y - (height/2));
	
	activeAnchor.setAttribute('cx', x);
	activeAnchor.setAttribute('cy', y);
	
	let rxAnchor = document.getElementById('anc-rx-' + postID);
	
	rxAnchor.setAttribute('cx', (width/2) + x + anchorOffsetX);
	rxAnchor.setAttribute('cy', y);
	
	let ryAnchor = document.getElementById('anc-ry-' + postID);
	
	ryAnchor.setAttribute('cx', x);
	ryAnchor.setAttribute('cy', y - anchorOffsetY - (height/2));
	
}

function movePolygonA(x, y){
	
	let postID = activeShape.getAttribute('id');
	let points = activeShape.getAttribute('points').split(' ');
	
	activeShape.setAttribute('points', x + "," + y + " " + points[1] + " " + points[2]);
	
	activeAnchor.setAttribute('cx', x);
	activeAnchor.setAttribute('cy', y);
}
function movePolygonB(x, y){
	
	let postID = activeShape.getAttribute('id');
	let points = activeShape.getAttribute('points').split(' ');
	
	activeShape.setAttribute('points',  points[0] + " " + x + "," + y + " " + points[2]);
	
	activeAnchor.setAttribute('cx', x);
	activeAnchor.setAttribute('cy', y);
}
function movePolygonC(x, y){
	
	let postID = activeShape.getAttribute('id');
	let points = activeShape.getAttribute('points').split(' ');
	
	activeShape.setAttribute('points', points[0] + " " + points[1] + " " + x + "," + y);
	
	activeAnchor.setAttribute('cx', x);
	activeAnchor.setAttribute('cy', y);
}

function makeMoves(event){
	let x = event.offsetX / 4;
	let y = event.offsetY / 4;
	
	if (down) {
		if (activeAnchor.id == "anc-hat-path"){moveHatTip(x, y);
		} else if (activeAnchor.id.substring(0, 8) == "anc-rx-e"){moveEllipseRX(x);
		} else if (activeAnchor.id.substring(0, 8) == "anc-ry-e"){moveEllipseRY(y);
		} else if (activeAnchor.id.substring(0, 7) == "anc-c-e"){moveEllipseC(x, y);
		} else if (activeAnchor.id.substring(0, 8) == "anc-rx-r"){moveRectRX(x);
		} else if (activeAnchor.id.substring(0, 8) == "anc-ry-r"){moveRectRY(y);
		} else if (activeAnchor.id.substring(0, 7) == "anc-c-r"){moveRectC(x, y);
		} else if (activeAnchor.id.substring(0, 7) == "anc-a-p"){movePolygonA(x, y);
		} else if (activeAnchor.id.substring(0, 7) == "anc-b-p"){movePolygonB(x, y);
		} else if (activeAnchor.id.substring(0, 7) == "anc-c-p"){movePolygonC(x, y);
		}
	}
}

anchorOverlay.addEventListener('mousedown', (event) => {if (build){buildShape(event.offsetX / 4, event.offsetY / 4); event.stopPropagation();}});

hatPathAnc.addEventListener('mousedown', (event) => {
											down = true;
											activeAnchor = hatPathAnc;
											setActiveShape(hatPath);
											event.stopPropagation();
											});

anchorOverlay.addEventListener('mousemove', makeMoves);

document.addEventListener('mouseup', (event) => {down = false;});

document.addEventListener('mousedown', (event) => {
											setActiveShape(null); 
											setActiveButton(null);
											if (activeButton != null){
												activeButton.style.backgroundColor = inactiveColor;
											}});

ellipseButton.addEventListener('mousedown', (event) => {setActiveButton(ellipseButton); currentShape = "ellipse"; event.stopPropagation();});

rectButton.addEventListener('mousedown', (event) => {setActiveButton(rectButton); currentShape = "rect"; event.stopPropagation();});

polygonButton.addEventListener('mousedown', (event) => {setActiveButton(polygonButton); currentShape = "polygon"; event.stopPropagation();});

deleteButton.addEventListener('mousedown', (event) => {setActiveButton(deleteButton);  build = false; deleteShape(); event.stopPropagation();});

document.addEventListener('keydown', (event) => {
	if (event.code == "Delete" || event.code == "Backspace"){
		setActiveButton(deleteButton);  build = false; deleteShape(); event.stopPropagation();
	}
});

for (const td of document.querySelectorAll('td')){
	
	td.addEventListener('mousedown', (event) => {
		
		fillColor = td.style.backgroundColor;
		for (const button of document.querySelectorAll('.button-svg *')){
				button.setAttribute('fill', fillColor);
			}
		if (activeShape != null) {
			activeShape.setAttribute('fill', fillColor);
			event.stopPropagation();
		}
	});
}

refreshHat();
setActiveShape(hatPath);