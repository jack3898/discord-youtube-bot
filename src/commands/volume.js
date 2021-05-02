const getPlayer = require('../utils/functions/getPlayer');

module.exports = {
	name: 'volume',
	description: __.volume(config.prefix),
	action: async (bot, msg, command) => {
		try {
			const player = getPlayer(msg.guild, bot);

			// If the user did not specify a volume value, it is assumed they just want to know the current volume
			if (!command.args.length) {
				const volume = await player.getVolume();
				if (volume) msg.channel.send(__.currentvolume(volume));
				return;
			}

			const result = await player.volume(command.args[0]);
			if (result) msg.channel.send(__.volumeset(result));
		} catch (error) {
			console.error(error);
			msg.channel.send(__.commanderror());
		}
	}
};
