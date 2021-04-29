const getPlayer = require('../utils/functions/getPlayer');

const command = {
	name: 'pop',
	action: async (bot, msg) => {
		try {
			const queue = getPlayer(msg.guild, bot);
			const result = await queue.pop();
			const length = await queue.length();

			if (length === 0) {
				msg.channel.send(__.emptyqueue());
				return;
			}

			if (result) msg.channel.send(__.popsuccess());
		} catch (error) {
			console.error(error);
		}
	}
};

module.exports = command;