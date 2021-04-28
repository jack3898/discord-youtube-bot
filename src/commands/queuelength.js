const getPlayer = require('./../utils/getPlayer');

const command = {
	name: 'queuelength',
	action: async (bot, msg, command) => {
		try {
			const queue = getPlayer(msg.guild, bot);
			const length = await queue.length();

			msg.reply(length);
		} catch (error) {
			console.error(error);
		}
	}
};

module.exports = command;
