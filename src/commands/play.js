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

			const args = Array.from(command.args);
			const stream = await ytdl(args[0]);
			const connection = await channel.join();
			const dispatcher = await connection.play(stream, {type: 'opus'});

			dispatcher.on('finish', () => channel.leave());
		} catch (error) {
			console.error(error);
		}
	}
};

module.exports = command;
