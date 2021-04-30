const getPlayer = require('../utils/functions/getPlayer');

const command = {
	name: 'stop',
	action: async (bot, msg) => {
		try {
			const player = getPlayer(msg.guild, bot);
			player.finish();
		} catch (error) {
			console.error(error);
		}
	}
};

module.exports = command;