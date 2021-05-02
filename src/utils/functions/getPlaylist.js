const {youtube} = require('@googleapis/youtube');
const {URL} = require('url');

/**
 * Get the contents of a YouTube playlist
 * @param {string} url The playlist URL
 * @param {integer} maxResults How many YouTube videos to fetch from the playlist
 * @returns {Array} A simple list of video URLs from the playlist
 */
function getPlaylist(url, maxResults = config.youtube_playlist_max_results) {
	return new Promise(async (resolve, reject) => {
		try {
			const yt = youtube({
				version: 'v3',
				auth: process.env.GOOGLE_API_TOKEN
			});

			// Extract the list parameter from the URL. This is the playlist id.
			const parsedUrl = new URL(url);
			const {list} = Object.fromEntries(parsedUrl.searchParams);

			if (!(parsedUrl.hostname === 'youtube.com' || parsedUrl.hostname === 'www.youtube.com') || !list) {
				console.log(parsedUrl.hostname, list);
				reject('Invalid url provided');
				return;
			}

			const params = {
				part: 'snippet',
				maxResults,
				playlistId: list
			};

			await yt.playlistItems.list(params, (err, data) => {
				if (err) {
					reject(err);
					return;
				}

				// Transform the results into a list of video urls!
				const videos = data.data.items.map(({snippet}) => `https://www.youtube.com/watch?v=${snippet.resourceId.videoId}`);

				resolve(videos);
			});
		} catch (error) {
			reject(error);
		}
	});
}

module.exports = getPlaylist;
