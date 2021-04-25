const Queue = require('./../utils/Queue');
const ytdl = require('ytdl-core-discord');

const command = {
	name: 'play',
	/**
	 * Play a YouTube video.
	 * TODO: Implement queue, add validation for URLs, add YouTube API integration
	 */
	action: async (bot, msg, command) => {
		try {
			const channel = msg.member.voice.channel;

			if (!channel) {
				msg.reply('You are not in a voice channel.');
				return;
			}

			const queue = new Queue(msg.guild);
			const state = await queue.getState();

			if (state === 'speaking') {
				msg.reply('Bot is already playing!');
				return;
			}

			const args = Array.from(command.args);
			const stream = await ytdl(args[0]);
			const connection = await channel.join();
			const dispatcher = await connection.play(stream, {type: 'opus'});

			await queue.setState('speaking');

			dispatcher.on('finish', async () => {
				channel.leave();
				await queue.setState('ready');
			});
		} catch (error) {
			console.error(error);
		}
	}
};

module.exports = command;
