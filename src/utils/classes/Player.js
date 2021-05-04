const Discord = require('discord.js');
const Queue = require('./Queue');
const redisModule = require('redis');
const redis = redisModule.createClient(config.redis_port);
const ytdl = require('ytdl-core-discord');
const getPercentage = require('./../functions/getPercentage');
const {promisify} = require('util');

// Redis promisified
const redisGet = promisify(redis.get).bind(redis);
const redisSet = promisify(redis.set).bind(redis);

/**
 * The player class handles audio playback into a voice channel and keeps the state of the bots audio independent between Discord guilds.
 */
class Player extends Queue {
	constructor(guild) {
		super(guild);
		this.volumeIdentifier = `${config.redis_namespace}:${this.guild.id}:volume`; // Redis key for volume value
		this.connection = null;
		this.dispatcher = null;
		this.bitstream = null;
		this.currentVolume = null;
	}

	/**
	 * Join a voice channel and create a new connection in this instance.
	 * @param {Discord.VoiceChannel} channel The voice channel instance.
	 * @returns {Promise<boolean>} Successful or not.
	 */
	join = async channel => {
		this.connection = await channel.join(channel);

		return this.connection;
	};

	/**
	 * Stream a YouTube URL to the voice channel. Requires that this.join() has run.
	 * @returns {Promise<boolean>} successful or not.
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
				reject(error);
			}
		});
	};

	/**
	 * Skip the current playing song.
	 * @returns {Promise<boolean>}
	 */
	skip = async () => {
		this.dispatcher?.emit('finish');

		return true;
	};

	/**
	 * Is the bot playing something in the voice channel?
	 * @returns {boolean}
	 */
	playing = () => (this.connection?.speaking.bitfield ? true : false);

	/**
	 * Change the volume of the bot's voice communication. If volume is not supplied, it is assumed the user wants to get the volume.
	 * @param {number} [volume] Percentage. Integer only.
	 * @returns {Promise<number|false>}
	 */
	volume = async volume => {
		const percentage = getPercentage(volume);

		if (!percentage) return;

		// ytdl-core prefers ranges between 0 - 1 rather than 0 - 100
		const volumeFloat = percentage / 100;

		// Set the volume, if the dispatcher is available and then save the user's preference in Redis
		await this.dispatcher?.setVolume(volumeFloat);
		await redisSet(this.volumeIdentifier, percentage);

		return percentage;
	};

	/**
	 * Get the volume of the bot!
	 * @returns {Promise<number>} integer 0 - 100
	 */
	getVolume = async () => {
		const result = await redisGet(this.volumeIdentifier);

		return result ? result : config.default_volume_percent;
	};

	/**
	 * Make the bot terminate any music, leave the channel and destroy the bitstream.
	 * TODO: Implement cleanup, and voice channel disconnection.
	 * @returns {Promise<Boolean>}
	 */
	finish = async () => {
		this.connection?.disconnect();
		this.bitstream?.destroy();

		return true;
	};
}

module.exports = Player;
