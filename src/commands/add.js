const getPlayer = require('../utils/getPlayer');

const command = {
	name: 'add',
	/**
	 * TODO: Add validation!
	 */
	action: async (bot, msg, command) => {
		try {
			const args = command.args;
			const queue = getPlayer(msg.guild, bot);

			await queue.add(args.join(' '));
			msg.reply(__.addedtoqueue());
		} catch (error) {
			console.error(error);
		}
	}
};

module.exports = command;
