navBar = document.querySelector('nav ul');
main = document.querySelector('main');
footer = document.querySelector('footer');
refresh = 1;
navMax = 60;

function moveNavLeft(pos) {
	if(pos >= 0){
		navBar.style.width = pos + "px";
		main.style.marginLeft = pos + "px";
		footer.style.marginLeft = pos + "px";
		setTimeout( () => {moveNavLeft(pos - 1);}, refresh);
	}
}

function moveNavRight(pos) {
	if(pos <= navMax){
		navBar.style.width = pos + "px";
		main.style.marginLeft = pos + "px";
		footer.style.marginLeft = pos + "px";
		setTimeout( () => {moveNavRight(pos + 1);}, refresh);
	}
}

function toggleNav(){
	let linePos = navBar.clientWidth;
	if (linePos > 2){
		moveNavLeft(linePos);
	}
	else{
		moveNavRight(linePos);
	}
}