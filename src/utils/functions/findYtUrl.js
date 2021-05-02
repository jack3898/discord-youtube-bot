const {youtube} = require('@googleapis/youtube');

/**
 * Attempt to find a YouTube video URL from any given string
 * @param {string} search
 * @param {Boolean} manyResults Return many results. If set, it will use the limit defined in the config.
 * @returns {Array|Boolean} The URL(s) or if an error occurred, false
 */
async function findYtUrl(search, manyResults = false) {
	return new Promise(async (resolve, reject) => {
		try {
			const yt = youtube({
				version: 'v3',
				auth: process.env.GOOGLE_API_TOKEN
			});

			// How many results? By default, just use one. But if manyResults is truthy, use the value in the config.
			const maxResults = manyResults ? config.youtube_search_max_results : 1;

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
