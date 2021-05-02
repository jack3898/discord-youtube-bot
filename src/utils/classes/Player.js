const Discord = require('discord.js');
const Queue = require('./Queue');
const redisModule = require('redis');
const redis = redisModule.createClient(config.redis_port);
const ytdl = require('ytdl-core-discord');
const getPercentage = require('./../functions/getPercentage');

class Player extends Queue {
	constructor(guild) {
		super(guild);
		this.volumeIdentifier = `${config.redis_namespace}:volume:${this.guild.id}`; // Redis key for volume value
		this.connection = null;
		this.dispatcher = null;
		this.bitstream = null;
		this.currentVolume = null;
	}

	/**
	 * Join a voice channel and create a new connection in this instance.
	 * @param {Discord.VoiceChannel} channel The voice channel instance.
	 * @returns {Promise<Boolean>}
	 */
	join = async channel => {
		try {
			this.connection = await channel.join(channel);
			return true;
		} catch (error) {
			return Promise.reject(false);
		}
	};

	/**
	 * Stream a YouTube URL to the voice channel.
	 * TODO: Split some logic into additional methods.
	 * @returns {Promise<Boolean>}
	 */
	stream = () => {
		return new Promise(async (resolve, reject) => {
			try {
				const {queue} = await this.get(1, 1);
				const item = queue[0];

				if (!item) {
					resolve(false);
					return;
				}

				if (!this.connection) throw TypeError('No connection could be found!');

				this.bitstream = await ytdl(item);

				this.currentVolume = (await this.getVolume()) / 100;

				this.dispatcher = await this.connection.play(this.bitstream, {type: 'opus', volume: this.currentVolume});

				this.dispatcher.on('finish', async () => {
					await this.shift();
					resolve(true);
				});
			} catch (error) {
				console.error(error);
				await this.shift();
				reject(false);
			}
		});
	};

	/**
	 * Skip the current playing song
	 */
	skip = async () => {
		try {
			this.dispatcher?.emit('finish');
			return true;
		} catch (error) {
			console.error(error);
			return Promise.reject(false);
		}
	};

	/**
	 * Is the bot busy?
	 * @returns {Promise<Boolean>}
	 */
	playing = () => (this.connection?.speaking.bitfield ? true : false);

	/**
	 * Change the volume of the bot's voice communication.
	 * @param {integer} volume Percentage
	 */
	volume = async volume => {
		try {
			const percentage = getPercentage(volume);

			if (!percentage) return;

			// ytdl-core prefers ranges between 0 - 1 rather than 0 - 100
			const volumeFloat = percentage / 100;

			// Set the volume, if the dispatcher is available.
			await this.dispatcher?.setVolume(volumeFloat);

			if (redis.set(this.volumeIdentifier, percentage)) console.log(`${percentage}% volume value stored in Redis.`);

			return percentage;
		} catch (error) {
			console.error(error);
			return false;
		}
	};

	/**
	 * Get the volume of the bot!
	 * @returns {integer} 0 - 100
	 */
	getVolume = async () => {
		return new Promise((resolve, reject) => {
			redis.get(this.volumeIdentifier, (err, data) => {
				if (err) {
					reject(err);
					return;
				}

				if (!data) {
					resolve(config.default_volume_percent);
					return;
				}

				return resolve(data);
			});
		});
	};

	/**
	 * Mark the bot as not busy and clean up.
	 * TODO: Implement cleanup, and voice channel disconnection.
	 * @returns {Promise<Boolean>}
	 */
	finish = async () => {
		try {
			this.connection?.disconnect();
			this.bitstream?.destroy();
			return true;
		} catch (error) {
			console.log(error);
			return Promise.reject(false);
		}
	};
}

module.exports = Player;
