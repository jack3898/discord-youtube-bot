/**
 * Return a slice of an array by providing a page and a page size
 * @param {array} array The array you want to grab a slice of
 * @param {integer} page Default 0 (page 1). The page you want to get.
 * @param {integer} pageSize Default 10. How large that page is. The bigger this number, the less pages there are.
 * @returns {object} The page, and some additional information
 */
export default function paginate(array, page = 1, pageSize = 10) {
	if (!array instanceof Array) throw TypeError("The first argument provided 'array' is not an instance of Array");

	const validatedPage = parseInt(page) - 1;
	const validatedPageSize = parseInt(pageSize);

	if (Number.isNaN(validatedPage) || Number.isNaN(validatedPageSize)) throw TypeError('The page and or page size provided are not a valid number.');

	const startIndex = validatedPage * validatedPageSize;
	const endIndex = validatedPage * validatedPageSize + validatedPageSize;
	const pageCount = Math.ceil(validatedPageSize / array.length) + 1;

	if (validatedPage > pageCount - 1 || validatedPage < 0) {
		return {
			page: [],
			pageCount
		};
	}

	const result = {
		page: array.slice(startIndex, endIndex),
		pageCount
	};

	return result;
}
