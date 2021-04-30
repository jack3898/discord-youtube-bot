const Discord = require('discord.js');
const Queue = require('./Queue');
const ytdl = require('ytdl-core-discord');

class Player extends Queue {
	constructor(guild) {
		super(guild);
		this.connection = null;
		this.dispatcher = null;
	}

	/**
	 * Join a voice channel and create a new connection in this instance.
	 * @param {Discord.VoiceChannel} channel The voice channel instance.
	 * @returns {Promise<Boolean>}
	 */
	join = async channel => {
		try {
			this.connection = await channel.join(channel);
			await this.setState('speaking');
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
				const [item] = await this.get(0);

				if (!item) {
					resolve(false);
					return;
				}

				if (!this.connection) throw TypeError('No connection could be found!');

				this.dispatcher = await this.connection.play(await ytdl(item), {type: 'opus'});
				this.dispatcher.on('finish', () => {
					this.pop();
					resolve(true);
				});
			} catch (error) {
				console.error(error);
				this.pop();
				reject(false);
			}
		});
	};

	/**
	 * Skip the current playing song
	 */
	skip = async () => {
		try {
			if (this.dispatcher) this.dispatcher.emit('finish');
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
	playing = async () => {
		try {
			const state = await this.getState();
			return state === 'speaking' ? true : false;
		} catch (error) {
			console.error(error);
			return Promise.reject(false);
		}
	};

	/**
	 * Mark the bot as not busy and clean up.
	 * TODO: Implement cleanup, and voice channel disconnection.
	 * @returns {Promise<Boolean>}
	 */
	finish = async () => {
		try {
			this.setState('ready');
			if (!this.connection) return;
			this.connection.disconnect();
			return true;
		} catch (error) {
			console.log(error);
			return Promise.reject(false);
		}
	};
}

module.exports = Player;
