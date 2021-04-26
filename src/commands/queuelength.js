const Queue = require('./../utils/Queue');

const command = {
	name: 'queuelength',
	action: async (bot, msg, command) => {
		try {
			const queue = new Queue(msg.guild);
			const length = await queue.length();

			msg.reply(length);
		} catch (error) {
			console.error(error);
		}
	}
};

module.exports = command;
