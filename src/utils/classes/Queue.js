// Redis database & cache
const redisModule = require('redis');
const redis = redisModule.createClient(config.redis_port);
const ytdl = require('ytdl-core-discord');
const {promisify} = require('util');
const {findYtUrl, getVideoDetails} = require('./../functions/getHandlers');

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
	add = async string => {
		const url = ytdl.validateURL(string) ? string : await findYtUrl(string, 1);
		const data = await redisRpush(this.queueIdentifier, url);

		if (data) {
			const video = await getVideoDetails(url);

			return video;
		}

		return false;
	};

	/**
	 * Get queue items by page.
	 * @param {number} page Which page you would like to query.
	 * @param {number} [pageSize=config.paginate_max_results] How big the page should be. By default this is the value in the config.
	 * @returns {Promise<Object>} Details about the retrieval including page, page size, page length and of course the queue result itself.
	 */
	get = async (page, pageSize = config.paginate_max_results) => {
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

		return {
			queue: result,
			pageSize: result.length,
			startsFrom: startIndex,
			endsFrom: endIndex,
			queueLength: length,
			pages,
			page: validatedPage + 1
		};
	};

	/**
	 * Get the length of the queue.
	 * @returns {Promise<integer>}
	 */
	length = async () => {
		const result = await redisLlen(this.queueIdentifier);

		return result;
	};

	/**
	 * Clear the queue entirely.
	 * @returns {Promise<boolean>} Successful or not.
	 */
	clear = async () => {
		const result = await redisDel(this.queueIdentifier);

		return result;
	};

	/**
	 * Remove an item from the right side of the queue (newest).
	 * @returns {Promise<Error|Boolean>}
	 */
	pop = async () => {
		const result = await redisRpop(this.queueIdentifier);

		return result;
	};

	/**
	 * Remove an item from the left side of the queue (oldest, current playing).
	 * @returns {Promise<Error|Boolean>}
	 */
	shift = async () => {
		const result = await redisLpop(this.queueIdentifier);

		return result;
	};

	/**
	 * Remove and item from the queue.
	 * @param {integer} index
	 */
	remove = async (index, value) => {
		const result = await redisLrem(this.queueIdentifier, index, value);

		return result;
	};

	/**
	 * Move an item in the queue.
	 * @param {*} initialIndex
	 * @param {*} newIndex
	 * @returns {Promise<boolean>}
	 */
	move = async (initialIndex, newIndex) => {
		const initialIndexAdjusted = parseInt(initialIndex) - 1;
		const newIndexAdjusted = parseInt(newIndex) - 1;

		if (Number.isNaN(initialIndexAdjusted) || Number.isNaN(newIndexAdjusted)) reject('Invalid index values. Integers only.');

		const songToInsertBefore = await redisLindex(this.queueIdentifier, newIndexAdjusted);
		const itemToMove = await redisLindex(this.queueIdentifier, initialIndexAdjusted);
		const removeResult = await this.remove(initialIndexAdjusted, itemToMove);

		if (removeResult) await redisLinsert(this.queueIdentifier, 'BEFORE', songToInsertBefore, itemToMove);

		return true;
	};
}

module.exports = Queue;
