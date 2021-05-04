// Redis database & cache
const redisModule = require('redis');
const redis = redisModule.createClient(config.redis_port);
const findYtUrl = require('./../functions/findYtUrl');
const getVideoDetails = require('./../functions/getVideoDetails');
const ytdl = require('ytdl-core-discord');
const {promisify} = require('util');

// Redis promisified
const redisRpush = promisify(redis.rpush).bind(redis);
const redisRpop = promisify(redis.rpop).bind(redis);
const redisLpop = promisify(redis.lpop).bind(redis);
const redisLrem = promisify(redis.lrem).bind(redis);
const redisLinsert = promisify(redis.linsert).bind(redis);
const redisLindex = promisify(redis.lindex).bind(redis);
const redisLrange = promisify(redis.lrange).bind(redis);
const redisLlen = promisify(redis.llen).bind(redis);
const redisDel = promisify(redis.del).bind(redis);

/**
 * This queue system manages a queue from a Redis database.
 */
class Queue {
	constructor(guild) {
		this.guild = guild;
		this.queueIdentifier = `${config.redis_namespace}:${this.guild.id}:queue`;
	}

	/**
	 * Add a url to the queue. It also adds the video to the cache.
	 * @param {string} string
	 * @returns {Promise<Object>} video details
	 */
	add = string => {
		return new Promise(async (resolve, reject) => {
			try {
				const url = ytdl.validateURL(string) ? string : await findYtUrl(string);
				const data = await redisRpush(this.queueIdentifier, url);

				if (data) {
					const video = await getVideoDetails(url);

					resolve(video);
					return;
				}

				reject(false);
			} catch (error) {
				reject(false);
			}
		});
	};

	/**
	 * Get queue items by page.
	 * @param {number} page Which page you would like to query.
	 * @param {number} [pageSize=config.paginate_max_results] How big the page should be. By default this is the value in the config.
	 * @returns {Promise<Object>} Details about the retrieval including page, page size, page length and of course the queue result itself.
	 */
	get = (page, pageSize = config.paginate_max_results) => {
		return new Promise(async (resolve, reject) => {
			try {
				const validatedPage = parseInt(page) - 1;
				const validatedPageSize = parseInt(pageSize);

				if (Number.isNaN(validatedPage) || Number.isNaN(validatedPageSize)) {
					reject(`The page and or page size provided are not a valid number. Start = ${validatedStart} and finish = ${validatedFinish}.`);
					return;
				}

				const startIndex = validatedPage * validatedPageSize;
				const endIndex = validatedPage * validatedPageSize + validatedPageSize - 1;
				const result = await redisLrange(this.queueIdentifier, startIndex, endIndex);
				const length = await this.length();
				const pages = Math.ceil(length / validatedPageSize);

				resolve({
					queue: result,
					pageSize: result.length,
					startsFrom: startIndex,
					endsFrom: endIndex,
					queueLength: length,
					pages,
					page: validatedPage + 1
				});
			} catch (error) {
				reject(error);
			}
		});
	};

	/**
	 * Get the length of the queue.
	 * @returns {Promise<integer>}
	 */
	length = () => {
		return new Promise(async (resolve, reject) => {
			try {
				const result = await redisLlen(this.queueIdentifier);

				resolve(result);
			} catch (error) {
				reject(error);
			}
		});
	};

	/**
	 * Clear the queue entirely.
	 * @returns
	 */
	clear = () => {
		return new Promise(async (resolve, reject) => {
			try {
				const result = await redisDel(this.queueIdentifier);

				if (result) resolve(true);
				else resolve(false);
			} catch (error) {
				reject(error);
			}
		});
	};

	/**
	 * Remove an item from the right side of the queue (newest).
	 * @returns {Promise<Error|Boolean>}
	 */
	pop = () => {
		return new Promise(async (resolve, reject) => {
			try {
				const result = await redisRpop(this.queueIdentifier);

				resolve(result);
			} catch (error) {
				reject(error);
			}
		});
	};

	/**
	 * Remove an item from the left side of the queue (oldest, current playing).
	 * @returns {Promise<Error|Boolean>}
	 */
	shift = () => {
		return new Promise(async (resolve, reject) => {
			try {
				const result = await redisLpop(this.queueIdentifier);

				resolve(result);
			} catch (error) {
				reject(error);
			}
		});
	};

	/**
	 * Remove and item from the queue.
	 * @param {integer} index
	 */
	remove = (index, value) => {
		return new Promise(async (resolve, reject) => {
			try {
				const result = await redisLrem(this.queueIdentifier, index, value);

				if (result) resolve(true);
				else resolve(false);
			} catch (error) {
				reject(error);
			}
		});
	};

	/**
	 * Move an item in the queue.
	 * @param {*} initialIndex
	 * @param {*} newIndex
	 * @returns {Promise<boolean>}
	 */
	move = (initialIndex, newIndex) => {
		return new Promise(async (resolve, reject) => {
			try {
				const initialIndexAdjusted = parseInt(initialIndex) - 1;
				const newIndexAdjusted = parseInt(newIndex) - 1;

				if (Number.isNaN(initialIndexAdjusted) || Number.isNaN(newIndexAdjusted)) reject('Invalid index values. Integers only.');

				const songToInsertBefore = await redisLindex(this.queueIdentifier, newIndexAdjusted);
				const itemToMove = await redisLindex(this.queueIdentifier, initialIndexAdjusted);
				const removeResult = await this.remove(initialIndexAdjusted, itemToMove);

				if (removeResult) await redisLinsert(this.queueIdentifier, 'BEFORE', songToInsertBefore, itemToMove);

				resolve(true);
			} catch (error) {
				reject(error);
			}
		});
	};
}

module.exports = Queue;
