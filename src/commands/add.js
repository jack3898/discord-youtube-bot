const getPlayer = require('../utils/getPlayer');

const command = {
	name: 'add',
	action: async (bot, msg, command) => {
		try {
			const args = Array.from(command.args);
			const queue = getPlayer(msg.guild, bot);
			await queue.add(args.join(' '));
			msg.reply(`Added item to the queue!`);
		} catch (error) {
			console.error(error);
		}
	}
};

module.exports = command;
