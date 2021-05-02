const ytdl = require('ytdl-core-discord');
const redisModule = require('redis');
const redis = redisModule.createClient(config.redis_port);
const {promisify} = require('util');

/**
 * Get the details of a video using ytdl-core-discord. This function adds a cache layer on top of ytdl-core-discord for speeeeed.
 * TODO: When Redis releases official promise support, remove promisify.
 * TODO: Implement RedisJSON. At the moment this does not use RedisJSON and running this function is heavier than it needs to be.
 * @param {string} url
 * @returns {Promise<Object|Boolean>} Object for success, false for failed
 */
function getVideoDetails(url) {
	return new Promise(async (resolve, reject) => {
		try {
			// This function is only useful when a YouTube URL is provided so we check for that.
			if (!ytdl.validateURL(url)) resolve(false);

			// Convert our Redis functions into promises.
			const [redisGet, redisSet, redisExpire] = [redis.get, redis.set, redis.expire].map(func => promisify(func).bind(redis));

			// Fetch data from Redis. May be empty if nothing is in the cache.
			const fromCache = await redisGet(`youtube:${url}`);

			// If the video details are already in the cache, no need to create an API call to YouTube!
			if (fromCache) {
				console.log('Found YouTube info in the cache. Using cache.');
				resolve(JSON.parse(fromCache));
				return;
			}

			// It is now assumed that the if statement above did not work and as such the video details are not in the cache.
			console.log('YouTube video details not found in cache, fetching from the internet...');

			const videoDetails = await ytdl.getBasicInfo(url);

			await redisSet(`youtube:${url}`, JSON.stringify(videoDetails));
			await redisExpire(`youtube:${url}`, config.cache_expiry_in_seconds);

			console.log(`Video details added to cache. Set video details expiry (for url ${url}) to ${config.cache_expiry_in_seconds}s.`);

			resolve(videoDetails);
		} catch (error) {
			console.error('There was a problem whilst attempting to fetch the video details. Log below.');
			reject(error);
		}
	});
}

module.exports = getVideoDetails;
