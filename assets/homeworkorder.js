var addHW = document.getElementById("add-hw");
var addEvent = document.getElementById("add-event");
var calculate = document.getElementById("calculate");

function stat(type, message) {
	var msg = document.getElementById("msg");
	msg.className = type;
	msg.innerHTML = message;
}

function timeToMinutes(time) {
	return time.split(":")[0] * 60 + time.split(":")[1] * 1;
}

function minutesToTime(mins) {
	return Math.floor(mins / 60).toString().padStart(2, "0") + ":" + (mins % 60).toString().padStart(2, "0");
}

addHW.onclick = function () {
	var hwItem = document.createElement("div");
	hwItem.className = "hw-item";
	var hwName = document.createElement("input");
	hwName.type = "text";
	hwName.placeholder = "Assignment name";
	hwName.title = "Enter the name of this assignment";
	var hwDueDate = document.createElement("input");
	hwDueDate.type = "date";
	hwDueDate.title = "Enter the due date of this assignment";
	var hwDifficulty = document.createElement("select");
	hwDifficulty.innerHTML = '<option value="-1" selected disabled>Assignment difficulty</option><option value="0">Really easy</option><option value="1">Simple</option><option value="2">Needing effort</option><option value="3">Confusing</option><option value="4">Confounding!</option>';
	hwDifficulty.title = "Enter the difficulty of this assignment";
	var hwDuration = document.createElement("input");
	hwDuration.type = "time";
	hwDuration.title = "Enter the approximate duration of this assignment";
	var removeHW = document.createElement("button");
	removeHW.className = "remove";
	removeHW.innerText = "Remove";
	removeHW.title = "Use this button to remove this assignment";
	document.getElementById("hw-items").appendChild(hwItem);
	hwItem.appendChild(hwName);
	hwItem.appendChild(hwDueDate);
	hwItem.appendChild(hwDifficulty);
	hwItem.appendChild(hwDuration);
	hwItem.appendChild(removeHW);
	removeHW.onclick = function () {
		hwItem.remove();
	};
};
addHW.click();

addEvent.onclick = function () {
	var event = document.createElement("div");
	event.className = "nonmove-item";
	var eventName = document.createElement("input");
	eventName.type = "text";
	eventName.title = "Enter the name of this event";
	eventName.placeholder = "Scheduled event name";
	var eventStart = document.createElement("input");
	eventStart.type = "time";
	eventStart.title = "Enter the start time of this event";
	var eventEnd = document.createElement("input");
	eventEnd.type = "time";
	eventEnd.title = "Enter the end time of this event";
	var removeEvent = document.createElement("button");
	removeEvent.className = "remove";
	removeEvent.innerText = "Remove";
	removeEvent.title = "Use this button to remove this event";
	document.getElementById("nonmove-items").appendChild(event);
	event.appendChild(eventName);
	event.appendChild(eventStart);
	event.appendChild(eventEnd);
	event.appendChild(removeEvent);
	removeEvent.onclick = function () {
		event.remove();
	};
};
addEvent.click();

calculate.onclick = function () {
	var hwItems = [];
	var events = [];
	var is_err = false;
	var start = document.getElementById("start").value;
	var end = document.getElementById("end").value;
	var i;

	// Creates the arrays of assignments and events
	for (i = 0; i < document.getElementsByClassName("hw-item").length; i++) {
		var hwItem = document.getElementsByClassName("hw-item")[i].childNodes;
		hwItems.push({
			name: hwItem[0].value,
			dueDate: hwItem[1].value,
			difficulty: hwItem[2].value,
			duration: hwItem[3].value,
			id: hwItem[1].value + "-" + (4 - hwItem[2].value) + "-" + (1440 - timeToMinutes(hwItem[3].value)).toString().padStart(4, "0") + "-" + i
		});
	}
	for (i = 0; i < document.getElementsByClassName("nonmove-item").length; i++) {
		var event = document.getElementsByClassName("nonmove-item")[i].childNodes;
		events.push({
			name: event[0].value,
			start: event[1].value,
			end: event[2].value
		});
	}

	// Checks for problems with inputs
	if (start >= end) {
		stat("error", "Must not have no time to work!");
		is_err = true;
	};
	events.forEach(function (event) {
		if (event.start >= event.end) {
			stat("error", "Events must end after they start!");
			is_err = true;
		};
	});
	hwItems.forEach(function (hwItem) {
		var d = new Date();
		var dueDate = hwItem.dueDate;
		if (dueDate < d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate()) {
			stat("error", "Assignments must be due at least today!");
			is_err = true;
		}
	});
	if (hwItems.length === 0) {
		stat("error", "Must have assignments");
		is_err = true;
	}
	document.querySelectorAll("input").forEach(function (el) {
		if (el.value === "") {
			stat("error", "Missing input values");
			is_err = true;
		}
	});
	document.querySelectorAll("select").forEach(function (el) {
		if (el.value === "-1") {
			stat("error", "Missing input values");
			is_err = true;
		}
	});
	if (is_err) return;
	else stat("", "");

	// This code uses the starting and ending times, as well as the events, to
	// determine when the student can work on homework
	var availTimes = [[timeToMinutes(start), timeToMinutes(end)]];
	events.sort(function (event1, event2) {
		var end1 = event1.end, end2 = event2.end;
		if (end1 < end2) return -1;
		if (end1 === end2) return 0;
		return 1;
	});
	events.forEach(function (event) {
		var start = timeToMinutes(event.start); // ex. 900
		var end = timeToMinutes(event.end); // ex. 1080
		for (var i = 0; i < availTimes.length; i++) {
			var availStart = availTimes[i][0];
			var availEnd = availTimes[i][1];
			if ((start <= availStart) && (availStart < end) && (end < availEnd)) {
				availTimes.splice(i, 1, [end, availEnd]);
			} else if ((availStart < start) && (start < availEnd) && (availEnd <= end)) {
				availTimes.splice(i, 1, [availStart, start]);
			} else if ((start <= availStart) && (availEnd <= end)) {
				availTimes.splice(i, 1);
				i--;
			} else if ((availStart < start) && (end < availEnd)) {
				availTimes.splice(i, 1, [availStart, start], [end, availEnd]);
				i++;
			}
		}
	});

	// This code sorts the homework assignments by their ids, which sorts them
	// by earliest to latest due date followed by highest to lowest difficulty,
	// and then longest to shortest durations
	hwItems.sort(function (item1, item2) {
		var id1 = item1.id, id2 = item2.id;
		if (id1 < id2) return -1;
		if (id1 === id2) return 0;
		return 1;
	});

	// This code gives every assignment a starting and ending time based on the
	// available work time, splitting assignments into more than one piece if
	// necessary. Also, assignments can be shortened or lengthened by up to ten
	// minutes if doing so cleanly fits an assignment into a space.
	debugger;
	var availBlockI = 0;
	for (let i = 0; i < hwItems.length; i++) {
		let hwItem = hwItems[i];
		let hwTime = timeToMinutes(hwItem.duration);
		if (availBlockI < availTimes.length) {
			let block = availTimes[availBlockI];
			let partUsed = block[2] || 0;
			let blockTime = block[1] - block[0] - partUsed;
			let extraTime = hwTime - blockTime;
			if (partUsed) {
				let totalTime = hwTime + partUsed;
				if ((extraTime < 0) && (extraTime >= -7)) {
					let timeChanged = Math.round(-extraTime / (block[3] + 1));
					hwItem.startTime = block[0] + partUsed;
					hwItem.endTime = block[0] + partUsed + hwTime;
					for (let j = i - block[3]; j <= i; j++) {
						hwItems[j].startTime += timeChanged * (j - i + block[3]);
						hwItems[j].endTime += timeChanged * (j - 1 + block[3] + 1) - (j == i ? 1 : 0);
						hwItems[j].duration = minutesToTime(timeToMinutes(hwItems[j].duration) + timeChanged - (j == i ? 1 : 0));
					}
					availBlockI++;
				} else if ((extraTime > 0) && ((blockTime + partUsed) / totalTime >= 0.88)) {
					let constant = (blockTime + partUsed) / totalTime;
					hwItem.startTime = block[0] + partUsed;
					hwItem.endTime = block[0] + partUsed + hwTime;
					for (let j = i - block[3]; j <= i; j++) {
						hwItems[j].startTime = Math.round((hwItems[j].startTime - block[0]) * constant) + block[0];
						hwItems[j].endTime = Math.round((hwItems[j].endTime - block[0]) * constant) + block[0];
						hwItems[j].duration = minutesToTime(Math.round(timeToMinutes(hwItems[j].duration) * constant));
					}
					availBlockI++;
				} else if (extraTime < 0) {
					hwItem.startTime = block[0] + partUsed;
					hwItem.endTime = block[0] + partUsed + hwTime;
					block[2] += hwTime;
					block[3]++;
				} else if (extraTime > 0) {
					console.log(hwTime, hwTime - blockTime, minutesToTime(hwTime - blockTime));
					hwItems.splice(i + 1, 0, {
						name: hwItem.name,
						dueDate: hwItem.dueDate,
						difficulty: hwItem.difficulty,
						duration: minutesToTime(hwTime - blockTime)
					});
					hwItem.startTime = block[0] + partUsed;
					hwItem.endTime = block[1];
					hwItem.duration = minutesToTime(blockTime);
					availBlockI++;
				} else {
					hwItem.startTime = block[0] + partUsed;
					hwItem.endTime = block[1];
					availBlockI++;
				}
			} else if (
				((extraTime < 0) && (extraTime >= -7)) || // hwTime can be stretched by up to 7 min to fill blockTime
				((extraTime > 0) && (blockTime / hwTime >= 0.88)) || // hwTime multiplied by 0.88<=num<1 can be blockTime
				(extraTime === 0) // the assignment fits perfectly inside the block of time
			) {
				hwItem.startTime = block[0];
				hwItem.endTime = block[1];
				hwItem.duration = minutesToTime(blockTime);
				availBlockI++;
			} else if (extraTime < 0) {
				hwItem.startTime = block[0];
				hwItem.endTime = block[0] + hwTime;
				block[2] = hwTime;
				block[3] = 1;
			} else if (extraTime > 0) {
				hwItems.splice(i + 1, 0, {
					name: hwItem.name,
					dueDate: hwItem.dueDate,
					difficulty: hwItem.difficulty,
					duration: minutesToTime(hwTime - blockTime)
				});
				hwItem.startTime = block[0];
				hwItem.endTime = block[1];
				hwItem.duration = minutesToTime(blockTime);
				availBlockI++;
			}
		} else {
			let lastMinute = Math.max(timeToMinutes((events[events.length - 1] || { end: "00:00" }).end), (availTimes[availTimes.length - 1] || [0, 0])[1]);
			availTimes.push([lastMinute, lastMinute + hwTime]);
			hwItem.startTime = lastMinute;
			hwItem.endTime = lastMinute + hwTime;
			availBlockI++;
		}
	}

	var input = document.getElementById("input"), output = document.getElementById("output");
	var inputHeightStyle = document.createElement("style");
	inputHeightStyle.innerHTML = ':root{--input-height:' + getComputedStyle(input).height + ';}';
	document.head.appendChild(inputHeightStyle);
	input.className = "dieOut";
	setTimeout(function () {
		input.style.display = "none";
		output.style.display = "";
	}, 2900);
	hwItems.forEach(function (hwItem, i) {
		var p = document.createElement("span");
		p.innerText = "You should " + (hwItem.id ? "" : "continue to") + " work on " + hwItem.name + " for " + timeToMinutes(hwItem.duration) + " minutes, from " + minutesToTime(hwItem.startTime) + " to " + minutesToTime(hwItem.endTime) + "." + ((hwItems[i + 1] || true).id ? "\n\n" : "\n");
		output.appendChild(p);
	});
}