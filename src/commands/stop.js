const getPlayer = require('../utils/functions/getPlayer');

module.exports = {
	name: 'stop',
	action: async (bot, msg) => {
		try {
			const player = getPlayer(msg.guild, bot);
			player.finish();
		} catch (error) {
			console.error(error);
			msg.channel.send(__.commanderror());
		}
	}
};
