const getPlayer = require('../utils/functions/getPlayer');

module.exports = {
	name: 'add',
	action: async (bot, msg, command) => {
		try {
			const queue = getPlayer(msg.guild, bot);

			const video = await queue.add(command.combined);
			if (video) msg.channel.send(__.addedtoqueue(video.videoDetails.title));
			else msg.channel.send(__.notaddedtoqueue());
		} catch (error) {
			console.error(error);
			msg.channel.send(__.commanderror());
		}
	}
};
