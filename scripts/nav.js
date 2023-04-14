const navBar = document.querySelector('nav ul');
const main = document.querySelector('main');
const footer = document.querySelector('footer');
const refresh = 5;
const navMax = 60;

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

function loadNavPosition() {
	nav_pos = localStorage.getItem("nav_pos");
	if (nav_pos == "o" || nav_pos == "c"){
		return nav_pos;
	}
	else {
		localStorage.setItem("nav_pos", "o");
		return loadNavPosition();
	}
}

function toggleNav(){
	let linePos = navBar.clientWidth;
	if (linePos > 2){
		moveNavLeft(linePos);
		localStorage.setItem("nav_pos", "c");
	}
	else{
		moveNavRight(linePos);
		localStorage.setItem("nav_pos", "o");
	}
}

const maxPX = navMax + "px";

if(loadNavPosition() == "c") {
	navBar.style.width = "0px";
	footer.style.width = "calc(100% - 0px)";
	footer.style.marginLeft = "0px";
	main.style.marginLeft = "0px";
} else {
	navBar.style.width = maxPX;
	footer.style.width = "calc(100% - " + navMax + "px)";
	footer.style.marginLeft = maxPX;
	main.style.marginLeft = maxPX;
}