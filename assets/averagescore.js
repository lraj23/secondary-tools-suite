document.querySelectorAll("[id]").forEach(function (e) { window[e.id] = e; });

function stat(type, message) {
	msg.className = type;
	msg.innerHTML = message;
}

calculate.onclick = function () {
	stat("loading", "Loading...");
	document.querySelectorAll("input,select").forEach(function (e) { window[e.id + "val"] = parseFloat(e.value); });
	var section3, result;
	if ((isNaN(cur1val) || isNaN(pos1val) || isNaN(weight1val) || isNaN(cur2val) || isNaN(pos2val) || isNaN(weight2val) || (nextsecval === 0) || isNaN(pointsval) || isNaN(futureval) || isNaN(overallval))) {
		stat("error", "Missing input values");
		return;
	}
	if (isNaN(cur3val) && isNaN(pos3val) && isNaN(weight3val)) {
		section3 = false;
	} else if (!isNaN(cur3val) && !isNaN(pos3val) && !isNaN(weight3val)) {
		section3 = true;
	} else {
		stat("error", "Containing 1 or 2 Section 3 values. Leave all or none blank.");
		return;
	}
	if ((cur1val < 0) || (pos1val <= 0) || (weight1val < 0) || (cur2val < 0) || (pos2val <= 0) || (weight2val < 0) || ((section3) && ((cur3val < 0) || (pos3val <= 0) || (weight3val < 0))) || (pointsval <= 0) || (futureval <= 0)) {
		stat("error", "Values can not be negative. Some values can not be 0.");
		return;
	}
	if ((!section3) && (nextsecval === 3)) {
		stat("error", "Next updated section can not be Section 3 if Section 3 is unused.");
		return;
	}
	if (weight1val + weight2val + (section3 ? weight3val : 0) != 100) {
		stat("error", "Weights of sections in use should add up to 100%.");
		return;
	}

	if (!section3) {
		if (nextsecval === 1) {
			result = (pos1val + pointsval * futureval) * (overallval - weight2val * cur2val / pos2val) / weight1val / futureval - cur1val / futureval;
		} else {
			result = (pos2val + pointsval * futureval) * (overallval - weight1val * cur1val / pos1val) / weight2val / futureval - cur2val / futureval;
		}
	} else {
		if (nextsecval === 1) {
			result = (pos1val + pointsval * futureval) * (overallval - weight2val * cur2val / pos2val - weight3val * cur3val / pos3val) / weight1val / futureval - cur1val / futureval;
		} else if (nextsecval === 2) {
			result = (pos2val + pointsval * futureval) * (overallval - weight1val * cur1val / pos1val - weight3val * cur3val / pos3val) / weight2val / futureval - cur2val / futureval;
		} else {
			result = (pos3val + pointsval * futureval) * (overallval - weight2val * cur2val / pos2val - weight1val * cur1val / pos1val) / weight3val / futureval - cur3val / futureval;
		}
	}

	input.className = "dieOut";
	setTimeout(function () {
		input.style.display = "none";
		output.style.display = "";
	}, 2900);
	res1.innerHTML = result;
	res2.innerHTML = pointsval;
	res3.innerHTML = futureval;
	res4.innerHTML = nextsecval;
	res5.innerHTML = overallval;
};