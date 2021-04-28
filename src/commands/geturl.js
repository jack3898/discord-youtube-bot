const findYtUrl = require('../utils/functions/findYtUrl');

const command = {
	name: 'geturl',
	action: async (bot, msg, command) => {
		try {
			const urls = await findYtUrl(command.combined);

			msg.reply(urls.join('\n'));
		} catch (error) {
			console.error(error);
		}
	}
};

module.exports = command;
