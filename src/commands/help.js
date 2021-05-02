const getFileList = require('./../utils/functions/getFileList');
const getModuleCollection = require('./../utils/functions/getModuleCollection');
const {MessageEmbed} = require('discord.js');

module.exports = {
	name: 'help',
	description: __.help(config.prefix),
	action: async (bot, msg, command) => {
		try {
			const commandModules = getFileList('commands');
			const collection = Array.from(getModuleCollection(commandModules, 'commands'));

			const page = command.args[0] ? parseInt(command.args[0]) - 1 : 0; // Arrays start from index 0, so this will stop users from accessing page 1 with 0
			const perPage = 10;
			const pageCount = Math.ceil(perPage / collection.length) + 1;

			const startIndex = page * perPage;
			const endIndex = page * perPage + perPage;

			if (Number.isNaN(page) || page >= pageCount || page < 0) {
				msg.channel.send(__.invalidpage());
				return;
			}

			const embedFields = collection.slice(startIndex, endIndex).map(item => ({name: `${config.prefix}${item[0]}`, value: item[1].description}));

			const message = new MessageEmbed()
				.setColor(config.success_colour)
				.setTitle(`Help - page ${page + 1} / ${pageCount}`)
				.setDescription(`Get help with this bot.`)
				.addFields(...embedFields);

			if (!message || !message.length) {
				msg.channel.send(__.emptypage());
				return;
			}

			msg.channel.send(message);
		} catch (error) {
			console.error(error);
		}
	}
};
