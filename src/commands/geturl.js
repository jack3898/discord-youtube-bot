const findYtUrl = require('../utils/functions/findYtUrl');

const command = {
	name: 'geturl',
	action: async (bot, msg, command) => {
		try {
			const urls = await findYtUrl(command.combined);

			msg.channel.send(urls.join('\n'));
		} catch (error) {
			console.error(error);
			msg.channel.send(__.commanderror());
		}
	}
};

module.exports = command;
