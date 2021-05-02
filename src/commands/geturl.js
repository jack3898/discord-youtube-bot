const findYtUrl = require('../utils/functions/findYtUrl');

module.exports = {
	name: 'geturl',
	description: __.geturl(config.prefix),
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
