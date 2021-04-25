const Discord = require('discord.js');

// Redis database & cache
const redisModule = require('redis');
const redis = redisModule.createClient(config.redis_port);

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

	get = () => {
		return new Promise((resolve, reject) => {
			redis.lrange(this.identifier, 0, -1, (err, data) => {
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
