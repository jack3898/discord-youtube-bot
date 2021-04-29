const {Collection} = require('discord.js');
const getFileList = require('./../functions/getFileList');
const getModuleCollection = require('./../functions/getModuleCollection');

function onBotReady(bot) {
	console.log(__.botactive(bot.user.username));

	const commandModules = getFileList('commands');

	bot.commands = getModuleCollection(commandModules, 'commands');
	bot.players = new Collection(); // This stores one Player instance per guild, which controls music playback. use GetPlayers in /utils to get these instances.
}

module.exports = onBotReady;
