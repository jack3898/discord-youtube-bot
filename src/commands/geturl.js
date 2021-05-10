import {findYtUrl} from './../utils/functions/getHandlers.js';

export default {
	name: 'geturl',
	description: __.geturl(config.prefix),
	action: async (bot, msg, command) => {
		try {
			const urls = await findYtUrl(command.combined, 1);

			msg.channel.send(urls.join('\n'));
		} catch (error) {
			console.error(error);
			msg.channel.send(__.commanderror());
		}
	}
};
