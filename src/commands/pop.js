const getPlayer = require('./../utils/getPlayer');

const command = {
	name: 'pop',
	action: async (bot, msg) => {
		try {
			const queue = getPlayer(msg.guild, bot);
			const result = await queue.pop();

			if (result) msg.reply(__.popsuccess());
		} catch (error) {
			console.error(error);
		}
	}
};

module.exports = command;
