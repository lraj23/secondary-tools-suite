var addHW = document.getElementById("add-hw");
var addEvent = document.getElementById("add-event");
document.getElementsByClassName("remove")[0].onclick = function () {
	document.getElementsByClassName("hw-item")[0].remove();
};
document.getElementsByClassName("remove")[1].onclick = function () {
	document.getElementsByClassName("nonmove-item")[0].remove();
};
addHW.onclick = function () {
	var hwItem = document.createElement("div");
	hwItem.className = "hw-item";
	var hwName = document.createElement("input");
	hwName.type = "text";
	hwName.placeholder = "Assignment name";
	var hwDueDate = document.createElement("input");
	hwDueDate.type = "date";
	var hwDifficulty = document.createElement("select");
	hwDifficulty.innerHTML = '<option value="-1" selected disabled>Assignment difficulty</option><option value="0">Really easy</option><option value="1">Simple</option><option value="2">Needing effort</option><option value="3">Confusing</option><option value="4">Confounding!</option>';
	var hwDuration = document.createElement("input");
	hwDuration.type = "time";
	var removeHW = document.createElement("button");
	removeHW.className = "remove";
	removeHW.innerText = "Remove";
	document.getElementById("hw-items").appendChild(hwItem);
	hwItem.appendChild(hwName);
	hwItem.appendChild(hwDueDate);
	hwItem.appendChild(hwDifficulty);
	hwItem.appendChild(hwDuration);
	hwItem.appendChild(removeHW);
	removeHW.onclick = function () {
		hwItem.remove();
	}
};
addEvent.onclick = function () {
	var event = document.createElement("div");
	event.className = "nonmove-item";
	var eventName = document.createElement("input");
	eventName.type = "text";
	eventName.placeholder = "Scheduled event name";
	var eventStart = document.createElement("input");
	eventStart.type = "time";
	var eventEnd = document.createElement("input");
	eventEnd.type = "time";
	var removeEvent = document.createElement("button");
	removeEvent.className = "remove";
	removeEvent.innerText = "Remove";
	document.getElementById("nonmove-items").appendChild(event);
	event.appendChild(eventName);
	event.appendChild(eventStart);
	event.appendChild(eventEnd);
	event.appendChild(removeEvent);
	removeEvent.onclick = function () {
		event.remove();
	}
};