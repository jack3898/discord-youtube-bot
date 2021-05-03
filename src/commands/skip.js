const getPlayer = require('../utils/functions/getPlayer');

module.exports = {
	name: 'skip',
	description: __.skip(config.prefix),
	action: async (bot, msg, command) => {
		try {
			const player = getPlayer(msg.guild, bot);
			const playing = player.playing();
			const moveIndex = command.args[0];

			// The skip command should ideally be used when the player is playing music
			if (!playing) {
				msg.channel.send(__.skipfail());
				return;
			}

			if (moveIndex) {
				// Move the item at identified index to position 2 in queue
				await player.move(moveIndex, 2);
			}

			// Remove song 1, and play item in position 2 (hence why player.move() moved item to position 2)
			const result = player.skip();

			if (result) msg.channel.send(__.skipped());
		} catch (error) {
			console.error(error);
			msg.channel.send(__.commanderror());
		}
	}
};
