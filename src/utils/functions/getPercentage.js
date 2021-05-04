/**
 * Get a percentage from a value. Will remove characters from strings and find the numbers.
 * @param {*} percentage
 * @returns {integer} value between 0 and 100
 */
function getPercentage(percentage) {
	// Remove any characters that are not a number and convert it to an integer.
	const volumeInt = parseInt(percentage.replace(/[^0-9]+/g, ''));

	// Check if the conversion is successful
	if (volumeInt === NaN || volumeInt > 100 || volumeInt < 0) return false;

	return volumeInt || false;
}

module.exports = getPercentage;
