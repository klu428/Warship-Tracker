/*
Reference: https://stackoverflow.com/questions/19611557/how-to-set-default-value-for-html-select
*/

function selectFilter(coid) {
	
	var country = document.getElementById('filter-selector');

	for (var i, j = 0; i = country.options[j]; j++) {
		if(i.value == coid) {
			country.selectedIndex = j;
			break;
		}
	}
}