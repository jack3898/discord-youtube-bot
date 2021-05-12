import Discord from 'discord.js';
import Queue from './Queue.js';
import redisModule from 'redis';
import ytdl from 'ytdl-core-discord';
import {getPercentage} from './../functions/getHandlers.js';
import {promisify} from 'util';

const redis = redisModule.createClient(config.redis_port);

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
	 * Get the audio player for a given guild. This allows the bot to play different queues in different guilds.
	 * If no player is found for the guild, it creates a new one and returns an empty player.
	 * @returns {Player}
	 */
	static getPlayer = (guild, bot) => {
		if (!guild instanceof Discord.Guild) throw TypeError('Argument 1, "guild" is not an instance of Discord.Guild!');

		const player = bot.players.get(guild.id);
		if (player instanceof this) return player;

		bot.players.set(guild.id, new this(guild, bot));
		return bot.players.get(guild.id);
	};

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
				await this.skip();
				resolve(true);
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
	 * Pause the dispatcher. You may optionally provide a duration in minutes and it will auto-resume.
	 * @param {number} [duration=false]
	 * @returns {number} How long the bot is paused for in minutes. 0 = forever. -1 = no pause.
	 */
	pause = async (duration = false) => {
		if (!this.dispatcher) return -1;

		this.dispatcher.pause(true);

		let durationInt = parseInt(duration);

		if (!Number.isNaN(durationInt)) {
			durationInt = durationInt < 1440 ? durationInt : 1440; // Cap it at one day.

			const minutesToMilli = durationInt * 60 * 1000;
			setTimeout(this.resume, minutesToMilli);
			return durationInt;
		}

		return 0;
	};

	/**
	 * Resume the dispatcher.
	 * @param {} volume
	 * @returns
	 */
	resume = async () => {
		if (this.dispatcher.paused) {
			this.dispatcher.resume();
			return true;
		}

		return false;
	};

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

export default Player;
