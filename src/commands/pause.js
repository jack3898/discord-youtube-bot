const getPlayer = require('../utils/functions/getPlayer');

module.exports = {
	name: 'pause',
	description: __.pause(config.prefix),
	action: async (bot, msg, command) => {
		try {
			const player = getPlayer(msg.guild, bot);
			const minutes = command.args[0] || false;

			const result = await player.pause(minutes);

			if (result === -1) msg.channel.send(__.unabletopause());
			else if (result > 0) msg.channel.send(__.pausedfortime(result));
			else msg.channel.send(__.pausedforever(config.prefix));
		} catch (error) {
			console.error(error);
			msg.channel.send(__.commanderror());
		}
	}
};
