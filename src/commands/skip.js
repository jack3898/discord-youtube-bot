const getPlayer = require('./../utils/getPlayer');

const command = {
	name: 'skip',
	action: async (bot, msg) => {
		try {
			const player = getPlayer(msg.guild, bot);

			player.skip().then(result => {
				if (result) msg.reply('Skipped!');
			});
		} catch (error) {
			console.error(error);
		}
	}
};

module.exports = command;
