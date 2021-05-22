/**
 * Return a slice of an array by providing a page and a page size
 * @returns {object} The page, and some additional information
 */
export default function paginate(array, page = 1, pageSize = 10) {
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
