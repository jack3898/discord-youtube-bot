const getPlayer = require('../utils/functions/getPlayer');

const command = {
	name: 'queuelength',
	action: async (bot, msg) => {
		try {
			const queue = getPlayer(msg.guild, bot);
			const length = await queue.length();

			if (length) msg.channel.send(result);
		} catch (error) {
			console.error(error);
			msg.channel.send(__.commanderror());
		}
	}
};

module.exports = command;
