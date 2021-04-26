const Queue = require('./../utils/Queue');

const command = {
	name: 'pop',
	action: async (bot, msg, command) => {
		try {
			const queue = new Queue(msg.guild);
			await queue.pop();

			msg.reply(`Removed the most recent item from the queue.`);
		} catch (error) {
			console.error(error);
		}
	}
};

module.exports = command;
