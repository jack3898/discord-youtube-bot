const Queue = require('./../utils/Queue');

const command = {
	name: 'getqueue',
	action: async (bot, msg, command) => {
		try {
			const queue = new Queue(msg.guild);
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
