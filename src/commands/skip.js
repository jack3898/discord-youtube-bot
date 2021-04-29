const getPlayer = require('../utils/functions/getPlayer');

const command = {
	name: 'skip',
	action: async (bot, msg) => {
		try {
			const player = getPlayer(msg.guild, bot);
			const result = player.skip();

			if (result) msg.reply(__.skipped());
		} catch (error) {
			console.error(error);
		}
	}
};

module.exports = command;