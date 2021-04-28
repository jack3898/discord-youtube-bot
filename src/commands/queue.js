const getPlayer = require('../utils/getPlayer');

const command = {
	name: 'queue',
	action: async (bot, msg, command) => {
		try {
			const queue = getPlayer(msg.guild, bot);
			const result = await queue.get();

			if (result.length === 0) {
				msg.reply('The queue is empty.');
				return;
			}

			const reply = result.map((queueItem, index) => `${index + 1}) ${queueItem}`).join('\n');
			msg.reply(reply);
		} catch (error) {
			console.error(error);
		}
	}
};

module.exports = command;
