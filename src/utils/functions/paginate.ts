/**
 * Return a slice of an array by providing a page and a page size
 * @returns {object} The page, and some additional information
 */
export default function paginate(array: Array<any>, page: number = 1, pageSize: number = 10): object {
	const startIndex = page * pageSize;
	const endIndex = page * pageSize + pageSize;
	const pageCount = Math.ceil(pageSize / array.length) + 1;

	if (page > pageCount || page < 0) {
		return {
			page: [],
			pageCount
		};
	}

	return {
		page: array.slice(startIndex, endIndex),
		pageCount
	};
}
