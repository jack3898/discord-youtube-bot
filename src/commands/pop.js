const getPlayer = require('./../utils/getPlayer');

const command = {
	name: 'pop',
	action: async (bot, msg) => {
		try {
			const queue = getPlayer(msg.guild, bot);
			const result = await queue.pop();

			if (result) msg.reply(`Removed the most recent item from the queue.`);
		} catch (error) {
			console.error(error);
		}
	}
};

module.exports = command;
