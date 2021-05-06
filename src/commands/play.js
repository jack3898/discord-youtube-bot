const {getPlayer} = require('./../utils/classes/Player');

module.exports = {
	name: 'play',
	description: __.play(config.prefix),
	action: async (bot, msg, command) => {
		try {
			const channel = msg.member.voice.channel;
			const player = getPlayer(msg.guild, bot);
			const playing = player.playing();
			const connected = await player.join(channel);

			if (!connected || playing) {
				msg.channel.send(__.invoiceorbusy());
				return;
			}

			// Get the user's item to add to the queue.
			const userItem = command.combined;

			// If the user specified an item to add to the queue, add it.
			if (userItem) {
				const video = await player.add(userItem);
				if (video.videoDetails.title) msg.channel.send(__.playing(video.videoDetails.title));
			}

			// Will keep trying to play the next item in the queue until the queue is empty
			while (await player.stream());

			player.finish();
		} catch (error) {
			console.error(error);

			const player = getPlayer(msg.guild, bot);
			await player.finish();
			msg.channel.send(__.commanderror());
		}
	}
};
