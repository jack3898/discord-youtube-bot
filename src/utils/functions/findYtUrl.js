const {youtube} = require('@googleapis/youtube');

/**
 * Attempt to find a YouTube video URL from any given string
 * @param {string} search
 * @param {Boolean} [resultCount=config.paginate_max_results] Return many results. If not set, the limit in the config will be used.
 * @returns {Array|Boolean} The URL(s) or if an error occurred, false
 */
async function findYtUrl(search, resultCount = config.paginate_max_results) {
	return new Promise(async (resolve, reject) => {
		try {
			const yt = youtube({
				version: 'v3',
				auth: process.env.GOOGLE_API_TOKEN
			});

			// How many results? By default, just use one. But if resultCount is truthy, use the value in the config.
			const maxResults = Number.isNaN(parseInt(resultCount)) ? config.paginate_max_results : resultCount;

			const params = {
				part: 'id',
				maxResults,
				type: 'video',
				q: search
			};

			await yt.search.list(params, (err, data) => {
				if (err) {
					reject(error);
					return;
				}

				const urls = data.data.items.map(({id}) => `https://www.youtube.com/watch?v=${id.videoId}`);

				resolve(urls);
			});
		} catch (error) {
			reject(error);
		}
	});
}

module.exports = findYtUrl;
