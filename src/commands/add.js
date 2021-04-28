const getPlayer = require('../utils/functions/getPlayer');

const command = {
	name: 'add',
	/**
	 * TODO: Add validation!
	 */
	action: async (bot, msg, command) => {
		try {
			const queue = getPlayer(msg.guild, bot);

			await queue.add(command.combined);
			msg.reply(__.addedtoqueue());
		} catch (error) {
			console.error(error);
		}
	}
};

module.exports = command;
