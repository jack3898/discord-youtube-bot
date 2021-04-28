const getPlayer = require('./../utils/getPlayer');

const command = {
	name: 'pop',
	action: async (bot, msg, command) => {
		try {
			const queue = getPlayer(msg.guild, bot);
			await queue.pop();

			msg.reply(`Removed the most recent item from the queue.`);
		} catch (error) {
			console.error(error);
		}
	}
};

module.exports = command;
