const Player = require('./../utils/Player');

const cmd = {
	name: 'play',
	/**
	 * Play a YouTube video.
	 * TODO: Allow the user to play without using the !addqueue command first, add YouTube API integration
	 */
	action: async (bot, msg, command) => {
		try {
			const channel = msg.member.voice.channel;
			const player = new Player(msg.guild);
			const playing = await player.playing();
			const connected = await player.join(channel);

			if (!connected || playing) {
				msg.reply('You are not in a voice channel or I am busy.');
				return;
			}

			while (await player.stream());

			player.finish();
		} catch (error) {
			console.error(error);
		}
	}
};

module.exports = cmd;
