const getPlaylist = require('./../utils/functions/getPlaylist');
const getPlayer = require('../utils/functions/getPlayer');

module.exports = {
	name: 'playlist',
	description: __.playlist(config.prefix),
	action: async (bot, msg, command) => {
		try {
			const result = await getPlaylist(command.args[0]);
			const queue = await getPlayer(msg.guild, bot);
			const addedUrls = result.map(queue.add);

			await Promise.all(addedUrls);

			msg.channel.send(__.playlistinqueue());
		} catch (error) {
			console.error(error);
			msg.channel.send(__.commanderror());
		}
	}
};
