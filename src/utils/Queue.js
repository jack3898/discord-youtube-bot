const Discord = require('discord.js');

// Redis database & cache
const redisModule = require('redis');
const redis = redisModule.createClient(config.redis_port);

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
		return new Promise((resolve, reject) => {
			redis.rpush(this.identifier, string, (err, data) => {
				if (err) {
					reject(err);
					return;
				}
				if (data) {
					resolve(true);
					return;
				}
				reject(false);
			});
		});
	};

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

	pop = () => {
		return new Promise((resolve, reject) => {
			redis.lpop(`queue:${this.guild.id}`, (err, data) => {
				if (err) {
					reject(err);
					return;
				}

				resolve(true);
			});
		});
	};

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
