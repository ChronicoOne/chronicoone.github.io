const headerContent = "Chronico.One";
const header = document.querySelector("header h1");

function pageCrop(){
	if(window.innerWidth <= 150){
		header.textContent = "Chronico";
	} else {
		header.textContent = headerContent;
	}
}


document.addEventListener("resize", (event) => {pageCrop();});

pageCrop();