const copyCodeButtons = document.querySelectorAll(".code-copy");
const clickColor = "#d6d6cb";
const mainColor = "#fffff2";
const clickWait = 100;

function copyCodeDown(event) {
		navigator.clipboard.writeText(this.getAttribute("copy-string"));
		this.style.backgroundColor = clickColor;
}

function copyCodeUp(event) {
		navigator.clipboard.writeText(this.getAttribute("copy-string"));
		this.style.backgroundColor = mainColor;
}

for(const copyButton of copyCodeButtons){
	copyButton.addEventListener("mousedown", copyCodeDown);
	copyButton.addEventListener("mouseup", copyCodeUp);
	copyButton.addEventListener("mouseleave", copyCodeUp);
}