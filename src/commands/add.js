import Player from './../utils/classes/Player.js';

export default {
	name: 'add',
	description: __.add(config.prefix),
	action: async (bot, msg, command) => {
		try {
			const queue = Player.getPlayer(msg.guild, bot);
			const video = await queue.add(command.combined);

			if (video) msg.channel.send(__.addedtoqueue(video.videoDetails.title));
			else msg.channel.send(__.notaddedtoqueue());
		} catch (error) {
			console.error(error);
			msg.channel.send(__.commanderror());
		}
	}
};
