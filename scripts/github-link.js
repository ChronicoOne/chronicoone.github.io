const pwd = document.getElementById('pwd').textContent.trim().substring(1);

const githubAnchor = document.getElementById('github');

let githubLink = "https://github.com/ChronicoOne/chronicoone.github.io/tree/master/";

let dir = "";

if (pwd !== 'tutorials' && pwd !== 'projects' && pwd !== 'games'){
	
	dir = document.querySelector(".active").textContent.trim().toLowerCase();

	if (dir === "home") {
		dir = "";
	}
}


githubAnchor.href = githubLink + dir + pwd;
