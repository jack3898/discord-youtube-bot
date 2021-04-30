const getPlayer = require('../utils/functions/getPlayer');

const command = {
	name: 'add',
	action: async (bot, msg, command) => {
		try {
			const queue = getPlayer(msg.guild, bot);

			const video = await queue.add(command.combined);
			msg.channel.send(__.addedtoqueue(video.videoDetails.title));
		} catch (error) {
			console.error(error);
			msg.channel.send(__.commanderror());
		}
	}
};

module.exports = command;
