const getPlayer = require('../utils/functions/getPlayer');

module.exports = {
	name: 'skip',
	action: async (bot, msg) => {
		try {
			const player = getPlayer(msg.guild, bot);
			const result = player.skip();

			if (result) msg.channel.send(__.skipped());
		} catch (error) {
			console.error(error);
			msg.channel.send(__.commanderror());
		}
	}
};
