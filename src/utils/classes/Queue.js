// Redis database & cache
const redisModule = require('redis');
const redis = redisModule.createClient(config.redis_port);
const findYtUrl = require('./../functions/findYtUrl');
const ytdl = require('ytdl-core-discord');

/**
 * This queue system manages a queue from a Redis database.
 * There are two keys that get added and queried throughout all methods:
 * 	- guild:<ID> this is the guild the queue relates to.
 *  - queuestate:<ID> this is the state of the queue. This can mean many things, which can prevent the queue from being modified or prevent the bot from doing things.
 */
class Queue {
	constructor(guild) {
		this.guild = guild;
		this.identifier = `queue:${this.guild.id}`;
	}

	/**
	 * Add a string to the queue.
	 * @param {string} string
	 */
	add = string => {
		return new Promise(async (resolve, reject) => {
			const url = ytdl.validateURL(string) ? string : await findYtUrl(string);

			redis.rpush(this.identifier, url, async (err, data) => {
				if (err) {
					reject(err);
					return;
				}
				if (data) {
					const video = await ytdl.getInfo(url);
					resolve(video);
					return;
				}
				reject(false);
			});
		});
	};

	/**
	 * Get a queue items. By default, it gets everything.
	 * @param {integer} index Where the range ends.
	 * @returns
	 */
	get = (index = -1) => {
		return new Promise((resolve, reject) => {
			redis.lrange(this.identifier, 0, index, (err, data) => {
				if (err) {
					reject(err);
					return;
				}

				resolve(data);
			});
		});
	};

	/**
	 * Get the length of the queue.
	 * @returns {Promise<Error|integer>}
	 */
	length = () => {
		return new Promise((resolve, reject) => {
			redis.llen(this.identifier, (err, data) => {
				if (err) {
					reject(err);
					return;
				}

				resolve(data);
			});
		});
	};

	/**
	 * Remove an item from the right side of the queue (newest).
	 * @returns {Promise<Error|Boolean>}
	 */
	pop = () => {
		return new Promise((resolve, reject) => {
			redis.rpop(`queue:${this.guild.id}`, (err, data) => {
				if (err) {
					reject(err);
					return;
				}

				resolve(true);
			});
		});
	};

	/**
	 * The state of the bot right now. Is it "playing"? Is it "ready"?
	 * @param {string} state
	 * @returns
	 */
	setState = state => {
		return new Promise((resolve, reject) => {
			redis.set(`queuestate:${this.guild.id}`, state, (err, data) => {
				if (err) {
					reject(err);
					return;
				}

				resolve(true);
			});
		});
	};

	/**
	 * Get the state of the bot.
	 * @returns {string}
	 */
	getState = () => {
		return new Promise((resolve, reject) => {
			redis.get(`queuestate:${this.guild.id}`, (err, data) => {
				if (err) {
					reject(err);
					return;
				}

				resolve(data);
			});
		});
	};
}

module.exports = Queue;