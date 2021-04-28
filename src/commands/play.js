const getPlayer = require('./../utils/getPlayer');

const cmd = {
	name: 'play',
	/**
	 * Play a YouTube video.
	 * TODO: Allow the user to play without using the !addqueue command first, add YouTube API integration
	 */
	action: async (bot, msg, command) => {
		try {
			const channel = msg.member.voice.channel;
			const player = getPlayer(msg.guild, bot);
			const playing = await player.playing();
			const connected = await player.join(channel);

			if (!connected || playing) {
				msg.reply('You are not in a voice channel or I am busy.');
				return;
			}

			// Get the user's item to add to the queue.
			const userItem = Array.from(command.args).join(' ');

			// If the user specified an item to add to the queue, add it.
			if (userItem) await player.add(userItem);

			// Will keep trying to play the next item in the queue until the queue is empty
			while (await player.stream());

			player.finish();
		} catch (error) {
			console.error(error);
		}
	}
};

module.exports = cmd;
