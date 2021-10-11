import ytdl from 'ytdl-core-discord';
import { getVideoDetails } from './../utils/functions/getHandlers.js';

export default {
	name: 'urltoinfo',
	description: __.urltoinfo(config.prefix),
	action: async (bot, msg, command) => {
		try {
			if (!ytdl.validateURL(command.args[0])) {
				msg.channel.send('Invalid URL!');
				return false;
			}

			const url = command.args[0];

			const resp = await getVideoDetails(url);

			msg.channel.send(`Video title: \`${resp.videoDetails.title}\``);
		} catch (error) {
			console.error(error);
			msg.channel.send(__.commanderror());
		}
	}
};
