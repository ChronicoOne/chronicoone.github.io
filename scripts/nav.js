navBar = document.querySelector('nav ul');
main = document.querySelector('main');
footer = document.querySelector('footer');
refresh = 5;
navMax = 60;

function moveNavLeft(pos) {
	if(pos >= 0){
		setTimeout( () => {
			posPX = pos + "px"
			navBar.style.width = posPX;
			main.style.marginLeft = posPX;
			footer.style.marginLeft = posPX;
			footer.style.width = "calc(100% - " + pos + "px)";
			moveNavLeft(pos - 3);
		}, refresh);
	}
}

function moveNavRight(pos) {
	if(pos <= navMax){
		setTimeout( () => {
			posPX = pos + "px";
			navBar.style.width = posPX;
			main.style.marginLeft = posPX;
			footer.style.marginLeft = posPX;
			footer.style.width = "calc(100% - " + pos + "px)";
			moveNavRight(pos + 3);
		}, refresh);
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