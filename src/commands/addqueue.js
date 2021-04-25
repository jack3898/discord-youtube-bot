const Queue = require('./../utils/Queue');

const command = {
	name: 'addqueue',
	action: async (bot, msg, command) => {
		try {
			const queue = new Queue(msg.guild);
			await queue.add(msg.content);
			msg.reply(`Added item to the queue!`);
		} catch (error) {
			console.error(error);
		}
	}
};

module.exports = command;
