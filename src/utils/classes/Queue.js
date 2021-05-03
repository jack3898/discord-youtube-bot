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
const redisLinsert = promisify(redis.linsert).bind(redis);
const redisLindex = promisify(redis.lindex).bind(redis);
const redisLrange = promisify(redis.lrange).bind(redis);
const redisLlen = promisify(redis.llen).bind(redis);

/**
 * This queue system manages a queue from a Redis database.
 * There are two keys that get added and queried throughout all methods:
 * - guild:<ID> this is the guild the queue relates to.
 * - queuestate:<ID> this is the state of the queue. This can mean many things, which can prevent the queue from being modified or prevent the bot from doing things.
 */
class Queue {
	constructor(guild) {
		this.guild = guild;
		this.queueIdentifier = `${config.redis_namespace}:queue:${this.guild.id}`;
	}

	/**
	 * Add a string to the queue.
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
				console.error(error);
				reject(false);
			}
		});
	};

	/**
	 * Get a queue items. By default, it gets everything.
	 * @param {Promise<integer>} index Where the range ends.
	 * @returns
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
				console.error(error);
				reject(error);
			}
		});
	};

	/**
	 * Get the length of the queue.
	 * @returns {Promise<Error|integer>}
	 */
	length = () => {
		return new Promise(async (resolve, reject) => {
			try {
				const result = await redisLlen(this.queueIdentifier);
				resolve(result);
			} catch (error) {
				reject(err);
			}
		});
	};

	clear = () => {
		return new Promise((resolve, reject) => {
			if (redis.del(this.queueIdentifier)) resolve(true);
			else reject(false);
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
				console.error(error);
				reject(err);
			}
		});
	};

	/**
	 * Remove and item from the queue
	 * @param {integer} index
	 */
	remove = async (index, value) => {
		const redisLrem = promisify(redis.lrem).bind(redis);
		const result = await redisLrem(this.queueIdentifier, index, value);

		if (result) return true;
		return false;
	};

	/**
	 * Move an item in the queue
	 * @param {*} initialIndex
	 * @param {*} newIndex
	 * @returns
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

				console.log(removeResult);
				resolve(true);
			} catch (error) {
				console.error(error);
				reject(false);
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
				console.error(error);
				reject(error);
			}
		});
	};
}

module.exports = Queue;
