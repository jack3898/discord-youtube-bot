const getVideoDetails = require('../utils/functions/getVideoDetails');
const ytdl = require('ytdl-core-discord');

const command = {
	name: 'urltoinfo',
	/**
	 * TODO: Add validation!
	 */
	action: async (bot, msg, command) => {
		try {
			if (!ytdl.validateURL(command.args[0])) {
				msg.reply('Invalid URL!');
				return false;
			}

			const url = command.args[0];

			const resp = await getVideoDetails(url);

			msg.reply(`Video title: \`${resp.videoDetails.title}\``);
		} catch (error) {
			console.error(error);
		}
	}
};

module.exports = command;
