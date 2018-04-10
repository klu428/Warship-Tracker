/*
Reference: https://stackoverflow.com/questions/19611557/how-to-set-default-value-for-html-select
*/

function selectFought(sid, bid) {
	
	var ship = document.getElementById('ship-selector');

	for (var i, j = 0; i = ship.options[j]; j++) {
		if(i.value == sid) {
			ship.selectedIndex = j;
			break;
		}
	}

	var battle = document.getElementById('battle-selector');

	for (var i, j = 0; i = battle.options[j]; j++) {
		if(i.value == bid) {
			battle.selectedIndex = j;
			break;
		}
	}
}