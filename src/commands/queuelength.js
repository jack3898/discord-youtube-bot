const getPlayer = require('../utils/functions/getPlayer');

const command = {
	name: 'queuelength',
	action: async (bot, msg) => {
		try {
			const queue = getPlayer(msg.guild, bot);
			const length = await queue.length();

			if (length) msg.reply(result);
		} catch (error) {
			console.error(error);
		}
	}
};

module.exports = command;
