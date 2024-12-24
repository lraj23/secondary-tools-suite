function defineById(ids) {
	for (var i = 0; i < ids.length; i++) {
		window[ids[i]] = document.getElementById(ids[i]);
	}
}
defineById(["cur1", "pos1", "w81", "cur2", "pos2", "w82", "cur3", "pos3", "w83", "nextsec", "points", "future", "overall", "calculate", "input", "output"]);
calculate.onclick = function () {
	input.style.display = "none";
	output.style.display = "";
};