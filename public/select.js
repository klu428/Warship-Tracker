/*
Reference: https://stackoverflow.com/questions/19611557/how-to-set-default-value-for-html-select
*/

function selectClass(clid) {

	var classification = document.getElementById('class-selector');

	for (var i, j = 0; i = classification.options[j]; j++) {
		if(i.value == clid) {
			classification.selectedIndex = j;
			break;
		}
	}	
}

function selectCountry(coid) {

	var country = document.getElementById('country-selector');

	for (var i, j = 0; i = country.options[j]; j++) {
		if(i.value == coid) {
			country.selectedIndex = j;
			break;
		}
	}
}