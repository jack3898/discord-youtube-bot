const getVideoDetails = require('../utils/functions/getVideoDetails');
const ytdl = require('ytdl-core-discord');

const command = {
	name: 'urltoinfo',

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

module.exports = command;
