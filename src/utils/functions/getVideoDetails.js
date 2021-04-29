const ytdl = require('ytdl-core-discord');
const redisModule = require('redis');
const redis = redisModule.createClient(config.redis_port);

/**
 * Get the details of a video using ytdl-core-discord. This function adds a cache layer on top of ytdl-core-discord for speeeeed.
 * @param {string} url
 * @returns {Promise<Object|Boolean>} Object for success, false for failed
 */
function getVideoDetails(url) {
	return new Promise((resolve, reject) => {
		if (!ytdl.validateURL(url)) resolve(false);

		redis.get(`youtube:${url}`, async (err, data) => {
			if (err) reject(err);

			if (data) {
				resolve(JSON.parse(data));
				console.log('Found YouTube info in the cache. Using cache.');
				return;
			}

			console.log('YouTube video details not found in cache, fetching from the internet...');

			const videoDetails = await ytdl.getInfo(url);

			resolve(videoDetails);

			redis.set(`youtube:${url}`, JSON.stringify(videoDetails), err => {
				if (err) {
					console.error('Failed to add YouTube details to Redis cache!');
					console.error(err);
					return;
				}

				console.log(`Added YouTube video details (${url}) to cache!`);

				redis.expire(`youtube:${url}`, config.cache_expiry_in_seconds, err => {
					if (err) {
						console.error('Failed to set expiry on cache! In the future, the cache may become too large for this server to handle!');
						console.error(err);
						return;
					}

					console.log(`Set video details expiry (for url ${url}) to ${config.cache_expiry_in_seconds}s.`);
				});
			});
		});
	});
}

module.exports = getVideoDetails;
